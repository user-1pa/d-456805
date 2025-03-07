// src/pages/admin/ContentAdmin.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  getContent, 
  getContentCategories, 
  getContentTags, 
  deleteContent, 
  Content,
  ContentFilter,
  ContentCategory,
  ContentTag
} from '../../lib/api/content';
import { ContentEditor } from '../../components/content/ContentEditor';

export default function ContentAdmin() {
  const navigate = useNavigate();
  const [contents, setContents] = useState<Content[]>([]);
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [tags, setTags] = useState<ContentTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'categories' | 'tags'>('list');
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<ContentFilter>({
    status: 'all',
    limit: 10
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  
  // Load content, categories, and tags
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        // Apply filters
        const currentFilter: ContentFilter = {
          ...filter,
          search: searchTerm || undefined,
          status: statusFilter,
          categories: categoryFilter.length > 0 ? categoryFilter : undefined,
          tags: tagFilter.length > 0 ? tagFilter : undefined,
          offset: (page - 1) * (filter.limit || 10)
        };
        
        // Load content with filters
        const { data, count } = await getContent(currentFilter);
        
        // Load categories and tags for filters
        const [categoriesData, tagsData] = await Promise.all([
          getContentCategories(),
          getContentTags()
        ]);
        
        setContents(data || []);
        setTotalCount(count || 0);
        setCategories(categoriesData || []);
        setTags(tagsData || []);
      } catch (err: any) {
        console.error('Error loading content data:', err);
        setError(err.message || 'Failed to load content');
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [page, filter, searchTerm, statusFilter, categoryFilter, tagFilter]);
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset page when searching
    setPage(1);
  };
  
  // Handle category filter change
  const handleCategoryFilterChange = (categoryId: string) => {
    setCategoryFilter(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
    // Reset page when changing filters
    setPage(1);
  };
  
  // Handle tag filter change
  const handleTagFilterChange = (tagId: string) => {
    setTagFilter(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
    // Reset page when changing filters
    setPage(1);
  };
  
  // Handle content deletion
  const handleDeleteContent = async (contentId: string) => {
    if (!window.confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteContent(contentId);
      // Refresh content list
      setContents(contents.filter(content => content.id !== contentId));
    } catch (err: any) {
      console.error('Error deleting content:', err);
      alert('Failed to delete content: ' + (err.message || 'Unknown error'));
    }
  };
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-blue-100 text-blue-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Content Management</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('list')}
            className={`
              whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'list'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            All Content
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`
              whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'create'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Create New
          </button>
        </nav>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <p>{error}</p>
        </div>
      )}
      
      {/* Content List */}
      {activeTab === 'list' && (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="w-full md:w-64">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black pr-10"
                  />
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </form>
              
              {/* Filters */}
              <div className="flex items-center space-x-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
                
                <select
                  value={filter.sortBy || 'created_at'}
                  onChange={(e) => setFilter({...filter, sortBy: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-sm"
                >
                  <option value="created_at">Sort by Date Created</option>
                  <option value="updated_at">Sort by Date Updated</option>
                  <option value="published_at">Sort by Date Published</option>
                  <option value="title">Sort by Title</option>
                </select>
                
                <select
                  value={filter.sortDirection || 'desc'}
                  onChange={(e) => setFilter({...filter, sortDirection: e.target.value as 'asc' | 'desc'})}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-sm"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
            
            {/* Category and Tag Filters */}
            <div className="mt-4 flex flex-wrap gap-2">
              <div className="inline-block mr-2">
                <span className="text-sm font-medium text-gray-700">Filter by:</span>
              </div>
              
              {categories.slice(0, 5).map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryFilterChange(category.id)}
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${categoryFilter.includes(category.id)
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                >
                  {category.name}
                </button>
              ))}
              
              {tags.slice(0, 5).map(tag => (
                <button
                  key={tag.id}
                  onClick={() => handleTagFilterChange(tag.id)}
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${tagFilter.includes(tag.id)
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                >
                  {tag.name}
                </button>
              ))}
              
              {(categoryFilter.length > 0 || tagFilter.length > 0) && (
                <button
                  onClick={() => {
                    setCategoryFilter([]);
                    setTagFilter([]);
                  }}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-red-800 bg-red-100 hover:bg-red-200"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
          
          {loading && contents.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : contents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No content found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Published
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contents.map(content => (
                    <tr key={content.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {content.featured_image && (
                            <div className="flex-shrink-0 h-10 w-10 mr-3">
                              <img
                                className="h-10 w-10 rounded-md object-cover"
                                src={content.featured_image.file_path}
                                alt=""
                              />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {content.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {content.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(content.status)}`}>
                          {content.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(content.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(content.published_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/admin/content/edit/${content.id}`}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </Link>
                        {content.status === 'published' && (
                          <a
                            href={`/${content.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            View
                          </a>
                        )}
                        <button
                          onClick={() => handleDeleteContent(content.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {totalCount > (filter.limit || 10) && (
            <div className="px-4 py-3 flex items-center justify-between border-t">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(page - 1) * (filter.limit || 10) + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(page * (filter.limit || 10), totalCount)}</span> of{' '}
                  <span className="font-medium">{totalCount}</span> results
                </p>
              </div>
              <div className="flex-1 flex justify-end">
                <button
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed mr-2"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page * (filter.limit || 10) >= totalCount}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Create New Content */}
      {activeTab === 'create' && (
        <ContentEditor 
          onSave={(savedContent) => {
            // After saving, redirect to the content list
            setActiveTab('list');
            // Refresh the content list
            setPage(1);
          }}
        />
      )}
    </div>
  );
}
