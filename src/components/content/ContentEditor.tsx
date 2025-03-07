// src/components/content/ContentEditor.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  createContent, 
  updateContent, 
  getContentCategories, 
  getContentTags,
  Content,
  ContentCategory,
  ContentTag
} from '../../lib/api/content';
import { MediaGallery } from '../media/MediaGallery';
import { getMediaUrl, MediaAsset } from '../../lib/api/media';

interface ContentEditorProps {
  existingContent?: Content;
  onSave?: (content: Content) => void;
  className?: string;
}

export function ContentEditor({ existingContent, onSave, className = '' }: ContentEditorProps) {
  const navigate = useNavigate();
  const [title, setTitle] = useState(existingContent?.title || '');
  const [slug, setSlug] = useState(existingContent?.slug || '');
  const [summary, setSummary] = useState(existingContent?.summary || '');
  const [content, setContent] = useState(existingContent?.content || '');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>(existingContent?.status || 'draft');
  const [featuredImageId, setFeaturedImageId] = useState<string | undefined>(existingContent?.featured_image_id);
  const [featuredImage, setFeaturedImage] = useState<MediaAsset | undefined>(existingContent?.featured_image);
  const [mediaAssets, setMediaAssets] = useState<{ id: string; position: number }[]>(
    existingContent?.media_assets?.map(asset => ({ 
      id: asset.id, 
      position: asset.position || 0 
    })) || []
  );
  
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [tags, setTags] = useState<ContentTag[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    existingContent?.categories?.map(cat => cat.id) || []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    existingContent?.tags?.map(tag => tag.id) || []
  );
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [mediaGalleryMode, setMediaGalleryMode] = useState<'featured' | 'content'>('featured');
  
  // Auto-generate slug from title
  useEffect(() => {
    if (!existingContent && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')  // Remove special characters
        .replace(/\s+/g, '-')      // Replace spaces with hyphens
        .replace(/-+/g, '-');      // Replace multiple hyphens with single hyphen
      
      setSlug(generatedSlug);
    }
  }, [title, existingContent]);
  
  // Load categories and tags
  useEffect(() => {
    async function loadCategoriesAndTags() {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          getContentCategories(),
          getContentTags()
        ]);
        
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (err: any) {
        console.error('Error loading categories and tags:', err);
        setError('Failed to load categories and tags. Please refresh and try again.');
      }
    }
    
    loadCategoriesAndTags();
  }, []);
  
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow lowercase alphanumeric characters, hyphens, and underscores
    const value = e.target.value
      .toLowerCase()
      .replace(/[^\w-]/g, '-')
      .replace(/-+/g, '-');
    
    setSlug(value);
  };
  
  const handleMediaSelect = (asset: MediaAsset) => {
    if (mediaGalleryMode === 'featured') {
      setFeaturedImageId(asset.id);
      setFeaturedImage(asset);
      setShowMediaGallery(false);
    } else {
      // Add to content media assets if not already present
      if (!mediaAssets.some(item => item.id === asset.id)) {
        setMediaAssets([
          ...mediaAssets,
          { id: asset.id, position: mediaAssets.length }
        ]);
      }
    }
  };
  
  const removeMediaAsset = (assetId: string) => {
    setMediaAssets(mediaAssets.filter(asset => asset.id !== assetId));
  };
  
  const handleSave = async (saveAsDraft: boolean = false) => {
    try {
      const finalStatus = saveAsDraft ? 'draft' : status;
      
      setLoading(true);
      setError(null);
      
      const contentData = {
        title,
        slug,
        summary: summary || undefined,
        content,
        status: finalStatus,
        featured_image_id: featuredImageId,
        categories: selectedCategories,
        tags: selectedTags,
        media_assets: mediaAssets,
        create_revision: !!existingContent // Only create revision if editing existing content
      };
      
      let savedContent;
      
      if (existingContent) {
        savedContent = await updateContent(existingContent.id, contentData);
      } else {
        savedContent = await createContent(contentData);
      }
      
      if (onSave) {
        onSave(savedContent);
      } else {
        navigate(`/admin/content/${savedContent.id}`);
      }
    } catch (err: any) {
      console.error('Error saving content:', err);
      setError(err.message || 'Failed to save content. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={`bg-white rounded-lg border p-6 ${className}`}>
      <h2 className="text-2xl font-semibold mb-6">
        {existingContent ? 'Edit Content' : 'Create New Content'}
      </h2>
      
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <p>{error}</p>
        </div>
      )}
      
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
            />
          </div>
          
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={handleSlugChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
            />
            <p className="mt-1 text-xs text-gray-500">
              URL-friendly identifier. Auto-generated from title.
            </p>
          </div>
        </div>
        
        {/* Summary */}
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
            Summary
          </label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
          />
          <p className="mt-1 text-xs text-gray-500">
            A brief description that will be displayed in content listings
          </p>
        </div>
        
        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Featured Image
          </label>
          {featuredImage ? (
            <div className="relative mb-2">
              <img 
                src={getMediaUrl(featuredImage.file_path)} 
                alt={featuredImage.alt_text || featuredImage.title} 
                className="w-full max-h-64 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => {
                  setFeaturedImageId(undefined);
                  setFeaturedImage(undefined);
                }}
                className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-1 rounded-full hover:bg-opacity-90"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => {
                setMediaGalleryMode('featured');
                setShowMediaGallery(true);
              }}
            >
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-1 text-sm text-gray-600">
                Click to select a featured image
              </p>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content *
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
          />
        </div>
        
        {/* Media Assets */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Media Assets
            </label>
            <button
              type="button"
              onClick={() => {
                setMediaGalleryMode('content');
                setShowMediaGallery(true);
              }}
              className="text-sm text-black hover:text-gray-700 underline"
            >
              Add Media
            </button>
          </div>
          
          {mediaAssets.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No media assets added</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {mediaAssets.map((asset, index) => (
                <div key={asset.id} className="relative border rounded-md overflow-hidden">
                  <div className="aspect-w-1 aspect-h-1 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Media ID: {asset.id}</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black bg-opacity-50 transition-opacity">
                    <button
                      type="button"
                      onClick={() => removeMediaAsset(asset.id)}
                      className="bg-white text-red-600 p-1 rounded-full hover:bg-gray-100"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Categories and Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categories
            </label>
            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
              {categories.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No categories available</p>
              ) : (
                categories.map(category => (
                  <div key={category.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories([...selectedCategories, category.id]);
                        } else {
                          setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                        }
                      }}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    <label htmlFor={`category-${category.id}`} className="ml-2 block text-sm text-gray-700">
                      {category.name}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
              {tags.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No tags available</p>
              ) : (
                tags.map(tag => (
                  <div key={tag.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`tag-${tag.id}`}
                      checked={selectedTags.includes(tag.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTags([...selectedTags, tag.id]);
                        } else {
                          setSelectedTags(selectedTags.filter(id => id !== tag.id));
                        }
                      }}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    <label htmlFor={`tag-${tag.id}`} className="ml-2 block text-sm text-gray-700">
                      {tag.name}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="status-draft"
                name="status"
                value="draft"
                checked={status === 'draft'}
                onChange={() => setStatus('draft')}
                className="h-4 w-4 text-black focus:ring-black border-gray-300"
              />
              <label htmlFor="status-draft" className="ml-2 block text-sm text-gray-700">
                Draft
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="status-published"
                name="status"
                value="published"
                checked={status === 'published'}
                onChange={() => setStatus('published')}
                className="h-4 w-4 text-black focus:ring-black border-gray-300"
              />
              <label htmlFor="status-published" className="ml-2 block text-sm text-gray-700">
                Published
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="status-archived"
                name="status"
                value="archived"
                checked={status === 'archived'}
                onChange={() => setStatus('archived')}
                className="h-4 w-4 text-black focus:ring-black border-gray-300"
              />
              <label htmlFor="status-archived" className="ml-2 block text-sm text-gray-700">
                Archived
              </label>
            </div>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            type="button"
            onClick={() => handleSave(false)}
            className="px-4 py-2 bg-black border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            disabled={loading}
          >
            {loading ? 'Saving...' : status === 'published' ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>
      
      {/* Media Gallery Modal */}
      {showMediaGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">
                {mediaGalleryMode === 'featured' ? 'Select Featured Image' : 'Add Media Assets'}
              </h3>
              <button
                type="button"
                onClick={() => setShowMediaGallery(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
              <MediaGallery 
                onSelect={handleMediaSelect}
                selectionMode={mediaGalleryMode === 'featured' ? 'single' : 'multiple'}
                filter={{ fileTypes: mediaGalleryMode === 'featured' ? ['jpg', 'jpeg', 'png', 'gif', 'webp'] : undefined }}
              />
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                type="button"
                onClick={() => setShowMediaGallery(false)}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                {mediaGalleryMode === 'featured' ? 'Cancel' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
