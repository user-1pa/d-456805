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
      
      if (contentIdsError) throw contentIdsError;
      
      const ids = contentIds?.map(item => item.content_id);
      if (ids && ids.length > 0) {
        query = query.in('id', ids);
      } else {
        // No content matches these categories, return empty result
        return { data: [], count: 0 };
      }
    }
    
    if (filters.tags && filters.tags.length > 0) {
      // Similar approach for tags
      const { data: contentIds, error: contentIdsError } = await supabaseClient
        .from('content_tags_junction')
        .select('content_id')
        .in('tag_id', filters.tags);
        
      if (contentIdsError) throw contentIdsError;
      
      const ids = contentIds?.map(item => item.content_id);
      if (ids && ids.length > 0) {
        query = query.in('id', ids);
      } else {
        // No content matches these tags, return empty result
        return { data: [], count: 0 };
      }
    }
    
    // Add sorting
    const sortBy = filters.sortBy || (filters.status === 'published' ? 'published_at' : 'created_at');
    const sortDirection = filters.sortDirection || 'desc';
    query = query.order(sortBy, { ascending: sortDirection === 'asc' });
    
    // Add pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
    }
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    // Process the data to format the joined tables
    const processedData = data?.map(item => {
      const categories = item.content_categories_junction?.map(
        (junction: any) => junction.content_categories
      ).filter(Boolean) || [];
      
      const tags = item.content_tags_junction?.map(
        (junction: any) => junction.content_tags
      ).filter(Boolean) || [];
      
      const mediaAssets = item.content_media_assets?.map(
        (junction: any) => ({
          ...junction.media_assets,
          position: junction.position
        })
      ).sort((a: any, b: any) => a.position - b.position) || [];
      
      delete item.content_categories_junction;
      delete item.content_tags_junction;
      delete item.content_media_assets;
      
      return {
        ...item,
        categories,
        tags,
        media_assets: mediaAssets
      };
    });
    
    return { data: processedData, count };
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
}

