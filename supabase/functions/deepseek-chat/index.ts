// supabase/functions/deepseek-chat/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface DeepSeekChatRequest {
  messages: ChatMessage[];
  model: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create Supabase client to verify authorization
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Get user from auth header to verify authentication
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse the request body
    const requestData: DeepSeekChatRequest = await req.json();

    // Validate request data
    if (!requestData.messages || !Array.isArray(requestData.messages) || requestData.messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare the request to DeepSeek API
    const deepseekUrl = 'https://api.deepseek.com/v1/chat/completions';
    const apiKey = Deno.env.get('DEEPSEEK_API_KEY');

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'DeepSeek API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Make the request to DeepSeek API
    const deepseekResponse = await fetch(deepseekUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: requestData.model || 'deepseek-chat',
        messages: requestData.messages,
        temperature: requestData.temperature ?? 0.7,
        max_tokens: requestData.max_tokens ?? 1000,
        top_p: requestData.top_p ?? 1,
        frequency_penalty: requestData.frequency_penalty ?? 0,
        presence_penalty: requestData.presence_penalty ?? 0,
        stream: false,
      }),
    });

    // Handle error response from DeepSeek
    if (!deepseekResponse.ok) {
      const errorData = await deepseekResponse.json();
      return new Response(JSON.stringify({ error: 'DeepSeek API error', details: errorData }), {
        status: deepseekResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Return the DeepSeek API response
    const deepseekData = await deepseekResponse.json();
    
    return new Response(JSON.stringify(deepseekData), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
