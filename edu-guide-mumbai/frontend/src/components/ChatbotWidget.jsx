import React, { useState, useEffect, useRef } from 'react';
import { useChatStore } from '../context/chatStore';
import { chatbotAPI } from '../services/api';
import ChatMessage from './ChatMessage';
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  TrashIcon,
  StopCircleIcon,
  PlusIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ChatbotWidget = () => {
  const {
    messages,
    isOpen,
    isLoading,
    // toggleChat, // unused - using openChat and closeChat instead
    openChat,
    closeChat,
    addMessage,
    setLoading,
    clearChat,
    initConversation,
    conversationId,
    generateConversationId,
    updateMessages,
  } = useChatStore();

  const [inputMessage, setInputMessage] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current && !editingIndex) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, editingIndex]);

  // Initialize conversation on mount
  useEffect(() => {
    if (messages.length === 0) {
      initConversation();
    }
  }, []);

  // Set up global handler for suggested questions
  useEffect(() => {
    window.chatbotSuggestClick = (suggestion) => {
      setInputMessage(suggestion);
      if (inputRef.current) {
        inputRef.current.focus();
        // Auto-send after a brief delay
        setTimeout(() => {
          const form = inputRef.current?.closest('form');
          if (form) {
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
            form.dispatchEvent(submitEvent);
          }
        }, 300);
      }
    };

    return () => {
      delete window.chatbotSuggestClick;
    };
  }, []);

  const getConversationHistory = () => {
    return messages
      .filter(msg => msg.role !== 'system' && !msg.id.includes('loading'))
      .map(msg => ({
        role: msg.role,
        content: msg.content,
      }));
  };

  // Fallback response generator when API is unavailable
  const getFallbackResponse = (message) => {
    const q = message.toLowerCase();

    if (/\b(hello|hi|hey|namaste|good\s*(morning|afternoon|evening))\b/.test(q)) {
      return "Hello! 👋 I'm EduBot, your college advisor for Mumbai & Maharashtra. I can help you with:\n\n• 🏫 Finding colleges by stream\n• 💰 Fees & scholarship info\n• 📋 Admission processes\n• 📊 Comparing colleges\n• 🎯 Career guidance\n\nWhat would you like to know?";
    }
    if (/\b(thanks|thank\s*you|bye|goodbye)\b/.test(q)) {
      return "You're welcome! 😊 Feel free to come back anytime. Good luck with your academic journey! 🎓";
    }
    if (/\b(engineer|btech|b\.?tech|iit|vjti|cse|computer|mechanical)\b/.test(q)) {
      return "🏗️ **Top Engineering Colleges in Mumbai:**\n\n• **IIT Bombay** – Premier institute, JEE Advanced required\n• **VJTI** – Govt. college, strong placements via MHT-CET\n• **DJ Sanghvi** – Private, known for CS & IT\n• **SPCE** – Well-regarded, good campus\n• **Thadomal Shahani** – Strong industry connections\n\n📌 **Admission:** JEE Main / MHT-CET\n💰 **Fees:** Govt: ₹5K-30K/yr | Private: ₹1-3L/yr\n\nBrowse all colleges on our [college listings](/colleges) page!";
    }
    if (/\b(medical|mbbs|doctor|neet|kem|pharma|nursing)\b/.test(q)) {
      return "🏥 **Top Medical Colleges in Mumbai:**\n\n• **KEM Hospital** – Top govt. medical college\n• **Grant Medical College** – Prestigious\n• **Lokmanya Tilak (Sion)** – Well-known\n• **BYL Nair Hospital** – Reputed\n\n📌 **Admission:** NEET UG required\n💰 **Fees:** Govt: ₹15K-50K/yr | Private: ₹5-20L/yr";
    }
    if (/\b(commerce|bcom|b\.?com|ca|accounting|finance|bms)\b/.test(q)) {
      return "📊 **Top Commerce Colleges in Mumbai:**\n\n• **Sydenham College** – One of India's oldest\n• **HR College** – Excellent placements\n• **Jai Hind College** – Strong academics\n• **NM College** – Great for B.Com\n• **Narsee Monjee** – Well-known for finance\n\n📌 **Admission:** HSC merit based\n💰 **Fees:** ₹10K-1L/yr";
    }
    if (/\b(arts|humanities|ba\b|literature|psychology|mass\s*media)\b/.test(q)) {
      return "🎨 **Top Arts Colleges in Mumbai:**\n\n• **St. Xavier's College** – Highly prestigious\n• **Elphinstone College** – Historic institution\n• **Sophia College** – Top women's college\n• **KC College** – Good for Mass Media & Psychology\n\n📌 **Admission:** HSC merit based\n💰 **Fees:** ₹5K-50K/yr";
    }
    if (/\b(science|bsc|b\.?sc|physics|chemistry|biology|biotech)\b/.test(q)) {
      return "🔬 **Top Science Colleges in Mumbai:**\n\n• **St. Xavier's College** – Excellent for pure sciences\n• **Ruia College** – Top autonomous govt. college\n• **ICT** – Premier for chemistry/biotech\n• **KC College** – Great for life sciences\n\n📌 **Admission:** HSC merit / entrance exams\n💰 **Fees:** Govt: ₹5K-15K/yr | Private: ₹20K-1L/yr";
    }
    if (/\b(fee|fees|cost|expensive|cheap|budget|scholarship)\b/.test(q)) {
      return "💰 **College Fees in Mumbai:**\n\n• **Government:** ₹5,000 – ₹30,000/year\n• **Aided:** ₹10,000 – ₹60,000/year\n• **Private:** ₹50,000 – ₹3,00,000/year\n\n🎓 **Scholarships:**\n• Govt. of Maharashtra Freeship\n• Post-Matric Scholarship (SC/ST/OBC)\n• Merit-based at individual colleges\n• EWS quota fee concessions";
    }
    if (/\b(admission|apply|entrance|exam|cutoff|mht[\s-]?cet|jee|registration)\b/.test(q)) {
      return "📋 **Admission Processes in Maharashtra:**\n\n• **Engineering:** JEE Main / MHT-CET → CAP rounds\n• **Medical:** NEET UG → State counseling\n• **Arts/Commerce/Science:** HSC merit\n• **Law:** CLAT / MH-CET Law\n• **Management:** CAT / CET / CMAT\n\n📅 MHT-CET: May-June | CAP Rounds: July-August";
    }
    if (/\b(placement|job|salary|package|recruit|career|intern)\b/.test(q)) {
      return "💼 **Placement Info:**\n\n• **Engineering (Top):** ₹4-20 LPA average\n• **Management (MBA):** ₹6-25 LPA\n• **Commerce:** ₹3-8 LPA\n• **Arts/Humanities:** ₹2-6 LPA\n\n🏢 **Top Recruiters:** TCS, Infosys, JP Morgan, Deloitte, HDFC Bank, L&T, Reliance";
    }
    if (/\b(compare|versus|vs|better|which)\b/.test(q)) {
      return "📊 You can compare colleges on our [Compare Colleges](/compare) page!\n\nCompare based on: fees, placements, rankings, infrastructure, and courses.\n\nOr ask me about specific colleges!";
    }
    return "I can help you with:\n\n• 🏫 **College recommendations** by stream\n• 💰 **Fees & scholarships**\n• 📋 **Admission processes**\n• 📊 **Compare colleges**\n• 💼 **Placements & careers**\n\nTry asking about engineering, medical, commerce, or arts colleges! You can also [browse all colleges](/colleges).";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    console.log('🚀 handleSendMessage called', { inputMessage, isLoading });

    if (!inputMessage.trim() || isLoading) {
      console.log('⚠️ Form submission blocked:', { inputMessage: inputMessage.trim(), isLoading });
      return;
    }

    const userMessage = inputMessage.trim();
    const currentConvId = conversationId || generateConversationId();

    // Remove any existing loading message
    const currentMessages = useChatStore.getState().messages.filter(
      msg => !msg.id.includes('loading')
    );
    updateMessages(currentMessages);

    // Add user message to chat
    const userMsg = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    addMessage(userMsg);
    setInputMessage('');
    setLoading(true);

    // Add loading message placeholder
    const loadingMsgId = `msg_${Date.now()}_loading`;
    const loadingMsg = {
      id: loadingMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
    };
    addMessage(loadingMsg);

    // Create abort controller for cancelling request
    abortControllerRef.current = new AbortController();

    try {
      const conversationHistory = getConversationHistory();
      console.log('📤 Sending message:', { userMessage, currentConvId, historyLength: conversationHistory.length });
      const response = await chatbotAPI.sendMessage(
        userMessage,
        currentConvId,
        conversationHistory
      );

      console.log('📥 API Response:', response);

      if (response.data && response.data.success) {
        // Get current messages from store and replace loading message with actual response
        const currentMsgs = useChatStore.getState().messages;
        const updatedMessages = currentMsgs.map((msg) =>
          msg.id === loadingMsgId
            ? {
              id: `msg_${Date.now()}_bot`,
              role: 'assistant',
              content: response.data.data.message,
              suggestedPages: response.data.data.suggestedPages || [],
              suggestions: response.data.data.suggestions || [],
              timestamp: new Date().toISOString(),
            }
            : msg
        );

        updateMessages(updatedMessages);
      } else {
        throw new Error(response.data?.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('❌ Chat error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        fullError: error,
      });

      if (error.name === 'AbortError' || error.message.includes('aborted')) {
        // Request was cancelled, remove loading message
        const currentMsgs = useChatStore.getState().messages.filter(
          msg => msg.id !== loadingMsgId
        );
        updateMessages(currentMsgs);
        return;
      }

      // Replace loading message with smart fallback response
      const fallbackContent = getFallbackResponse(userMessage);
      const currentMsgs = useChatStore.getState().messages;
      const updatedMessages = currentMsgs.map((msg) =>
        msg.id === loadingMsgId
          ? {
            id: `msg_${Date.now()}_fallback`,
            role: 'assistant',
            content: fallbackContent,
            suggestedPages: [{ label: 'Browse All Colleges', path: '/colleges' }],
            timestamp: new Date().toISOString(),
          }
          : msg
      );

      updateMessages(updatedMessages);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleRegenerate = async (messageIndex) => {
    // Find the user message that preceded this assistant message
    const currentMessages = useChatStore.getState().messages;
    const assistantMessage = currentMessages[messageIndex];

    // Find the user message before this assistant message
    let userMessageIndex = -1;
    for (let i = messageIndex - 1; i >= 0; i--) {
      if (currentMessages[i].role === 'user') {
        userMessageIndex = i;
        break;
      }
    }

    if (userMessageIndex === -1) {
      toast.error('Cannot regenerate: no user message found');
      return;
    }

    const userMessage = currentMessages[userMessageIndex].content;

    // Remove the assistant message and regenerate
    const updatedMessages = currentMessages.filter((_, index) => index !== messageIndex);
    updateMessages(updatedMessages);

    // Set input and send
    setInputMessage(userMessage);
    setTimeout(() => {
      const event = new Event('submit', { bubbles: true, cancelable: true });
      const form = inputRef.current?.closest('form');
      if (form) {
        form.dispatchEvent(event);
      }
    }, 100);
  };

  const handleEdit = (messageContent, messageIndex) => {
    setEditingIndex(messageIndex);
    setEditText(messageContent);
    inputRef.current?.focus();
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editText.trim() || editingIndex === null) return;

    // Update the message in the store
    const currentMessages = useChatStore.getState().messages;
    const updatedMessages = currentMessages.map((msg, index) =>
      index === editingIndex
        ? { ...msg, content: editText.trim() }
        : msg
    );

    // Remove all messages after the edited one (for new response)
    const messagesToKeep = updatedMessages.slice(0, editingIndex + 1);
    updateMessages(messagesToKeep);

    setEditingIndex(null);
    setInputMessage(editText.trim());
    setEditText('');

    // Auto-send the edited message
    setTimeout(() => {
      handleSendMessage(e);
    }, 100);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditText('');
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history? This cannot be undone.')) {
      clearChat();
      initConversation();
      toast.success('Chat history cleared');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (editingIndex !== null) {
        handleSaveEdit(e);
      } else {
        handleSendMessage(e);
      }
    }
    if (e.key === 'Escape' && editingIndex !== null) {
      handleCancelEdit();
    }
  };

  const handleNewChat = () => {
    if (messages.length > 1 && !window.confirm('Start a new chat? Current conversation will be cleared.')) {
      return;
    }
    clearChat();
    initConversation();
    setIsMinimized(false);
    toast.success('New chat started');
  };

  const userMessageCount = messages.filter((m) => m.role === 'user').length;

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={openChat}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center z-50 group"
          aria-label="Open chat"
          style={{
            animation: 'fadeInUp 0.3s ease-out',
          }}
        >
          <ChatBubbleLeftRightIcon className="w-6 h-6 transition-transform group-hover:rotate-12" />
          {userMessageCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
              {userMessageCount}
            </span>
          )}
          <span className="absolute -bottom-12 right-0 bg-neutral-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Chat Assistant
          </span>
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 w-[90vw] sm:w-[480px] ${isMinimized ? 'h-16' : 'h-[700px] max-h-[85vh]'
            } bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl flex flex-col z-50 border border-neutral-200 dark:border-neutral-700 overflow-hidden transition-all duration-300`}
          style={{
            animation: 'slideInUp 0.3s ease-out',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <SparklesIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Edu Guide Assistant</h3>
                <p className="text-xs opacity-90">AI-powered college advisor</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleNewChat}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="New chat"
                title="New chat"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
              {messages.length > 1 && (
                <button
                  onClick={handleClearChat}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Clear chat"
                  title="Clear chat"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={closeChat}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Container */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-1 bg-neutral-50 dark:bg-neutral-900 scroll-smooth"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#CBD5E0 transparent',
                }}
              >
                {messages.map((message, index) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    messageIndex={index}
                    isLoading={message.id.includes('loading') && isLoading}
                    onRegenerate={handleRegenerate}
                    onEdit={handleEdit}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
                {editingIndex !== null && (
                  <div className="mb-2 p-2 bg-warning/10 border border-warning/30 rounded-lg flex items-center justify-between">
                    <span className="text-xs text-warning dark:text-warning">Editing message</span>
                    <button
                      onClick={handleCancelEdit}
                      className="text-xs text-warning hover:text-warning/70"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                <form onSubmit={editingIndex !== null ? handleSaveEdit : handleSendMessage}>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1 relative">
                      <textarea
                        ref={inputRef}
                        value={editingIndex !== null ? editText : inputMessage}
                        onChange={(e) =>
                          editingIndex !== null
                            ? setEditText(e.target.value)
                            : setInputMessage(e.target.value)
                        }
                        onKeyPress={handleKeyPress}
                        placeholder={
                          editingIndex !== null
                            ? 'Edit your message...'
                            : 'Ask about colleges, courses, admissions...'
                        }
                        disabled={isLoading}
                        rows={1}
                        className="w-full px-4 py-3 pr-12 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed resize-none max-h-32 overflow-y-auto"
                        style={{
                          scrollbarWidth: 'thin',
                        }}
                        onInput={(e) => {
                          e.target.style.height = 'auto';
                          e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                      />
                      {isLoading && (
                        <button
                          type="button"
                          onClick={handleStopGeneration}
                          className="absolute right-2 bottom-2 p-2 text-error hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                          title="Stop generating"
                        >
                          <StopCircleIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={
                        (editingIndex !== null ? !editText.trim() : !inputMessage.trim()) || isLoading
                      }
                      className="px-4 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-300 dark:disabled:bg-neutral-600 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex items-center justify-center min-w-[48px]"
                      aria-label={editingIndex !== null ? 'Save edit' : 'Send message'}
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <PaperAirplaneIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 text-center">
                    AI-powered assistant · May produce inaccurate information
                  </p>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
