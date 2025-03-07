// src/pages/Error500.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Error500() {
  // Function to reload the page
  const handleRefresh = () => {
    window.location.reload();
  };
  
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <svg 
            className="h-24 w-24 text-gray-400 mx-auto" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1.5" 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          Something went wrong
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          We're experiencing some technical difficulties. Please try again later.
        </p>
        
        <div className="mt-10 space-y-4">
          <button
            onClick={handleRefresh}
            className="inline-block bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800"
          >
            Refresh the page
          </button>
          
          <div className="block mt-4">
            <Link
              to="/"
              className="inline-block text-black font-medium hover:underline"
            >
              Return to home
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 text-gray-600">
            <p>If the problem persists, please contact our support team.</p>
            <Link
              to="/contact"
              className="inline-block mt-2 text-black font-medium hover:underline"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
