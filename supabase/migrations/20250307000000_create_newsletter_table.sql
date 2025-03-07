-- Create newsletter subscriptions table
CREATE TABLE public.newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
);

-- Create index on email for faster lookups
CREATE INDEX newsletter_subscriptions_email_idx ON public.newsletter_subscriptions (email);

-- Enable RLS
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS policies
-- Allow anonymous users to insert into the newsletter table
CREATE POLICY "Allow anonymous newsletter subscriptions" 
  ON public.newsletter_subscriptions
  FOR INSERT 
  WITH CHECK (true);

-- Allow users to see their own subscriptions
CREATE POLICY "Users can see their own subscriptions"
  ON public.newsletter_subscriptions
  FOR SELECT
  USING (email = auth.jwt() -> 'email');

-- Allow users to update their own subscriptions
CREATE POLICY "Users can update their own subscriptions"
  ON public.newsletter_subscriptions
  FOR UPDATE
  USING (email = auth.jwt() -> 'email');

-- Audit table for tracking newsletter activity
CREATE TABLE public.newsletter_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.newsletter_subscriptions(id),
  activity_type TEXT NOT NULL, -- 'subscription', 'update', 'unsubscription', 'email_sent', 'email_opened', 'link_clicked'
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Function to log activity
CREATE OR REPLACE FUNCTION public.log_newsletter_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.newsletter_activity (subscription_id, activity_type, metadata)
    VALUES (NEW.id, 'subscription', jsonb_build_object('preferences', NEW.preferences));
  ELSIF TG_OP = 'UPDATE' THEN
    -- Only log if something meaningful changed
    IF NEW.preferences != OLD.preferences OR NEW.is_active != OLD.is_active THEN
      INSERT INTO public.newsletter_activity (subscription_id, activity_type, metadata)
      VALUES (
        NEW.id, 
        CASE 
          WHEN OLD.is_active = true AND NEW.is_active = false THEN 'unsubscription'
          ELSE 'update'
        END,
        jsonb_build_object(
          'old_preferences', OLD.preferences,
          'new_preferences', NEW.preferences,
          'old_status', OLD.is_active,
          'new_status', NEW.is_active
        )
      );
    END IF;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for logging activity
CREATE TRIGGER newsletter_activity_trigger
AFTER INSERT OR UPDATE ON public.newsletter_subscriptions
FOR EACH ROW EXECUTE FUNCTION public.log_newsletter_activity();
