-- Media Gallery and Content Management Tables

-- Media Assets Table
CREATE TABLE public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  dimensions JSONB,
  metadata JSONB DEFAULT '{}'::jsonb,
  alt_text TEXT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Media Categories Table
CREATE TABLE public.media_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES public.media_categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Media Assets to Categories Junction Table
CREATE TABLE public.media_assets_categories (
  asset_id UUID REFERENCES public.media_assets(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.media_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (asset_id, category_id)
);

-- Media Tags Table
CREATE TABLE public.media_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Media Assets to Tags Junction Table
CREATE TABLE public.media_assets_tags (
  asset_id UUID REFERENCES public.media_assets(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.media_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (asset_id, tag_id)
);

-- Content Table
CREATE TABLE public.content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  featured_image_id UUID REFERENCES public.media_assets(id),
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT valid_status CHECK (status IN ('draft', 'published', 'archived'))
);

-- Content Categories Table
CREATE TABLE public.content_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES public.content_categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Content to Categories Junction Table
CREATE TABLE public.content_categories_junction (
  content_id UUID REFERENCES public.content(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.content_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (content_id, category_id)
);

-- Content to Media Assets Junction Table
CREATE TABLE public.content_media_assets (
  content_id UUID REFERENCES public.content(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES public.media_assets(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (content_id, asset_id)
);

-- Content Tags Table
CREATE TABLE public.content_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Content to Tags Junction Table
CREATE TABLE public.content_tags_junction (
  content_id UUID REFERENCES public.content(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.content_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (content_id, tag_id)
);

-- Content Revisions Table
CREATE TABLE public.content_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  revision_number INTEGER NOT NULL,
  changed_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE (content_id, revision_number)
);

-- Media and Content View Counts
CREATE TABLE public.view_counts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES public.content(id),
  media_id UUID REFERENCES public.media_assets(id),
  view_count INTEGER NOT NULL DEFAULT 0,
  last_viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  CONSTRAINT content_or_media CHECK (
    (content_id IS NOT NULL AND media_id IS NULL) OR
    (content_id IS NULL AND media_id IS NOT NULL)
  ),
  
  UNIQUE (content_id, media_id)
);

-- Enable RLS on all tables
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_categories_junction ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_tags_junction ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.view_counts ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Media Assets Policies
CREATE POLICY "Public users can view published media"
  ON public.media_assets
  FOR SELECT
  USING (deleted_at IS NULL);

CREATE POLICY "Authenticated users can create media"
  ON public.media_assets
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own media"
  ON public.media_assets
  FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Admins can manage all media"
  ON public.media_assets
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Media Categories Policies
CREATE POLICY "Everyone can view media categories"
  ON public.media_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage media categories"
  ON public.media_categories
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Content Policies
CREATE POLICY "Public users can view published content"
  ON public.content
  FOR SELECT
  USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Authenticated users can view their own content"
  ON public.content
  FOR SELECT
  USING (auth.uid() = author_id);

CREATE POLICY "Authenticated users can create content"
  ON public.content
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own content"
  ON public.content
  FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all content"
  ON public.content
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Content Categories Policies
CREATE POLICY "Everyone can view content categories"
  ON public.content_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage content categories"
  ON public.content_categories
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_media_assets_updated_at
BEFORE UPDATE ON public.media_assets
FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_media_categories_updated_at
BEFORE UPDATE ON public.media_categories
FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_content_updated_at
BEFORE UPDATE ON public.content
FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_content_categories_updated_at
BEFORE UPDATE ON public.content_categories
FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX media_assets_created_by_idx ON public.media_assets(created_by);
CREATE INDEX media_assets_file_type_idx ON public.media_assets(file_type);
CREATE INDEX media_categories_parent_id_idx ON public.media_categories(parent_id);
CREATE INDEX content_author_id_idx ON public.content(author_id);
CREATE INDEX content_status_idx ON public.content(status);
CREATE INDEX content_categories_parent_id_idx ON public.content_categories(parent_id);
CREATE INDEX content_revisions_content_id_idx ON public.content_revisions(content_id);
