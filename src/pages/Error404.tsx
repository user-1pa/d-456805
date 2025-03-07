// src/pages/Error404.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Error404() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <img
          src="/images/404-illustration.svg"
          alt="Page not found"
          className="h-64 w-auto mx-auto mb-8"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            // Fallback if custom image isn't available
            target.src = 'https://via.placeholder.com/400x300?text=404';
          }}
        />
        
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Sorry, we couldn't find the page you're looking for.
        </p>
        
        <div className="mt-10 space-y-4">
          <Link
            to="/"
            className="inline-block bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800"
          >
            Return to home
          </Link>
          
          <div className="mt-6 text-center text-gray-600">
            <p>Looking for something specific?</p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <Link to="/shop" className="text-black font-medium hover:underline">
                Shop Products
              </Link>
              <Link to="/faq" className="text-black font-medium hover:underline">
                FAQ
              </Link>
              <Link to="/contact" className="text-black font-medium hover:underline">
                Contact Us
              </Link>
              <Link to="/support" className="text-black font-medium hover:underline">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
