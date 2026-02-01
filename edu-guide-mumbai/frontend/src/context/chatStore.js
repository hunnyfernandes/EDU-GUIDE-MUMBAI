import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Chat store for managing chatbot state and history
export const useChatStore = create(
  persist(
    (set, get) => ({
      messages: [],
      conversationId: null,
      isOpen: false,
      isLoading: false,

      // Generate unique conversation ID
      generateConversationId: () => {
        const id = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        set({ conversationId: id });
        return id;
      },

      // Add message to chat
      addMessage: (message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      },

      // Set loading state
      setLoading: (isLoading) => {
        set({ isLoading });
      },

      // Update messages directly (for replacing/updating messages)
      updateMessages: (messages) => {
        set({ messages });
      },

      // Toggle chat widget open/close
      toggleChat: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      // Open chat widget
      openChat: () => {
        set({ isOpen: true });
      },

      // Close chat widget
      closeChat: () => {
        set({ isOpen: false });
      },

      // Clear chat history
      clearChat: () => {
        set({
          messages: [],
          conversationId: null,
        });
      },

      // Initialize conversation
      initConversation: () => {
        const conversationId = get().conversationId || get().generateConversationId();
        if (get().messages.length === 0) {
          // Add welcome message
          get().addMessage({
            id: `msg_${Date.now()}`,
            role: 'assistant',
            content: 'Hello! I\'m here to help you find information about colleges, courses, admissions, and placements in Mumbai. How can I assist you today?',
            timestamp: new Date().toISOString(),
          });
        }
        return conversationId;
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        messages: state.messages,
        conversationId: state.conversationId,
      }),
    }
  )
);
