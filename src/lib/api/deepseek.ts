// src/lib/api/deepseek.ts
import { supabaseClient } from '../supabase';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatCompletionOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export interface ChatCompletion {
  id: string;
  created: number;
  choices: {
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }[];
}

export interface ConversationThread {
  id: string;
  title: string;
  last_message: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface ConversationMessage {
  id: string;
  thread_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

const DEFAULT_SYSTEM_MESSAGE = `You are a helpful fitness assistant for 4ortune Fitness.
You provide advice on workouts, nutrition, fitness gear, and healthy lifestyle choices.
Be encouraging, motivational, and provide scientifically accurate information.
When asked about 4ortune Fitness products, emphasize their quality and benefits.
Keep responses concise and tailored to fitness enthusiasts of all levels.
Do not provide medical advice or diagnose conditions.`;

// Function to create a chat completion using DeepSeek AI
export async function createChatCompletion(
  messages: ChatMessage[],
  options: ChatCompletionOptions = {}
): Promise<ChatCompletion> {
  try {
    // Call the Supabase Edge Function that wraps the DeepSeek API
    const { data, error } = await supabaseClient.functions.invoke('deepseek-chat', {
      body: {
        messages,
        model: options.model || 'deepseek-chat',
        temperature: options.temperature ?? 0.7,
        max_tokens: options.max_tokens ?? 1000,
        top_p: options.top_p ?? 1,
        frequency_penalty: options.frequency_penalty ?? 0,
        presence_penalty: options.presence_penalty ?? 0,
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating chat completion:', error);
    throw error;
  }
}

// Create a new conversation thread
export async function createConversationThread(title: string = 'New Conversation'): Promise<ConversationThread> {
  try {
    const { data: user } = await supabaseClient.auth.getUser();
    
    if (!user?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabaseClient
      .from('chatbot_threads')
      .insert([
        {
          title,
          user_id: user.user.id,
          last_message: '',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating conversation thread:', error);
    throw error;
  }
}

// Get a list of conversation threads for the current user
export async function getConversationThreads(): Promise<ConversationThread[]> {
  try {
    const { data: user } = await supabaseClient.auth.getUser();
    
    if (!user?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabaseClient
      .from('chatbot_threads')
      .select('*')
      .eq('user_id', user.user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching conversation threads:', error);
    throw error;
  }
}

// Get messages for a specific thread
export async function getThreadMessages(threadId: string): Promise<ConversationMessage[]> {
  try {
    const { data, error } = await supabaseClient
      .from('chatbot_messages')
      .select('*')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching thread messages:', error);
    throw error;
  }
}

// Send a message to a thread and get a response
export async function sendMessageToThread(
  threadId: string, 
  content: string,
  options: ChatCompletionOptions = {}
): Promise<{ userMessage: ConversationMessage; assistantMessage: ConversationMessage }> {
  try {
    // Get existing messages for context
    const existingMessages = await getThreadMessages(threadId);
    
    // Create the user message in the database
    const { data: userMessage, error: userMessageError } = await supabaseClient
      .from('chatbot_messages')
      .insert([
        {
          thread_id: threadId,
          role: 'user',
          content,
        },
      ])
      .select()
      .single();

    if (userMessageError) throw userMessageError;

    // Format messages for the API including system message
    const apiMessages: ChatMessage[] = [
      { role: 'system', content: DEFAULT_SYSTEM_MESSAGE },
      ...existingMessages.map(msg => ({ role: msg.role as 'user' | 'assistant', content: msg.content })),
      { role: 'user', content },
    ];

    // Get completion from DeepSeek API
    const completion = await createChatCompletion(apiMessages, options);
    const assistantContent = completion.choices[0].message.content;

    // Save assistant message to database
    const { data: assistantMessage, error: assistantMessageError } = await supabaseClient
      .from('chatbot_messages')
      .insert([
        {
          thread_id: threadId,
          role: 'assistant',
          content: assistantContent,
        },
      ])
      .select()
      .single();

    if (assistantMessageError) throw assistantMessageError;

    // Update the thread's last message
    await supabaseClient
      .from('chatbot_threads')
      .update({ 
        last_message: assistantContent,
        updated_at: new Date().toISOString(),
      })
      .eq('id', threadId);

    return { userMessage, assistantMessage };
  } catch (error) {
    console.error('Error sending message to thread:', error);
    throw error;
  }
}

// Update thread title
export async function updateThreadTitle(threadId: string, title: string): Promise<void> {
  try {
    const { error } = await supabaseClient
      .from('chatbot_threads')
      .update({ title })
      .eq('id', threadId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating thread title:', error);
    throw error;
  }
}

// Delete a conversation thread
export async function deleteConversationThread(threadId: string): Promise<void> {
  try {
    // First delete all messages in the thread
    const { error: messagesError } = await supabaseClient
      .from('chatbot_messages')
      .delete()
      .eq('thread_id', threadId);

    if (messagesError) throw messagesError;

    // Then delete the thread
    const { error: threadError } = await supabaseClient
      .from('chatbot_threads')
      .delete()
      .eq('id', threadId);

    if (threadError) throw threadError;
  } catch (error) {
    console.error('Error deleting conversation thread:', error);
    throw error;
  }
}
