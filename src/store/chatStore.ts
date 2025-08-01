import { create } from 'zustand';
import { ChatMessage } from '../types';

interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  triggerWords: string[];
  addMessage: (message: ChatMessage) => void;
  setTyping: (typing: boolean) => void;
  clearChat: () => void;
  processMessage: (userMessage: string) => void;
}

const TRIGGER_WORDS = ['plan', 'ready', 'rescue', 'order issue', 'help now'];

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isTyping: false,
  triggerWords: TRIGGER_WORDS,
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  
  setTyping: (typing) => set({ isTyping: typing }),
  
  clearChat: () => set({ messages: [] }),
  
  processMessage: (userMessage: string) => {
    const state = get();
    const lowerMessage = userMessage.toLowerCase();
    const foundTriggers = TRIGGER_WORDS.filter(word => lowerMessage.includes(word));
    
    // Add user message
    const userChatMessage: ChatMessage = {
      id: Date.now().toString(),
      message: userMessage,
      isUser: true,
      timestamp: new Date(),
      triggerWords: foundTriggers,
      isEmergency: foundTriggers.length > 0
    };
    
    state.addMessage(userChatMessage);
    state.setTyping(true);
    
    // Generate AI response
    setTimeout(() => {
      let aiResponse = '';
      
      if (foundTriggers.length > 0) {
        // Emergency response
        if (foundTriggers.includes('help now') || foundTriggers.includes('rescue')) {
          aiResponse = "I understand you need immediate help. Are you in a safe location right now? If this is a life-threatening emergency, please call 911. I can help you create a safety plan or connect you with local resources. Your safety is my priority.";
        } else if (foundTriggers.includes('plan')) {
          aiResponse = "I can help you create a safety plan. This includes identifying safe places to go, important documents to gather, and trusted people to contact. Would you like to start working on this together?";
        } else if (foundTriggers.includes('ready')) {
          aiResponse = "It sounds like you're preparing to take action. I'm here to support you. Do you have a safe place to go? Have you gathered important documents? Remember, you're brave and you deserve safety.";
        }
      } else {
        // Regular supportive responses
        const responses = [
          "I'm here to listen and support you. Take your time - there's no pressure to share more than you're comfortable with.",
          "Thank you for trusting me with your concerns. You're taking a brave step by reaching out. How are you feeling right now?",
          "Your safety and wellbeing matter. I'm here to help you explore your options and find resources that might be helpful.",
          "You're not alone in this. Many people face similar challenges, and there are people and resources available to help you."
        ];
        aiResponse = responses[Math.floor(Math.random() * responses.length)];
      }
      
      const aiChatMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: aiResponse,
        isUser: false,
        timestamp: new Date(),
        isEmergency: foundTriggers.length > 0
      };
      
      state.addMessage(aiChatMessage);
      state.setTyping(false);
    }, 1500);
  }
}));