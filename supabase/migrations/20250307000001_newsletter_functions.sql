-- Create tables for newsletter templates and campaigns

-- Newsletter templates table
CREATE TABLE public.newsletter_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  preview_text TEXT NOT NULL,
  main_heading TEXT NOT NULL,
  hero_image_url TEXT NOT NULL,
  content_blocks JSONB NOT NULL,
  footer_links JSONB NOT NULL,
  unsubscribe_url TEXT NOT NULL DEFAULT 'https://4ortune-fitness.com/newsletter/unsubscribe',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Newsletter campaigns table
CREATE TABLE public.newsletter_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES public.newsletter_templates(id) NOT NULL,
  subject TEXT NOT NULL,
  target_segment JSONB,
  sent_count INTEGER NOT NULL DEFAULT 0,
  open_count INTEGER NOT NULL DEFAULT 0,
  click_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Function to get newsletter statistics
CREATE OR REPLACE FUNCTION public.get_newsletter_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_count INTEGER;
  active_count INTEGER;
  inactive_count INTEGER;
  promotions_count INTEGER;
  product_updates_count INTEGER;
  blog_posts_count INTEGER;
  workouts_count INTEGER;
  stats JSON;
BEGIN
  -- Total subscribers
  SELECT COUNT(*) INTO total_count FROM public.newsletter_subscriptions;
  
  -- Active subscribers
  SELECT COUNT(*) INTO active_count FROM public.newsletter_subscriptions WHERE is_active = true;
  
  -- Inactive subscribers
  SELECT COUNT(*) INTO inactive_count FROM public.newsletter_subscriptions WHERE is_active = false;
  
  -- Preferences counts
  SELECT COUNT(*) INTO promotions_count 
  FROM public.newsletter_subscriptions 
  WHERE is_active = true AND preferences->>'promotions' = 'true';
  
  SELECT COUNT(*) INTO product_updates_count 
  FROM public.newsletter_subscriptions 
  WHERE is_active = true AND preferences->>'product_updates' = 'true';
  
  SELECT COUNT(*) INTO blog_posts_count 
  FROM public.newsletter_subscriptions 
  WHERE is_active = true AND preferences->>'blog_posts' = 'true';
  
  SELECT COUNT(*) INTO workouts_count 
  FROM public.newsletter_subscriptions 
  WHERE is_active = true AND preferences->>'workouts' = 'true';
  
  -- Construct JSON response
  stats := json_build_object(
    'total', total_count,
    'active', active_count,
    'inactive', inactive_count,
    'preferences', json_build_object(
      'promotions', promotions_count,
      'product_updates', product_updates_count,
      'blog_posts', blog_posts_count,
      'workouts', workouts_count
    )
  );
  
  RETURN stats;
END;
$$;

-- Sample data for newsletter templates
INSERT INTO public.newsletter_templates (
  name,
  description,
  preview_text,
  main_heading,
  hero_image_url,
  content_blocks,
  footer_links
) VALUES (
  'Weekly Fitness Newsletter',
  'Standard weekly newsletter with workout tips and product updates',
  'The latest fitness tips and exclusive offers just for you!',
  'This Week in Fitness',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80',
  '[
    {
      "heading": "Featured Workout of the Week",
      "text": "This week''s featured workout is a high-intensity interval training (HIIT) routine designed to boost your metabolism and build endurance. Complete 4 rounds of the following exercises, performing each for 40 seconds with 20 seconds of rest between exercises.",
      "imageUrl": "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "ctaText": "View Full Workout",
      "ctaUrl": "https://4ortune-fitness.com/workouts/hiit-metabolism-booster"
    },
    {
      "heading": "Nutrition Corner",
      "text": "Protein is essential for muscle recovery. Aim to consume 1.6-2.2g of protein per kg of bodyweight daily. Great sources include lean meats, eggs, dairy, legumes, and protein supplements. Try our new plant-based protein formula for a complete amino acid profile.",
      "ctaText": "Shop Protein",
      "ctaUrl": "https://4ortune-fitness.com/shop/protein"
    },
    {
      "heading": "New Arrivals",
      "text": "Our latest performance apparel collection has arrived! Featuring moisture-wicking fabrics, ergonomic designs, and stylish colorways. Perfect for both high-intensity workouts and casual wear.",
      "imageUrl": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "ctaText": "Shop New Arrivals",
      "ctaUrl": "https://4ortune-fitness.com/shop/new-arrivals"
    }
  ]',
  '[
    {"text": "Terms & Conditions", "url": "https://4ortune-fitness.com/terms"},
    {"text": "Privacy Policy", "url": "https://4ortune-fitness.com/privacy"},
    {"text": "Contact Us", "url": "https://4ortune-fitness.com/contact"}
  ]'
);

-- User roles table for admin access
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.newsletter_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS policies for newsletter_templates
CREATE POLICY "Anyone can read newsletter templates"
  ON public.newsletter_templates
  FOR SELECT USING (true);
  
CREATE POLICY "Only admins can modify newsletter templates"
  ON public.newsletter_templates
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- RLS policies for newsletter_campaigns
CREATE POLICY "Anyone can read newsletter campaigns"
  ON public.newsletter_campaigns
  FOR SELECT USING (true);
  
CREATE POLICY "Only admins can modify newsletter campaigns"
  ON public.newsletter_campaigns
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- RLS policies for user_roles
CREATE POLICY "Only admins can read user roles"
  ON public.user_roles
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.user_roles
      WHERE role = 'admin'
    )
  );
  
CREATE POLICY "Only admins can modify user roles"
  ON public.user_roles
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.user_roles
      WHERE role = 'admin'
    )
  );

-- Create index on user_id in user_roles
CREATE INDEX user_roles_user_id_idx ON public.user_roles (user_id);
