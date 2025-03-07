// src/lib/api/content.ts
import { supabaseClient } from '../supabase';
import { MediaAsset } from './media';

// Types
export interface Content {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  featured_image_id?: string;
  author_id: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  
  // Joined data
  featured_image?: MediaAsset;
  author?: {
    id: string;
    email: string;
    full_name?: string;
  };
  categories?: ContentCategory[];
  tags?: ContentTag[];
  media_assets?: MediaAsset[];
}

export interface ContentCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ContentTag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface ContentRevision {
  id: string;
  content_id: string;
  title: string;
  content: string;
  summary?: string;
  revision_number: number;
  changed_by: string;
  created_at: string;
}

export interface ContentFilter {
  categories?: string[];
  tags?: string[];
  search?: string;
  status?: 'draft' | 'published' | 'archived' | 'all';
  authorId?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Content Functions
export async function getContent(filters: ContentFilter = {}) {
  try {
    let query = supabaseClient
      .from('content')
      .select(`
        *,
        featured_image:media_assets!featured_image_id (*),
        author:profiles!author_id (id, email, full_name),
        content_categories_junction (
          content_categories (*)
        ),
        content_tags_junction (
          content_tags (*)
        ),
        content_media_assets (
          position,
          media_assets (*)
        )
      `);
    
    // Filter by deleted
    if (!filters.status || filters.status !== 'all') {
      query = query.is('deleted_at', null);
    }
    
    // Apply filters
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,summary.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
    }
    
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    
    if (filters.authorId) {
      query = query.eq('author_id', filters.authorId);
    }
    
    if (filters.dateFrom) {
      if (filters.status === 'published') {
        query = query.gte('published_at', filters.dateFrom);
      } else {
        query = query.gte('created_at', filters.dateFrom);
      }
    }
    
    if (filters.dateTo) {
      if (filters.status === 'published') {
        query = query.lte('published_at', filters.dateTo);
      } else {
        query = query.lte('created_at', filters.dateTo);
      }
    }
    
    // Category and tag filtering requires special handling due to junction tables
    if (filters.categories && filters.categories.length > 0) {
      // We need to switch to a different approach with inner joins
      // This becomes more complex with Supabase's query builder
      // One approach is to use a stored procedure or use raw SQL
      // For simplicity here, we'll query content IDs first that match categories
      const { data: contentIds, error: contentIdsError } = await supabaseClient
        .from('content_categories_junction')
        .select('content_id')
        .in('category_id', filters.categories);
      
      if (
