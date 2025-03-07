// src/components/media/MediaUploader.tsx
import React, { useState, useRef } from 'react';
import { uploadMediaAsset, getMediaCategories, getMediaTags, MediaCategory, MediaTag } from '../../lib/api/media';

interface MediaUploaderProps {
  onUploadComplete?: (asset: any) => void;
  className?: string;
}

export function MediaUploader({ onUploadComplete, className = '' }: MediaUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [altText, setAltText] = useState('');
  const [categories, setCategories] = useState<MediaCategory[]>([]);
  const [tags, setTags] = useState<MediaTag[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loadingMetadata, setLoadingMetadata] = useState(true);

  // Load categories and tags on component mount
  React.useEffect(() => {
    async function loadMetadata() {
      try {
        setLoadingMetadata(true);
        const [categoriesData, tagsData] = await Promise.all([
          getMediaCategories(),
          getMediaTags()
        ]);
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (err: any) {
        console.error("Error loading media metadata:", err);
        setError("Failed to load categories and tags");
      } finally {
        setLoadingMetadata(false);
      }
    }
    
    loadMetadata();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Generate preview for image files
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
      
      // Set default title from filename
      if (!title) {
        const fileName = selectedFile.name.split('.').slice(0, -1).join('.');
        setTitle(fileName.replace(/[_-]/g, ' '));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    if (!title.trim()) {
      setError('Please provide a title');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const asset = await uploadMediaAsset(file, {
        title,
        description: description || undefined,
        alt_text: altText || undefined,
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined
      });
      
      setSuccess(true);
      
      // Reset form
      setFile(null);
      setPreview(null);
      setTitle('');
      setDescription('');
      setAltText('');
      setSelectedCategories([]);
      setSelectedTags([]);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      if (onUploadComplete) {
        onUploadComplete(asset);
      }
    } catch (err: any) {
      console.error("Error uploading file:", err);
      setError(err.message || "Failed to upload file");
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      
      // Generate preview for image files
      if (droppedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(droppedFile);
      } else {
        setPreview(null);
      }
      
      // Set default title from filename
      if (!title) {
        const fileName = droppedFile.name.split('.').slice(0, -1).join('.');
        setTitle(fileName.replace(/[_-]/g, ' '));
      }
    }
  };

  const renderFileTypeIcon = () => {
    if (!file) return null;
    
    if (file.type === 'application/pdf') {
      return (
        <div className="text-red-500 text-4xl flex items-center justify-center h-full">
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        </div>
      );
    } else if (file.type.startsWith('video/')) {
      return (
        <div className="text-blue-500 text-4xl flex items-center justify-center h-full">
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
        </div>
      );
    } else if (file.type.startsWith('audio/')) {
      return (
        <div className="text-purple-500 text-4xl flex items-center justify-center h-full">
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
          </svg>
        </div>
      );
    } else if (!file.type.startsWith('image/')) {
      return (
        <div className="text-gray-500 text-4xl flex items-center justify-center h-full">
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className={`bg-white rounded-lg border p-6 ${className}`}>
      <h2 className="text-xl font-semibold mb-4">Upload Media</h2>
      
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4">
          <p>File uploaded successfully!</p>
        </div>
      )}
      
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* File Drop Zone */}
        <div 
          className="mb-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,video/*,audio/*,application/pdf,text/plain"
          />
          
          {file ? (
            <div>
              {preview ? (
                <div className="mb-4 max-h-48 flex justify-center">
                  <img src={preview} alt="Preview" className="max-h-full object-contain" />
                </div>
              ) : (
                <div className="mb-4 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  {renderFileTypeIcon()}
                </div>
              )}
              <p className="text-sm text-gray-600 mb-2">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          ) : (
            <div>
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H4a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L20 20m8 8l-4-4-4 4-4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="mt-1 text-sm text-gray-600">
                Drag and drop a file here, or click to select a file
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Supports images, videos, audio, PDFs, and text files
              </p>
            </div>
          )}
        </div>
        
        {/* File Metadata */}
        <div className="space-y-4">
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
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
            />
          </div>
          
          <div>
            <label htmlFor="altText" className="block text-sm font-medium text-gray-700 mb-1">
              Alt Text
            </label>
            <input
              type="text"
              id="altText"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
            />
            <p className="mt-1 text-xs text-gray-500">
              Describe the image for accessibility purposes
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categories
            </label>
            {loadingMetadata ? (
              <p className="text-sm text-gray-500">Loading categories...</p>
            ) : categories.length === 0 ? (
              <p className="text-sm text-gray-500">No categories available</p>
            ) : (
              <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                {categories.map(category => (
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
                ))}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            {loadingMetadata ? (
              <p className="text-sm text-gray-500">Loading tags...</p>
            ) : tags.length === 0 ? (
              <p className="text-sm text-gray-500">No tags available</p>
            ) : (
              <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                {tags.map(tag => (
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
                ))}
              </div>
            )}
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || !file}
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
