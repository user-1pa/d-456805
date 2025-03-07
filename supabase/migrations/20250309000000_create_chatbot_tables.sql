-- Create tables for DeepSeek chatbot functionality

-- Chatbot conversation threads
CREATE TABLE public.chatbot_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  last_message TEXT,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Chatbot messages
CREATE TABLE public.chatbot_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES public.chatbot_threads(id) NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Chatbot feedback
CREATE TABLE public.chatbot_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES public.chatbot_messages(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating IN (1, -1)),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (message_id, user_id)
);

-- Chatbot suggested prompts by category
CREATE TABLE public.chatbot_suggested_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  prompt TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.chatbot_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_suggested_prompts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Thread policies
CREATE POLICY "Users can view their own threads"
  ON public.chatbot_threads
  FOR SELECT
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can create their own threads"
  ON public.chatbot_threads
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own threads"
  ON public.chatbot_threads
  FOR UPDATE
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own threads"
  ON public.chatbot_threads
  FOR DELETE
  USING (auth.uid() = user_id);

-- Message policies
CREATE POLICY "Users can view messages in their threads"
  ON public.chatbot_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chatbot_threads
      WHERE chatbot_threads.id = chatbot_messages.thread_id
      AND chatbot_threads.user_id = auth.uid()
    )
  );
  
CREATE POLICY "Users can insert messages in their threads"
  ON public.chatbot_messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chatbot_threads
      WHERE chatbot_threads.id = chatbot_messages.thread_id
      AND chatbot_threads.user_id = auth.uid()
    )
  );
  
CREATE POLICY "Users can delete messages in their threads"
  ON public.chatbot_messages
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.chatbot_threads
      WHERE chatbot_threads.id = chatbot_messages.thread_id
      AND chatbot_threads.user_id = auth.uid()
    )
  );

-- Feedback policies
CREATE POLICY "Users can view their own feedback"
  ON public.chatbot_feedback
  FOR SELECT
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own feedback"
  ON public.chatbot_feedback
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own feedback"
  ON public.chatbot_feedback
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Suggested prompts policies (publicly readable)
CREATE POLICY "Anyone can view suggested prompts"
  ON public.chatbot_suggested_prompts
  FOR SELECT
  USING (active = true);
  
CREATE POLICY "Only admins can modify suggested prompts"
  ON public.chatbot_suggested_prompts
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Create updated_at trigger for threads
CREATE TRIGGER update_chatbot_threads_updated_at
BEFORE UPDATE ON public.chatbot_threads
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create updated_at trigger for suggested prompts
CREATE TRIGGER update_chatbot_suggested_prompts_updated_at
BEFORE UPDATE ON public.chatbot_suggested_prompts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX chatbot_threads_user_id_idx ON public.chatbot_threads(user_id);
CREATE INDEX chatbot_messages_thread_id_idx ON public.chatbot_messages(thread_id);
CREATE INDEX chatbot_feedback_message_id_idx ON public.chatbot_feedback(message_id);
CREATE INDEX chatbot_feedback_user_id_idx ON public.chatbot_feedback(user_id);
CREATE INDEX chatbot_suggested_prompts_category_idx ON public.chatbot_suggested_prompts(category);

-- Insert initial suggested prompts
INSERT INTO public.chatbot_suggested_prompts (category, prompt, display_order)
VALUES 
  ('workout', 'What exercises are best for building shoulder strength?', 1),
  ('workout', 'Can you suggest a 30-minute home workout with no equipment?', 2),
  ('workout', 'How many days per week should I train for optimal muscle growth?', 3),
  ('nutrition', 'What should I eat before and after a workout?', 1),
  ('nutrition', 'How much protein do I need daily for muscle recovery?', 2),
  ('nutrition', 'Can you suggest healthy meal prep ideas for the week?', 3),
  ('equipment', 'What are the best shoes for HIIT workouts?', 1),
  ('equipment', 'Which fitness trackers do you recommend for beginners?', 2),
  ('equipment', 'What home gym equipment gives the most value for money?', 3),
  ('goals', 'How long does it typically take to see results from strength training?', 1),
  ('goals', 'What's a realistic timeline for losing 10 pounds in a healthy way?', 2),
  ('goals', 'How can I stay motivated with my fitness routine?', 3);
