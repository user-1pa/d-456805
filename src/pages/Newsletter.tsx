// src/pages/Newsletter.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { NewsletterSignup } from '../components/newsletter/NewsletterSignup';
import { NewsletterPreferences } from '../components/newsletter/NewsletterPreferences';

export default function Newsletter() {
  const { user } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">4ortune Fitness Newsletter</h1>
          <p className="text-xl text-gray-600">
            Stay fit, stay informed. Get expert fitness advice, workout plans, and exclusive offers.
          </p>
        </div>
        
        {showSuccess && !user && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
                              <div className="ml-3">
                  <p className="text-sm font-medium">
                    Thank you for subscribing to our newsletter!
                  </p>
                  <p className="text-sm mt-1">
                    Check your inbox soon for fitness tips, exclusive offers, and more.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {user ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-8">
              <h2 className="text-2xl font-semibold mb-6">Manage Your Subscription</h2>
              <NewsletterPreferences />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-8">
              <h2 className="text-2xl font-semibold mb-6">Join Our Newsletter</h2>
              <p className="text-gray-600 mb-6">
                Subscribe to receive the latest fitness trends, workout tips, nutrition advice, and exclusive product offers.
                Our newsletter is designed to help you achieve your fitness goals and stay motivated.
              </p>
              
              <NewsletterSignup 
                variant="detailed" 
                onSuccess={() => setShowSuccess(true)}
              />
            </div>
          </div>
        )}
        
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-4">What Our Subscribers Receive</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-medium text-lg mb-2">Weekly Workouts</h4>
              <p className="text-gray-600">
                Quick and effective workout routines you can do anywhere
              </p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h4 className="font-medium text-lg mb-2">Nutrition Tips</h4>
              <p className="text-gray-600">
                Healthy eating advice and simple nutritious recipes
              </p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-medium text-lg mb-2">Exclusive Offers</h4>
              <p className="text-gray-600">
                Special discounts and early access to new products
              </p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-medium text-lg mb-2">Motivation</h4>
              <p className="text-gray-600">
                Success stories and tips to stay committed to your goals
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>
            We respect your privacy. You can unsubscribe at any time.
            View our <a href="/privacy" className="underline">Privacy Policy</a> for more information.
          </p>
        </div>
      </div>
    </div>
  );
}
