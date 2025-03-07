// src/lib/api/media.ts
import { supabaseClient } from '../supabase';

// Types
export interface MediaAsset {
  id: string;
  title: string;
  description?: string;
  file_path: string;
  file_name: string;
  file_type: string;
  file_size: number;
  mime_type: string;
  dimensions?: {
    width: number;
    height: number;
  };
  metadata?: any;
  alt_text?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface MediaCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
}

export interface MediaTag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface MediaFilter {
  categories?: string[];
  tags?: string[];
  search?: string;
  fileTypes?: string[];
  dateFrom?: string;
  dateTo?: string;
  createdBy?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Media Assets Functions
export async function uploadMediaAsset(
  file: File,
  metadata: {
    title: string;
    description?: string;
    alt_text?: string;
    categories?: string[];
    tags?: string[];
    customMetadata?: any;
  }
) {
  try {
    // 1. Upload file to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `media/${fileName}`;
    
    const { data: uploadData, error: uploadError } = await supabaseClient
      .storage
      .from('assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (uploadError) throw uploadError;
    
    // 2. Get dimensions if it's an image
    let dimensions = null;
    if (file.type.startsWith('image/')) {
      dimensions = await getImageDimensions(file);
    }
    
    // 3. Create media asset record
    const { data: asset, error: assetError } = await supabaseClient
      .from('media_assets')
      .insert([
        {
          title: metadata.title,
          description: metadata.description || null,
          file_path: filePath,
          file_name: file.name,
          file_type: fileExt?.toLowerCase() || '',
          file_size: file.size,
          mime_type: file.type,
          dimensions: dimensions,
          metadata: metadata.customMetadata || {},
          alt_text: metadata.alt_text || null,
          created_by: (await supabaseClient.auth.getUser()).data.user?.id,
        }
      ])
      .select()
      .single();
      
    if (assetError) throw assetError;
    
    // 4. Associate with categories if provided
    if (metadata.categories && metadata.categories.length > 0) {
      const categoryAssociations = metadata.categories.map(categoryId => ({
        asset_id: asset.id,
        category_id: categoryId
      }));
      
      const { error: categoriesError } = await supabaseClient
        .from('media_assets_categories')
        .insert(categoryAssociations);
        
      if (categoriesError) throw categoriesError;
    }
    
    // 5. Associate with tags if provided
    if (metadata.tags && metadata.tags.length > 0) {
      const tagAssociations = metadata.tags.map(tagId => ({
        asset_id: asset.id,
        tag_id: tagId
      }));
      
      const { error: tagsError } = await supabaseClient
        .from('media_assets_tags')
        .insert(tagAssociations);
        
      if (tagsError) throw tagsError;
    }
    
    return asset;
  } catch (error) {
    console.error('Error uploading media asset:', error);
    throw error;
  }
}

export async function getMediaAssets(filters: MediaFilter = {}) {
  try {
    let query = supabaseClient
      .from('media_assets')
      .select(`
        *,
        media_assets_categories!inner (
          category_id,
          media_categories (id, name, slug)
        ),
        media_assets_tags!inner (
          tag_id,
          media_tags (id, name, slug)
        )
      `)
      .is('deleted_at', null);
    
    // Apply filters
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,file_name.ilike.%${filters.search}%`);
    }
    
    if (filters.fileTypes && filters.fileTypes.length > 0) {
      query = query.in('file_type', filters.fileTypes);
    }
    
    if (filters.dateFrom) {
      query = query.gte('created_at', filters.dateFrom);
    }
    
    if (filters.dateTo) {
      query = query.lte('created_at', filters.dateTo);
    }
    
    if (filters.createdBy) {
      query = query.eq('created_by', filters.createdBy);
    }
    
    if (filters.categories && filters.categories.length > 0) {
      query = query.in('media_assets_categories.category_id', filters.categories);
    }
    
    if (filters.tags && filters.tags.length > 0) {
      query = query.in('media_assets_tags.tag_id', filters.tags);
    }
    
    // Add sorting
    const sortBy = filters.sortBy || 'created_at';
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
    
    // Process the data to merge categories and tags
    const processedData = data?.map(item => {
      const categories = item.media_assets_categories?.map(
        (cat: any) => cat.media_categories
      ).filter(Boolean) || [];
      
      const tags = item.media_assets_tags?.map(
        (tag: any) => tag.media_tags
      ).filter(Boolean) || [];
      
      delete item.media_assets_categories;
      delete item.media_assets_tags;
      
      return {
        ...item,
        categories,
        tags
      };
    });
    
    return { data: processedData, count };
  } catch (error) {
    console.error('Error fetching media assets:', error);
    throw error;
  }
}

export async function getMediaAssetById(id: string) {
  try {
    const { data, error } = await supabaseClient
      .from('media_assets')
      .select(`
        *,
        media_assets_categories (
          category_id,
          media_categories (id, name, slug)
        ),
        media_assets_tags (
          tag_id,
          media_tags (id, name, slug)
        )
      `)
      .eq('id', id)
      .is('deleted_at', null)
      .single();
      
    if (error) throw error;
    
    // Process the data to merge categories and tags
    const categories = data.media_assets_categories?.map(
      (cat: any) => cat.media_categories
    ).filter(Boolean) || [];
    
    const tags = data.media_assets_tags?.map(
      (tag: any) => tag.media_tags
    ).filter(Boolean) || [];
    
    delete data.media_assets_categories;
    delete data.media_assets_tags;
    
    return {
      ...data,
      categories,
      tags
    };
  } catch (error) {
    console.error('Error fetching media asset:', error);
    throw error;
  }
}

export async function updateMediaAsset(
  id: string,
  updates: {
    title?: string;
    description?: string;
    alt_text?: string;
    metadata?: any;
    categories?: string[];
    tags?: string[];
  }
) {
  try {
    // 1. Update the media asset record
    const updateData: any = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.alt_text !== undefined) updateData.alt_text = updates.alt_text;
    if (updates.metadata !== undefined) updateData.metadata = updates.metadata;
    
    const { data, error } = await supabaseClient
      .from('media_assets')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    // 2. Update categories if provided
    if (updates.categories !== undefined) {
      // First, remove all existing category associations
      const { error: deleteCategoriesError } = await supabaseClient
        .from('media_assets_categories')
        .delete()
        .eq('asset_id', id);
        
      if (deleteCategoriesError) throw deleteCategoriesError;
      
      // Then add the new category associations
      if (updates.categories.length > 0) {
        const categoryAssociations = updates.categories.map(categoryId => ({
          asset_id: id,
          category_id: categoryId
        }));
        
        const { error: insertCategoriesError } = await supabaseClient
          .from('media_assets_categories')
          .insert(categoryAssociations);
          
        if (insertCategoriesError) throw insertCategoriesError;
      }
    }
    
    // 3. Update tags if provided
    if (updates.tags !== undefined) {
      // First, remove all existing tag associations
      const { error: deleteTagsError } = await supabaseClient
        .from('media_assets_tags')
        .delete()
        .eq('asset_id', id);
        
      if (deleteTagsError) throw deleteTagsError;
      
      // Then add the new tag associations
      if (updates.tags.length > 0) {
        const tagAssociations = updates.tags.map(tagId => ({
          asset_id: id,
          tag_id: tagId
        }));
        
        const { error: insertTagsError } = await supabaseClient
          .from('media_assets_tags')
          .insert(tagAssociations);
          
        if (insertTagsError) throw insertTagsError;
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error updating media asset:', error);
    throw error;
  }
}

export async function deleteMediaAsset(id: string, permanent: boolean = false) {
  try {
    if (permanent) {
      // Get the file path first
      const { data: asset, error: getError } = await supabaseClient
        .from('media_assets')
        .select('file_path')
        .eq('id', id)
        .single();
        
      if (getError) throw getError;
      
      // Delete the file from storage
      const { error: storageError } = await supabaseClient
        .storage
        .from('assets')
        .remove([asset.file_path]);
        
      if (storageError) throw storageError;
      
      // Delete the record
      const { error: deleteError } = await supabaseClient
        .from('media_assets')
        .delete()
        .eq('id', id);
        
      if (deleteError) throw deleteError;
    } else {
      // Soft delete (mark as deleted)
      const { error: updateError } = await supabaseClient
        .from('media_assets')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);
        
      if (updateError) throw updateError;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting media asset:', error);
    throw error;
  }
}

// Media Categories Functions
export async function getMediaCategories() {
  try {
    const { data, error } = await supabaseClient
      .from('media_categories')
      .select('*')
      .order('name');
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching media categories:', error);
    throw error;
  }
}

export async function createMediaCategory(category: {
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
}) {
  try {
    const { data, error } = await supabaseClient
      .from('media_categories')
      .insert([category])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating media category:', error);
    throw error;
  }
}

// Media Tags Functions
export async function getMediaTags() {
  try {
    const { data, error } = await supabaseClient
      .from('media_tags')
      .select('*')
      .order('name');
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching media tags:', error);
    throw error;
  }
}

export async function createMediaTag(tag: {
  name: string;
  slug: string;
}) {
  try {
    const { data, error } = await supabaseClient
      .from('media_tags')
      .insert([tag])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating media tag:', error);
    throw error;
  }
}

// Helper function to get image dimensions
async function getImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = () => {
      resolve(null);
    };
    img.src = URL.createObjectURL(file);
  });
}

// Get public URL for a media asset
export function getMediaUrl(filePath: string) {
  const { data } = supabaseClient
    .storage
    .from('assets')
    .getPublicUrl(filePath);
    
  return data.publicUrl;
}
