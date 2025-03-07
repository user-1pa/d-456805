// src/components/media/MediaGallery.tsx
import React, { useState, useEffect } from 'react';
import { getMediaAssets, getMediaUrl, MediaAsset, MediaFilter } from '../../lib/api/media';

interface MediaGalleryProps {
  onSelect?: (asset: MediaAsset) => void;
  selectionMode?: 'single' | 'multiple' | 'none';
  initialSelectedIds?: string[];
  filter?: MediaFilter;
  className?: string;
}

export function MediaGallery({ 
  onSelect, 
  selectionMode = 'none', 
  initialSelectedIds = [],
  filter = {},
  className = ''
}: MediaGalleryProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  // Load media assets
  useEffect(() => {
    async function fetchMediaAssets() {
      try {
        setLoading(true);
        setError(null);
        
        const { data, count } = await getMediaAssets({
          ...filter,
          limit: itemsPerPage,
          offset: (page - 1) * itemsPerPage
        });
        
        setAssets(data || []);
        setTotalCount(count || 0);
      } catch (err: any) {
        console.error("Error loading media assets:", err);
        setError(err.message || "Failed to load media assets");
      } finally {
        setLoading(false);
      }
    }
    
    fetchMediaAssets();
  }, [page, filter]);

  // Handle selection
  const handleAssetClick = (asset: MediaAsset) => {
    if (selectionMode === 'none') return;
    
    if (selectionMode === 'single') {
      setSelectedIds([asset.id]);
      if (onSelect) onSelect(asset);
    } else {
      // Multiple selection mode
      const isSelected = selectedIds.includes(asset.id);
      let newSelectedIds;
      
      if (isSelected) {
        newSelectedIds = selectedIds.filter(id => id !== asset.id);
      } else {
        newSelectedIds = [...selectedIds, asset.id];
      }
      
      setSelectedIds(newSelectedIds);
      if (onSelect) {
        // In multiple selection mode, we pass the asset that was clicked
        // The parent component can use the selectedIds state if needed
        onSelect(asset);
      }
    }
  };

  // Render file type icon based on mime type
  const renderFileTypeIcon = (asset: MediaAsset) => {
    if (asset.file_type === 'pdf') {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50">
          <svg className="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        </div>
      );
    } else if (asset.mime_type.startsWith('video/')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-50">
          <svg className="w-12 h-12 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
        </div>
      );
    } else if (asset.mime_type.startsWith('audio/')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-purple-50">
          <svg className="w-12 h-12 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
          </svg>
        </div>
      );
    } else if (!asset.mime_type.startsWith('image/')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <svg className="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        </div>
      );
    }
    
    return null;
  };

  if (loading && assets.length === 0) {
    return (
      <div className={`bg-white rounded-lg border p-6 ${className}`}>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
        <p className="text-center mt-4 text-gray-500">Loading media assets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg border p-6 ${className}`}>
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className={`bg-white rounded-lg border p-6 ${className}`}>
        <p className="text-center text-gray-500">No media assets found.</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border ${className}`}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
        {assets.map(asset => (
          <div 
            key={asset.id}
            className={`
              relative overflow-hidden border rounded-lg
              ${selectionMode !== 'none' ? 'cursor-pointer hover:opacity-90' : ''}
              ${selectedIds.includes(asset.id) ? 'ring-2 ring-black' : ''}
            `}
            onClick={() => handleAssetClick(asset)}
          >
            {asset.mime_type.startsWith('image/') ? (
              <div className="aspect-w-1 aspect-h-1">
                <img 
                  src={getMediaUrl(asset.file_path)} 
                  alt={asset.alt_text || asset.title}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="aspect-w-1 aspect-h-1">
                {renderFileTypeIcon(asset)}
              </div>
            )}
            
            <div className="p-2 text-xs truncate bg-white border-t">
              {asset.title}
            </div>
            
            {selectedIds.includes(asset.id) && (
              <div className="absolute top-2 right-2 bg-black text-white rounded-full p-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      {totalCount > itemsPerPage && (
        <div className="border-t px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">{Math.min(page * itemsPerPage, totalCount)}</span> of{' '}
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
              disabled={page * itemsPerPage >= totalCount}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
