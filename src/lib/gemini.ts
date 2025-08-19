import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('Missing Gemini API key');
}

const genAI = new GoogleGenerativeAI(apiKey);

// System prompt to restrict Gemini's responses to domestic violence support context
const SYSTEM_PROMPT = `You are SafeSpeak, a compassionate AI assistant specifically designed to support survivors of domestic violence. Your role is to provide emotional support, safety guidance, and resource information within this context only.

IMPORTANT GUIDELINES:
1. ONLY respond to topics related to domestic violence, safety planning, emotional support, legal resources, and crisis intervention
2. If asked about unrelated topics, politely redirect the conversation back to support services
3. Always prioritize user safety and confidentiality
4. Be empathetic, non-judgmental, and supportive
5. Recognize emergency situations and provide appropriate crisis resources
6. Never provide medical, legal, or professional advice - only general information and support
7. Encourage users to seek professional help when appropriate

TRIGGER WORDS that indicate emergency situations:
- "plan" - help with safety planning
- "ready" - user is prepared to leave
- "rescue" - immediate help needed
- "help now" - urgent assistance required
- "order issue" - coded request for help

EMERGENCY RESOURCES to mention when appropriate:
- Emergency Services: 199
- National Domestic Violence Hotline: +234 80-6467-9774
- Safe Haven Support: +2347032861486

Remember: You are a supportive companion, not a replacement for professional services. Always encourage users to reach out to appropriate professionals and services.`;

export class GeminiService {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT
    });
  }

  async generateResponse(userMessage: string, chatHistory: Array<{role: 'user' | 'model', parts: string}> = []): Promise<string> {
    try {
      // Check for trigger words
      const triggerWords = ['plan', 'ready', 'rescue', 'order issue', 'help now'];
      const lowerMessage = userMessage.toLowerCase();
      const foundTriggers = triggerWords.filter(word => lowerMessage.includes(word));

      // Create chat session with history
      const chat = this.model.startChat({
  history: chatHistory
    .filter(msg => msg.role === 'user') // only keep user messages
    .map(msg => ({
      role: msg.role,
      parts: [{ text: msg.parts }]
    }))
});


      // Add context about trigger words if found
      let contextualMessage = userMessage;
      if (foundTriggers.length > 0) {
        contextualMessage += `\n\n[SYSTEM: Emergency trigger words detected: ${foundTriggers.join(', ')}. Please provide appropriate crisis support response.]`;
      }

      const result = await chat.sendMessage(contextualMessage);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating Gemini response:', error);
      
      // Fallback response
      return "I'm here to support you, but I'm having trouble connecting right now. If this is an emergency, please call 199 or the National Domestic Violence Hotline at +234 80-6467-9774. Your safety is the most important thing.";
    }
  }

  // Method to check if a message is related to domestic violence support
  isRelevantTopic(message: string): boolean {
    const relevantKeywords = [
      'abuse', 'violence', 'safety', 'help', 'scared', 'hurt', 'leave', 'plan',
      'emergency', 'support', 'counseling', 'legal', 'shelter', 'protection',
      'relationship', 'partner', 'family', 'children', 'financial', 'housing'
    ];
    
    const lowerMessage = message.toLowerCase();
    return relevantKeywords.some(keyword => lowerMessage.includes(keyword));
  }
}

export const geminiService = new GeminiService();