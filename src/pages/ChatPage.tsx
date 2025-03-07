// src/pages/ChatPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  getConversationThreads, 
  getThreadMessages, 
  createConversationThread,
  updateThreadTitle,
  deleteConversationThread,
  sendMessageToThread,
  ConversationThread,
  ConversationMessage
} from '../lib/api/deepseek';
import { ChatInterface } from '../components/chatbot/ChatInterface';

export default function ChatPage() {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [threads, setThreads] = useState<ConversationThread[]>([]);
  const [activeThread, setActiveThread] = useState<ConversationThread | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggestedPrompts, setSuggestedPrompts] = useState<{ category: string; prompts: string[] }[]>([
    { 
      category: 'Workout',
      prompts: [
        'What exercises are best for building shoulder strength?',
        'Can you suggest a 30-minute home workout with no equipment?',
        'How many days per week should I train for optimal muscle growth?'
      ]
    },
    { 
      category: 'Nutrition',
      prompts: [
        'What should I eat before and after a workout?',
        'How much protein do I need daily for muscle recovery?',
        'Can you suggest healthy meal prep ideas for the week?'
      ]
    },
    { 
      category: 'Equipment',
      prompts: [
        'What are the best shoes for HIIT workouts?',
        'Which fitness trackers do you recommend for beginners?',
        'What home gym equipment gives the most value for money?'
      ]
    }
  ]);

  // Load conversation threads
  useEffect(() => {
    async function loadThreads() {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const threadData = await getConversationThreads();
        setThreads(threadData);
        
        // If a thread ID is provided, fetch that thread
        if (threadId) {
          const thread = threadData.find(t => t.id === threadId);
          if (thread) {
            setActiveThread(thread);
            setNewTitle(thread.title);
          } else {
            navigate('/chat');
          }
        } else if (threadData.length > 0) {
          // If no thread ID is provided, use the first thread
          navigate(`/chat/${threadData[0].id}`);
        }
      } catch (err: any) {
        console.error('Error loading conversation threads:', err);
        setError('Failed to load conversations.');
      } finally {
        setLoading(false);
      }
    }
    
    loadThreads();
  }, [user, threadId, navigate]);

  // Handle creating a new thread
  const handleNewChat = async () => {
    try {
      setLoading(true);
      const thread = await createConversationThread();
      
      // Refresh threads list
      const threadData = await getConversationThreads();
      setThreads(threadData);
      
      // Navigate to the new thread
      navigate(`/chat/${thread.id}`);
    } catch (err: any) {
      console.error('Error creating new conversation:', err);
      setError('Failed to start new conversation.');
    } finally {
      setLoading(false);
    }
  };

  // Handle updating thread title
  const handleUpdateTitle = async () => {
    if (!activeThread || !newTitle.trim()) return;
    
    try {
      await updateThreadTitle(activeThread.id, newTitle);
      
      // Update local state
      setActiveThread(prev => prev ? { ...prev, title: newTitle } : null);
      setThreads(prev => prev.map(t => 
        t.id === activeThread.id ? { ...t, title: newTitle } : t
      ));
      
      setEditingTitle(false);
    } catch (err: any) {
      console.error('Error updating thread title:', err);
      setError('Failed to update conversation title.');
    }
  };

  // Handle thread deletion
  const handleDeleteThread = async (threadId: string) => {
    if (!confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteConversationThread(threadId);
      
      // Update local state
      setThreads(prev => prev.filter(t => t.id !== threadId));
      
      // If the active thread was deleted, navigate to the first thread or the new thread page
      if (activeThread?.id === threadId) {
        const remainingThreads = threads.filter(t => t.id !== threadId);
        if (remainingThreads.length > 0) {
          navigate(`/chat/${remainingThreads[0].id}`);
        } else {
          navigate('/chat');
        }
      }
    } catch (err: any) {
      console.error('Error deleting thread:', err);
      setError('Failed to delete conversation.');
    }
  };

  // Handle suggested prompt click
  const handleSuggestedPrompt = async (prompt: string) => {
    if (!activeThread) return;
    
    try {
      setLoading(true);
      await sendMessageToThread(activeThread.id, prompt);
      
      // Refresh the current page to show the new messages
      window.location.reload();
    } catch (err: any) {
      console.error('Error sending suggested prompt:', err);
      setError('Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  // If user is not authenticated, redirect to login
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto">
          <svg className="w-24 h-24 text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 11V9a4 4 0 118 0v2m-4 5v2m-4-9h8a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2v-6a2 2 0 012-2z" />
          </svg>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign in to chat</h1>
          <p className="text-gray-600 mb-8">
            Login to get personalized fitness assistance and save your conversations.
          </p>
          <a
            href="/auth/login?redirect=/chat"
            className="bg-black text-white px-6 py-3 rounded-lg font-medium text-lg hover:bg-gray-800"
          >
            Sign In / Sign Up
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Fitness Assistant</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Thread List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-medium mb-6"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Conversation
            </button>
            
            <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wider mb-3">Your Conversations</h3>
            
            {loading && threads.length === 0 ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-sm py-4">{error}</div>
            ) : threads.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No conversations yet. Start a new chat!
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {threads.map(thread => (
                  <div 
                    key={thread.id}
                    className={`border rounded-lg p-3 ${
                      activeThread?.id === thread.id ? 'border-black bg-gray-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <a 
                        href={`/chat/${thread.id}`}
                        className="flex-1"
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
                      </a>
                      
                      <button
                        onClick={() => handleDeleteThread(thread.id)}
                        className="text-gray-400 hover:text-red-500 ml-2"
                        title="Delete conversation"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Main Chat Area */}
        <div className="lg:col-span-2">
          {activeThread ? (
            <div className="bg-white rounded-lg shadow-sm border h-[600px] flex flex-col">
              <div className="px-4 py-3 bg-gray-50 border-b flex items-center">
                {editingTitle ? (
                  <div className="flex-1 flex items-center">
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                      placeholder="Conversation title"
                      autoFocus
                    />
                    <button
                      onClick={handleUpdateTitle}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        setEditingTitle(false);
                        setNewTitle(activeThread.title);
                      }}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="font-semibold text-gray-700 flex-1 truncate">
                      {activeThread.title || 'New Conversation'}
                    </h2>
                    <button
                      onClick={() => setEditingTitle(true)}
                      className="text-gray-500 hover:text-gray-700 ml-2"
                      title="Edit title"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
              
              <div className="flex-1">
                <ChatInterface threadId={activeThread.id} />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Conversation Selected</h2>
              <p className="text-gray-600 mb-6">
                Select an existing conversation or start a new one.
              </p>
              <button
                onClick={handleNewChat}
                className="bg-black text-white px-4 py-2 rounded-lg font-medium"
              >
                Start New Conversation
              </button>
            </div>
          )}
        </div>
        
        {/* Suggested Prompts */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wider mb-3">Suggested Questions</h3>
            
            <div className="space-y-6">
              {suggestedPrompts.map((category) => (
                <div key={category.category}>
                  <h4 className="font-medium text-gray-900 mb-2">{category.category}</h4>
                  <div className="space-y-2">
                    {category.prompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedPrompt(prompt)}
                        disabled={!activeThread || loading}
                        className="w-full text-left p-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">About This Assistant</h4>
              <p className="text-sm text-gray-600">
                The 4ortune Fitness Assistant can help with workout advice, nutrition guidance, and fitness product recommendations.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Conversations are saved to your account and can be accessed later.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
