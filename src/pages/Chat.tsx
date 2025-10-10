import React, { useState, useRef, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Send, Bot, User, Shield, AlertTriangle } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';
import QuickExitButton from '../components/Common/QuickExitButton';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Chat: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isTyping, processMessage, clearChat, loadChatHistory, createNewSession, loading } = useChatStore();
  const { user, isAuthenticated } = useAuthStore();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
  const timeout = setTimeout(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, 50);

  return () => clearTimeout(timeout);
}, [messages, isTyping]);


  useEffect(() => {
    // Load chat history when component mounts
    const initializeChat = async () => {
      await loadChatHistory();

      // Add welcome message if no messages exist
      const currentMessages = useChatStore.getState().messages;
      if (currentMessages.length === 0) {
        const welcomeMessage = {
          id: 'welcome',
          message: "Hello, I'm SafeSpeak, your confidential support assistant. I'm here to listen and help you explore your options in a safe, judgment-free space. Are you in a safe place to talk right now?",
          isUser: false,
          timestamp: new Date(),
        };
        useChatStore.getState().addMessage(welcomeMessage);
      }
    };

    if (isAuthenticated) {
      initializeChat();
    }
  }, [isAuthenticated, loadChatHistory]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      processMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = async () => {
    await clearChat();
    await createNewSession();

    // Add welcome message for new session
    const welcomeMessage = {
      id: 'welcome-new',
      message: "Hello, I'm SafeSpeak, your confidential support assistant. I'm here to listen and help you explore your options in a safe, judgment-free space. Are you in a safe place to talk right now?",
      isUser: false,
      timestamp: new Date(),
    };
    useChatStore.getState().addMessage(welcomeMessage);
  };
  const quickResponses = [
    "I need help with safety planning",
    "I'm not sure if what I'm experiencing is abuse",
    "I need information about legal options",
    "I'm scared to leave",
    "I need help with my children",
    "I need financial assistance"
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your chat...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <QuickExitButton />

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-4 py-3 sm:py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-full">
              <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">SafeSpeak</h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Your confidential AI assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
            <span className="text-xs sm:text-sm text-green-600 dark:text-green-400 hidden sm:inline">Secure & Private</span>
            <span className="text-xs text-green-600 dark:text-green-400 sm:hidden">Secure</span>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-3 sm:px-4 py-2 sm:py-3">
        <div className="max-w-4xl mx-auto flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 flex-shrink-0" />
          <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200">
            <strong>Safety Reminder:</strong> If you're in immediate danger, call 199.
            <span className="hidden sm:inline"> This chat is confidential, but please use the Quick Exit button if you need to leave quickly.</span>
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg ${message.isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2 sm:space-x-3`}>
                <div className={`flex-shrink-0 p-1.5 sm:p-2 rounded-full ${message.isUser
                    ? 'bg-primary-100 dark:bg-primary-900/20'
                    : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                  {message.isUser ? (
                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-primary-600" />
                  ) : (
                    <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-300" />
                  )}
                </div>
                <div className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg ${message.isUser
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                  }`}>
                  <p className="text-xs sm:text-sm leading-relaxed">{message.message}</p>
                  {message.isEmergency && (
                    <div className="mt-2 flex items-center space-x-1">
                      <AlertTriangle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-red-400" />
                      <span className="text-xs text-red-400">Emergency detected</span>
                    </div>
                  )}
                  <p className="text-xs opacity-70 mt-1 text-right">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="flex-shrink-0 p-1.5 sm:p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                  <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">SafeSpeak is typing...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Responses */}
      {messages.length <= 2 && (
        <div className="px-3 sm:px-4 py-3 sm:py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">Quick responses to get started:</p>
            <div className="flex flex-wrap gap-2">
              {quickResponses.map((response, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(response)}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors touch-target"
                >
                  {response}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-3 sm:px-4 py-3 sm:py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-2 sm:space-x-4">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base mobile-input"
                rows={2}
                disabled={isTyping}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1 sm:space-x-2 touch-target"
            >
              <Send className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-sm sm:text-base">Send</span>
            </button>
          </div>

          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 flex-1">
              This conversation is confidential and not stored permanently.
            </p>
            <button
              onClick={handleClearChat}
              className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 ml-2 touch-target"
            >
              Clear Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;