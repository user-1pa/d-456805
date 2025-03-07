// src/components/chatbot/ChatWidget.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createConversationThread, getConversationThreads } from '../../lib/api/deepseek';
import { ChatInterface } from './ChatInterface';

interface ChatWidgetProps {
  className?: string;
}

export function ChatWidget({ className = '' }: ChatWidgetProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [threads, setThreads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load conversation threads
  useEffect(() => {
    async function loadThreads() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const threadData = await getConversationThreads();
        setThreads(threadData);
        
        // Set active thread to the most recent one if exists
        if (threadData.length > 0 && !activeThreadId) {
          setActiveThreadId(threadData[0].id);
        }
      } catch (err: any) {
        console.error('Error loading conversation threads:', err);
        setError('Failed to load conversations.');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (isOpen) {
      loadThreads();
    }
  }, [user, isOpen, activeThreadId]);

  // Toggle chat widget open/closed
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Create a new conversation
  const handleNewChat = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/auth/login?redirect=/chat';
      return;
    }
    
    try {
      setIsLoading(true);
      const thread = await createConversationThread();
      setActiveThreadId(thread.id);
      
      // Refresh threads list
      const threadData = await getConversationThreads();
      setThreads(threadData);
    } catch (err: any) {
      console.error('Error creating new conversation:', err);
      setError('Failed to start new conversation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Chat widget button */}
      <button
        onClick={toggleChat}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-black hover:bg-gray-800'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
      
      {/* Chat widget panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden">
          {!user ? (
            // Not logged in state
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 11V9a4 4 0 118 0v2m-4 5v2m-4-9h8a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2v-6a2 2 0 012-2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sign in to chat</h3>
              <p className="text-gray-600 mb-4">Login to get personalized fitness assistance and save your conversations.</p>
              <a
                href="/auth/login?redirect=/chat"
                className="bg-black text-white px-4 py-2 rounded-lg font-medium"
              >
                Sign In / Sign Up
              </a>
            </div>
          ) : activeThreadId ? (
            // Active chat interface
            <ChatInterface 
              threadId={activeThreadId} 
              onNewChat={handleNewChat}
              onClose={() => setIsOpen(false)}
            />
          ) : (
            // Thread selection or new chat
            <div className="flex flex-col h-full">
              <div className="p-4 bg-gray-100 border-b">
                <h2 className="font-semibold text-gray-700">Fitness Assistant</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center py-4">{error}</div>
                ) : threads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
                    <p className="text-gray-600 mb-4">Start a new chat to get fitness assistance.</p>
                    <button
                      onClick={handleNewChat}
                      className="bg-black text-white px-4 py-2 rounded-lg font-medium"
                    >
                      New Conversation
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={handleNewChat}
                      className="w-full flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-medium mb-4"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      New Conversation
                    </button>
                    
                    <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wider mt-4 mb-2">Recent Conversations</h3>
                    
                    {threads.map(thread => (
                      <button
                        key={thread.id}
                        onClick={() => setActiveThreadId(thread.id)}
                        className="w-full text-left border rounded-lg p-3 hover:bg-gray-50"
                      >
                        <p className="font-medium text-gray-800 truncate">
                          {thread.title || 'New Conversation'}
                        </p>
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {thread.last_message || 'Start a new chat'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(thread.updated_at).toLocaleDateString()}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
