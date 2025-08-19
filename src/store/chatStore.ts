import { create } from 'zustand';
import { ChatMessage } from '../types';
import { supabase } from '../lib/supabase';
import { geminiService } from '../lib/gemini';
import { useAuthStore } from './authStore';

interface ChatState {
  messages: ChatMessage[];
  currentSessionId: string | null;
  isTyping: boolean;
  triggerWords: string[];
  loading: boolean;
  addMessage: (message: ChatMessage) => void;
  setTyping: (typing: boolean) => void;
  clearChat: () => Promise<void>;
  processMessage: (userMessage: string) => void;
  loadChatHistory: () => Promise<void>;
  createNewSession: () => Promise<void>;
}

const TRIGGER_WORDS = ['plan', 'ready', 'rescue', 'order issue', 'help now'];

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  currentSessionId: null,
  isTyping: false,
  triggerWords: TRIGGER_WORDS,
  loading: false,

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),

  setTyping: (typing) => set({ isTyping: typing }),

  clearChat: async () => {
    set({ messages: [], currentSessionId: null });
  },

  createNewSession: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title: 'New Chat Session'
        })
        .select()
        .single();

      if (error) throw error;

      set({ currentSessionId: data.id, messages: [] });
    } catch (error) {
      console.error('Error creating chat session:', error);
    }
  },

  loadChatHistory: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    set({ loading: true });
    try {
      // Get the most recent session
      const { data: sessions, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (sessionError) throw sessionError;

      let sessionId = sessions?.[0]?.id;

      // Create new session if none exists
      if (!sessionId) {
        const { data: newSession, error: createError } = await supabase
          .from('chat_sessions')
          .insert({
            user_id: user.id,
            title: 'New Chat Session'
          })
          .select()
          .single();

        if (createError) throw createError;
        sessionId = newSession.id;
      }

      set({ currentSessionId: sessionId });

      // Load messages for this session
      const { data: messages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      const chatMessages: ChatMessage[] = messages.map(msg => ({
        id: msg.id,
        message: msg.message,
        isUser: msg.is_user,
        timestamp: new Date(msg.created_at),
        triggerWords: msg.trigger_words,
        isEmergency: msg.is_emergency
      }));

      set({ messages: chatMessages, loading: false });
    } catch (error) {
      console.error('Error loading chat history:', error);
      set({ loading: false });
    }
  },

  processMessage: async (userMessage: string) => {
    const state = get();
    const { user } = useAuthStore.getState();

    if (!user || !state.currentSessionId) return;

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

    // Save user message to database
    try {
      await supabase.from('chat_messages').insert({
        session_id: state.currentSessionId,
        user_id: user.id,
        message: userMessage,
        is_user: true,
        trigger_words: foundTriggers,
        is_emergency: foundTriggers.length > 0
      });
    } catch (error) {
      console.error('Error saving user message:', error);
    }

    // Generate AI response using Gemini
    try {
      // Prepare chat history for Gemini
      // Prepare chat history for Gemini
      let chatHistory = state.messages.slice(-10).map(msg => ({
        role: msg.isUser ? 'user' as const : 'model' as const,
        parts: msg.message
      }));

      // Gemini requires the first message to be from the user
      if (chatHistory.length > 0 && chatHistory[0].role !== 'user') {
        // Drop leading model messages until a user message is first
        chatHistory = chatHistory.slice(chatHistory.findIndex(m => m.role === 'user'));
      }


      const aiResponse = await geminiService.generateResponse(userMessage, chatHistory);

      const aiChatMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: aiResponse,
        isUser: false,
        timestamp: new Date(),
        isEmergency: foundTriggers.length > 0
      };

      state.addMessage(aiChatMessage);

      // Save AI response to database
      try {
        await supabase.from('chat_messages').insert({
          session_id: state.currentSessionId,
          user_id: user.id,
          message: aiResponse,
          is_user: false,
          trigger_words: [],
          is_emergency: foundTriggers.length > 0
        });
      } catch (error) {
        console.error('Error saving AI message:', error);
      }
    } catch (error) {
      console.error('Error generating AI response:', error);

      // Fallback response
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: "I'm here to support you, but I'm having trouble connecting right now. If this is an emergency, please call 199 or the National Domestic Violence Hotline at +234 80-6467-9774. Your safety is the most important thing.",
        isUser: false,
        timestamp: new Date(),
        isEmergency: true
      };

      state.addMessage(fallbackMessage);
    } finally {
      state.setTyping(false);
    }
  }
}));