export async function getContentBySlug(slug: string) {
  try {
    const { data, error } = await supabaseClient
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
      `)
      .eq('slug', slug)
      .is('deleted_at', null)
      .single();
      
    if (error) throw error;
    
    // Process the data to format the joined tables
    const categories = data.content_categories_junction?.map(
      (junction: any) => junction.content_categories
    ).filter(Boolean) || [];
    
    const tags = data.content_tags_junction?.map(
      (junction: any) => junction.content_tags
    ).filter(Boolean) || [];
    
    const mediaAssets = data.content_media_assets?.map(
      (junction: any) => ({
        ...junction.media_assets,
        position: junction.position
      })
    ).sort((a: any, b: any) => a.position - b.position) || [];
    
    delete data.content_categories_junction;
    delete data.content_tags_junction;
    delete data.content_media_assets;
    
    // Increment view count
    incrementContentViewCount(data.id).catch(console.error);
    
    return {
      ...data,
      categories,
      tags,
      media_assets: mediaAssets
    };
  } catch (error) {
    console.error('Error fetching content by slug:', error);
    throw error;
  }
}

export async function createContent(content: {
  title: string;
  slug: string;
  summary?: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  featured_image_id?: string;
  published_at?: string;
  categories?: string[];
  tags?: string[];
  media_assets?: { id: string; position: number }[];
}) {
  try {
    // 1. Create the content record
    const { data, error } = await supabaseClient
      .from('content')
      .insert([{
        title: content.title,
        slug: content.slug,
        summary: content.summary || null,
        content: content.content,
        status: content.status,
        featured_image_id: content.featured_image_id || null,
        author_id: (await supabaseClient.auth.getUser()).data.user?.id,
        published_at: content.status === 'published' ? (content.published_at || new Date().toISOString()) : null
      }])
      .select()
      .single();
      
    if (error) throw error;
    
    // Save initial revision
    await createContentRevision({
      content_id: data.id,
      title: data.title,
      content: data.content,
      summary: data.summary || null
    });
    
    // 2. Associate with categories if provided
    if (content.categories && content.categories.length > 0) {
      const categoryAssociations = content.categories.map(categoryId => ({
        content_id: data.id,
        category_id: categoryId
      }));
      
      const { error: categoriesError } = await supabaseClient
        .from('content_categories_junction')
        .insert(categoryAssociations);
        
      if (categoriesError) throw categoriesError;
    }
    
    // 3. Associate with tags if provided
    if (content.tags && content.tags.length > 0) {
      const tagAssociations = content.tags.map(tagId => ({
        content_id: data.id,
        tag_id: tagId
      }));
      
      const { error: tagsError } = await supabaseClient
        .from('content_tags_junction')
        .insert(tagAssociations);
        
      if (tagsError) throw tagsError;
    }
    
    // 4. Associate with media assets if provided
    if (content.media_assets && content.media_assets.length > 0) {
      const mediaAssociations = content.media_assets.map(asset => ({
        content_id: data.id,
        asset_id: asset.id,
        position: asset.position
      }));
      
      const { error: mediaError } = await supabaseClient
        .from('content_media_assets')
        .insert(mediaAssociations);
        
      if (mediaError) throw mediaError;
    }
    
    return data;
  } catch (error) {
    console.error('Error creating content:', error);
    throw error;
  }
}

export async function updateContent(
  id: string,
  updates: {
    title?: string;
    slug?: string;
    summary?: string;
    content?: string;
    status?: 'draft' | 'published' | 'archived';
    featured_image_id?: string | null;
    published_at?: string | null;
    categories?: string[];
    tags?: string[];
    media_assets?: { id: string; position: number }[];
    create_revision?: boolean;
  }
) {
  try {
    // Get current content for revision if needed
    let currentContent = null;
    if (updates.create_revision) {
      const { data, error } = await supabaseClient
        .from('content')
        .select('title, content, summary')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      currentContent = data;
    }
    
    // 1. Update the content record
    const updateData: any = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.slug !== undefined) updateData.slug = updates.slug;
    if (updates.summary !== undefined) updateData.summary = updates.summary;
    if (updates.content !== undefined) updateData.content = updates.content;
    if (updates.status !== undefined) {
      updateData.status = updates.status;
      // If publishing, set published_at if not already set
      if (updates.status === 'published' && updates.published_at === undefined) {
        const { data: existingData } = await supabaseClient
          .from('content')
          .select('published_at')
          .eq('id', id)
          .single();
          
        if (!existingData.published_at) {
          updateData.published_at = new Date().toISOString();
        }
      }
    }
    if (updates.featured_image_id !== undefined) updateData.featured_image_id = updates.featured_image_id;
    if (updates.published_at !== undefined) updateData.published_at = updates.published_at;
    
    const { data, error } = await supabaseClient
      .from('content')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    // Create content revision if changes were made to content
    if (updates.create_revision && currentContent && (
      updates.title !== undefined || 
      updates.content !== undefined || 
      updates.summary !== undefined
    )) {
      await createContentRevision({
        content_id: id,
        title: currentContent.title,
        content: currentContent.content,
        summary: currentContent.summary
      });
    }
    
    // 2. Update categories if provided
    if (updates.categories !== undefined) {
      // First, remove all existing category associations
      const { error: deleteCategoriesError } = await supabaseClient
        .from('content_categories_junction')
        .delete()
        .eq('content_id', id);
        
      if (deleteCategoriesError) throw deleteCategoriesError;
      
      // Then add the new category associations
      if (updates.categories.length > 0) {
        const categoryAssociations = updates.categories.map(categoryId => ({
          content_id: id,
          category_id: categoryId
        }));
        
        const { error: insertCategoriesError } = await supabaseClient
          .from('content_categories_junction')
          .insert(categoryAssociations);
          
        if (insertCategoriesError) throw insertCategoriesError;
      }
    }
    
    // 3. Update tags if provided
    if (updates.tags !== undefined) {
      // First, remove all existing tag associations
      const { error: deleteTagsError } = await supabaseClient
        .from('content_tags_junction')
        .delete()
        .eq('content_id', id);
        
      if (deleteTagsError) throw deleteTagsError;
      
      // Then add the new tag associations
      if (updates.tags.length > 0) {
        const tagAssociations = updates.tags.map(tagId => ({
          content_id: id,
          tag_id: tagId
        }));
        
        const { error: insertTagsError } = await supabaseClient
          .from('content_tags_junction')
          .insert(tagAssociations);
          
        if (insertTagsError) throw insertTagsError;
      }
    }
    
    // 4. Update media assets if provided
    if (updates.media_assets !== undefined) {
      // First, remove all existing media associations
      const { error: deleteMediaError } = await supabaseClient
        .from('content_media_assets')
        .delete()
        .eq('content_id', id);
        
      if (deleteMediaError) throw deleteMediaError;
      
      // Then add the new media associations
      if (updates.media_assets.length > 0) {
        const mediaAssociations = updates.media_assets.map(asset => ({
          content_id: id,
          asset_id: asset.id,
          position: asset.position
        }));
        
        const { error: insertMediaError } = await supabaseClient
          .from('content_media_assets')
          .insert(mediaAssociations);
          
        if (insertMediaError) throw insertMediaError;
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error updating content:', error);
    throw error;
  }
}

export async function deleteContent(id: string, permanent: boolean = false) {
  try {
    if (permanent) {
      // Permanently delete the content and all its associations
      // Junction tables will be deleted due to ON DELETE CASCADE
      const { error } = await supabaseClient
        .from('content')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    } else {
      // Soft delete (mark as deleted)
      const { error } = await supabaseClient
        .from('content')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);
        
      if (error) throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting content:', error);
    throw error;
  }
}

// Content Categories Functions
export async function getContentCategories() {
  try {
    const { data, error } = await supabaseClient
      .from('content_categories')
      .select('*')
      .order('name');
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching content categories:', error);
    throw error;
  }
}

export async function createContentCategory(category: {
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
}) {
  try {
    const { data, error } = await supabaseClient
      .from('content_categories')
      .insert([category])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating content category:', error);
    throw error;
  }
}

// Content Tags Functions
export async function getContentTags() {
  try {
    const { data, error } = await supabaseClient
      .from('content_tags')
      .select('*')
      .order('name');
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching content tags:', error);
    throw error;
  }
}

export async function createContentTag(tag: {
  name: string;
  slug: string;
}) {
  try {
    const { data, error } = await supabaseClient
      .from('content_tags')
      .insert([tag])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating content tag:', error);
    throw error;
  }
}

// Content Revisions Functions
export async function getContentRevisions(contentId: string) {
  try {
    const { data, error } = await supabaseClient
      .from('content_revisions')
      .select(`
        *,
        user:profiles!changed_by (id, email, full_name)
      `)
      .eq('content_id', contentId)
      .order('revision_number', { ascending: false });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching content revisions:', error);
    throw error;
  }
}

export async function createContentRevision(revision: {
  content_id: string;
  title: string;
  content: string;
  summary?: string;
}) {
  try {
    // Get the next revision number
    const { data: revisions, error: countError } = await supabaseClient
      .from('content_revisions')
      .select('revision_number')
      .eq('content_id', revision.content_id)
      .order('revision_number', { ascending: false })
      .limit(1);
      
    if (countError) throw countError;
    
    const nextRevisionNumber = revisions && revisions.length > 0 
      ? revisions[0].revision_number + 1 
      : 1;
    
    const { data, error } = await supabaseClient
      .from('content_revisions')
      .insert([{
        content_id: revision.content_id,
        title: revision.title,
        content: revision.content,
        summary: revision.summary || null,
        revision_number: nextRevisionNumber,
        changed_by: (await supabaseClient.auth.getUser()).data.user?.id
      }])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating content revision:', error);
    throw error;
  }
}

// View count functions
export async function incrementContentViewCount(contentId: string) {
  try {
    // Check if record exists
    const { data, error } = await supabaseClient
      .from('view_counts')
      .select('id, view_count')
      .eq('content_id', contentId)
      .maybeSingle();
      
    if (error) throw error;
    
    if (data) {
      // Update existing record
      await supabaseClient
        .from('view_counts')
        .update({ 
          view_count: data.view_count + 1,
          last_viewed_at: new Date().toISOString()
        })
        .eq('id', data.id);
    } else {
      // Create new record
      await supabaseClient
        .from('view_counts')
        .insert([{
          content_id: contentId,
          view_count: 1
        }]);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error incrementing view count:', error);
    // Don't throw - this is a non-critical operation
    return { success: false };
  }
}
