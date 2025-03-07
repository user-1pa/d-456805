// src/components/chatbot/ChatInterface.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  createConversationThread, 
  getThreadMessages, 
  sendMessageToThread, 
  ConversationMessage 
} from '../../lib/api/deepseek';

interface ChatInterfaceProps {
  threadId: string;
  onNewChat?: () => void;
  onClose?: () => void;
  className?: string;
}

export function ChatInterface({ threadId, onNewChat, onClose, className = '' }: ChatInterfaceProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load thread messages on component mount or when threadId changes
  useEffect(() => {
    async function loadMessages() {
      if (!threadId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const threadMessages = await getThreadMessages(threadId);
        setMessages(threadMessages);
      } catch (err: any) {
        console.error('Error loading messages:', err);
        setError('Failed to load conversation history.');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadMessages();
  }, [threadId]);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when the component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle form submission (sending a message)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !threadId || !user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Send message and get response
      const { userMessage, assistantMessage } = await sendMessageToThread(threadId, newMessage);
      
      // Update messages state with new messages
      setMessages(prevMessages => [...prevMessages, userMessage, assistantMessage]);
      
      // Clear input
      setNewMessage('');
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Start a new chat
  const handleNewChat = async () => {
    if (onNewChat) {
      onNewChat();
    } else {
      try {
        setIsLoading(true);
        const thread = await createConversationThread();
        window.location.href = `/chat/${thread.id}`;
      } catch (err: any) {
        console.error('Error creating new chat:', err);
        setError('Failed to create new chat.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Auto-resize textarea as user types
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    
    // Reset height to auto to correctly calculate scroll height
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  // Handle keyboard shortcuts (Ctrl+Enter or Command+Enter to send)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white rounded-lg shadow-lg ${className}`}>
      {/* Chat header */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-100 rounded-t-lg border-b">
        <h2 className="font-semibold text-gray-700">Fitness Assistant</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleNewChat}
            className="text-gray-600 hover:text-gray-900"
            aria-label="New chat"
            title="New chat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900"
              aria-label="Close"
              title="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p className="mb-1">Welcome to 4ortune Fitness Assistant!</p>
            <p className="text-sm">Ask me anything about workouts, nutrition, or fitness gear.</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user' 
                      ? 'bg-black text-white rounded-br-none' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100 text-gray-800 rounded-bl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      {/* Input area */}
      <div className="px-4 py-3 bg-gray-50 border-t rounded-b-lg">
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask about workouts, nutrition, etc..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black resize-none min-h-[44px] max-h-[200px]"
              rows={1}
              disabled={isLoading}
            />
            <div className="absolute right-2 bottom-2 text-xs text-gray-400">
              {newMessage.length > 0 && 'Ctrl+Enter to send'}
            </div>
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim() || isLoading}
            className="bg-black text-white rounded-lg px-4 py-2 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="
