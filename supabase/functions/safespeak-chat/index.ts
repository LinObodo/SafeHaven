// SafeSpeak secure chat Edge Function.
//
// Moves all Google Gemini usage server-side so the API key is never exposed
// to the browser. Authenticated (incl. anonymous Supabase) users only.
//
// Deploy:  supabase functions deploy safespeak-chat
// Secrets: supabase secrets set GEMINI_API_KEY=...
//          (SUPABASE_URL and SUPABASE_ANON_KEY are provided automatically)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') ?? '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

const GEMINI_MODEL = 'gemini-1.5-flash';
const GEMINI_ENDPOINT =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// --- Validation limits ---
const MAX_MESSAGE_LENGTH = 4000;
const MAX_HISTORY = 10;

// --- Basic in-memory rate limiting (per user, best-effort) ---
const RATE_LIMIT_MAX = 20; // requests
const RATE_LIMIT_WINDOW_MS = 60_000; // per minute
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function rateLimited(userId: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(userId);
  if (!bucket || now > bucket.resetAt) {
    rateBuckets.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX;
}

const TRIGGER_WORDS = ['plan', 'ready', 'rescue', 'order issue', 'help now'];

const SYSTEM_PROMPT =
  `You are SafeSpeak, a compassionate AI assistant specifically designed to support survivors of domestic violence. Your role is to provide emotional support, safety guidance, and resource information within this context only.

IMPORTANT GUIDELINES:
1. ONLY respond to topics related to domestic violence, safety planning, emotional support, legal resources, and crisis intervention
2. If asked about unrelated topics, politely redirect the conversation back to support services
3. Always prioritize user safety and confidentiality
4. Be empathetic, non-judgmental, and supportive
5. Recognize emergency situations and provide appropriate crisis resources
6. Never provide medical, legal, or professional advice - only general information and support
7. Encourage users to seek professional help when appropriate

EMERGENCY RESOURCES to mention when appropriate:
- Emergency Services: 199
- National Domestic Violence Hotline: +234 80-6467-9774
- Safe Haven Support: +2347032861486

Remember: You are a supportive companion, not a replacement for professional services.`;

const FALLBACK =
  "I'm here to support you, but I'm having trouble connecting right now. If this is an emergency, please call 199 or the National Domestic Violence Hotline at +234 80-6467-9774. Your safety is the most important thing.";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  // --- Auth: require a valid Supabase session (incl. anonymous) ---
  const authHeader = req.headers.get('Authorization') ?? '';
  if (!authHeader.startsWith('Bearer ')) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData?.user) {
    return json({ error: 'Unauthorized' }, 401);
  }
  const userId = userData.user.id;

  // --- Rate limiting ---
  if (rateLimited(userId)) {
    return json({ error: 'Too many requests. Please wait a moment and try again.' }, 429);
  }

  // --- Request validation ---
  let payload: { message?: unknown; history?: unknown };
  try {
    payload = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const message = typeof payload.message === 'string' ? payload.message.trim() : '';
  if (!message) {
    return json({ error: 'A non-empty message is required.' }, 400);
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return json({ error: 'Message is too long.' }, 400);
  }

  // Normalize + clamp history to the last MAX_HISTORY user/model turns.
  const rawHistory = Array.isArray(payload.history) ? payload.history : [];
  const history = rawHistory
    .filter(
      (h): h is { role: string; parts: string } =>
        !!h && typeof h === 'object' &&
        (((h as Record<string, unknown>).role === 'user') ||
          ((h as Record<string, unknown>).role === 'model')) &&
        typeof (h as Record<string, unknown>).parts === 'string',
    )
    .slice(-MAX_HISTORY)
    .map((h) => ({ role: h.role, parts: [{ text: String(h.parts).slice(0, MAX_MESSAGE_LENGTH) }] }));

  // Gemini requires the first turn to be from the user.
  while (history.length > 0 && history[0].role !== 'user') {
    history.shift();
  }

  const lower = message.toLowerCase();
  const foundTriggers = TRIGGER_WORDS.filter((w) => lower.includes(w));
  let contextualMessage = message;
  if (foundTriggers.length > 0) {
    contextualMessage +=
      `\n\n[SYSTEM: Emergency trigger words detected: ${foundTriggers.join(', ')}. Please provide appropriate crisis support response.]`;
  }

  if (!GEMINI_API_KEY) {
    return json({ reply: FALLBACK, triggerWords: foundTriggers }, 200);
  }

  // --- Call Gemini (REST) ---
  try {
    const contents = [
      ...history,
      { role: 'user', parts: [{ text: contextualMessage }] },
    ];

    const res = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
      }),
    });

    if (!res.ok) {
      console.error('Gemini error:', res.status, await res.text());
      return json({ reply: FALLBACK, triggerWords: foundTriggers }, 200);
    }

    const data = await res.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('') ||
      FALLBACK;

    return json({ reply, triggerWords: foundTriggers }, 200);
  } catch (err) {
    console.error('Error calling Gemini:', err);
    return json({ reply: FALLBACK, triggerWords: foundTriggers }, 200);
  }
});
