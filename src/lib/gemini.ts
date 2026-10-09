import { supabase } from './supabase';

// SafeSpeak client: calls the secure server-side Edge Function instead of
// talking to Gemini directly. No API key is present in the frontend.

const FALLBACK =
  "I'm here to support you, but I'm having trouble connecting right now. If this is an emergency, please call 199 or the National Domestic Violence Hotline at +234 80-6467-9774. Your safety is the most important thing.";

export class GeminiService {
  async generateResponse(
    userMessage: string,
    chatHistory: Array<{ role: 'user' | 'model'; parts: string }> = []
  ): Promise<string> {
    try {
      const { data } = await supabase.functions.invoke('safespeak-chat', {
        body: { message: userMessage, history: chatHistory },
      });

      if (data && typeof data.reply === 'string') {
        return data.reply;
      }

      return FALLBACK;
    } catch (error) {
      console.error('Error contacting SafeSpeak service:', error);
      return FALLBACK;
    }
  }

  // Simple client-side relevance helper (unchanged behavior).
  isRelevantTopic(message: string): boolean {
    const relevantKeywords = [
      'abuse', 'violence', 'safety', 'help', 'scared', 'hurt', 'leave', 'plan',
      'emergency', 'support', 'counseling', 'legal', 'shelter', 'protection',
      'relationship', 'partner', 'family', 'children', 'financial', 'housing',
    ];
    const lowerMessage = message.toLowerCase();
    return relevantKeywords.some((keyword) => lowerMessage.includes(keyword));
  }
}

export const geminiService = new GeminiService();
