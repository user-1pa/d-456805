// src/pages/admin/MediaAdmin.tsx
import React, { useState } from 'react';
import { MediaGallery } from '../../components/media/MediaGallery';
import { MediaUploader } from '../../components/media/MediaUploader';
import { getMediaCategories, getMediaTags, createMediaCategory, createMediaTag } from '../../lib/api/media';

export default function MediaAdmin() {
  const [activeTab, setActiveTab] = useState<'browse' | 'upload' | 'categories' | 'tags'>('browse');
  const [reloadGallery, setReloadGallery] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  
  // Category and tag creation states
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategorySlug, setNewCategorySlug] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [newTagSlug, setNewTagSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Load categories and tags
  React.useEffect(() => {
    async function loadData() {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          getMediaCategories(),
          getMediaTags()
        ]);
        
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (err: any) {
        console.error('Error loading media metadata:', err);
        setError('Failed to load categories and tags');
      }
    }
    
    loadData();
  }, []);
  
  // Handle category slug generation
  const handleCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setNewCategoryName(name);
    
    // Auto-generate slug if not manually edited
    if (!newCategorySlug || newCategorySlug === generateSlug(newCategoryName)) {
      setNewCategorySlug(generateSlug(name));
    }
  };
  
  // Handle tag slug generation
  const handleTagNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setNewTagName(name);
    
    // Auto-generate slug if not manually edited
    if (!newTagSlug || newTagSlug === generateSlug(newTagName)) {
      setNewTagSlug(generateSlug(name));
    }
  };
  
  // Generate a slug from text
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')  // Remove special characters
      .replace(/\s+/g, '-')      // Replace spaces with hyphens
      .replace(/-+/g, '-');      // Replace multiple hyphens with single hyphen
  };
  
  // Create new category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategoryName || !newCategorySlug) {
      setError('Name and slug are required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const newCategory = await createMediaCategory({
        name: newCategoryName,
        slug: newCategorySlug,
        description: newCategoryDescription || undefined
      });
      
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
      setNewCategorySlug('');
      setNewCategoryDescription('');
      setSuccess('Category created successfully');
    } catch (err: any) {
      console.error('Error creating category:', err);
      setError(err.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };
  
  // Create new tag
  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTagName || !newTagSlug) {
      setError('Name and slug are required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const newTag = await createMediaTag({
        name: newTagName,
        slug: newTagSlug
      });
      
      setTags([...tags, newTag]);
      setNewTagName('');
      setNewTagSlug('');
      setSuccess('Tag created successfully');
    } catch (err: any) {
      console.error('Error creating tag:', err);
      setError(err.message || 'Failed to create tag');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUploadComplete = () => {
    // Trigger reload of gallery
    setReloadGallery(prev => prev + 1);
    
    // Switch to browse tab
    setActiveTab('browse');
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Media Management</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('browse')}
            className={`
              whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'browse'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Browse Media
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`
              whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'upload'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Upload New Media
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`
              whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'categories'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('tags')}
            className={`
              whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'tags'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Tags
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'browse' && (
        <div key={reloadGallery}>
          <MediaGallery />
        </div>
      )}
      
      {activeTab === 'upload' && (
        <MediaUploader onUploadComplete={handleUploadComplete} />
      )}
      
      {activeTab === 'categories' && (
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Media Categories</h2>
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
              <p>{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4">
              <p>{success}</p>
            </div>
          )}
          
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Create New Category</h3>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="categoryName"
                    value={newCategoryName}
                    onChange={handleCategoryNameChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  />
                </div>
                
                <div>
                  <label htmlFor="categorySlug" className="block text-sm font-medium text-gray-700 mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    id="categorySlug"
                    value={newCategorySlug}
                    onChange={(e) => setNewCategorySlug(e.target.value.toLowerCase().replace(/[^\w-]/g, '-'))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="categoryDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="categoryDescription"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Existing Categories</h3>
            {categories.length === 0 ? (
              <p className="text-gray-500 italic">No categories found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Slug
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map(category => (
                      <tr key={category.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {category.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {category.slug}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {category.description || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'tags' && (
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Media Tags</h2>
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
              <p>{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4">
              <p>{success}</p>
            </div>
          )}
          
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Create New Tag</h3>
            <form onSubmit={handleCreateTag} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tagName" className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="tagName"
                    value={newTagName}
                    onChange={handleTagNameChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  />
                </div>
                
                <div>
                  <label htmlFor="tagSlug" className="block text-sm font-medium text-gray-700 mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    id="tagSlug"
                    value={newTagSlug}
                    onChange={(e) => setNewTagSlug(e.target.value.toLowerCase().replace(/[^\w-]/g, '-'))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  />
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Tag'}
                </button>
              </div>
            </form>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Existing Tags</h3>
            {tags.length === 0 ? (
              <p className="text-gray-500 italic">No tags found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Slug
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tags.map(tag => (
                      <tr key={tag.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {tag.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tag.slug}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
