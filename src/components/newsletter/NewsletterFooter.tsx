// src/components/newsletter/NewsletterFooter.tsx
import React, { useState } from 'react';
import { subscribeToNewsletter } from '../../lib/api/newsletter';

export function NewsletterFooter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await subscribeToNewsletter({ email });
      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Failed to subscribe. Please try again.');
      console.error('Newsletter subscription error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-extrabold">Sign up for our newsletter</h2>
          <p className="mt-4 text-lg text-gray-300">
            Get fitness tips, workout plans, and exclusive deals delivered to your inbox.
          </p>
          
          {success ? (
            <div className="mt-6 bg-green-900 bg-opacity-50 text-green-200 p-4 rounded-md">
              <p className="font-medium">Thanks for subscribing!</p>
              <p className="text-sm mt-1">Check your inbox soon for updates.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 sm:flex justify-center">
              <div className="min-w-0 flex-1">
                <label htmlFor="email-footer" className="sr-only">Email address</label>
                <input
                  id="email-footer"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full px-4 py-3 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="block w-full px-4 py-3 rounded-md shadow bg-white text-gray-900 font-medium hover:bg-gray-100 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
            </form>
          )}
          
          {error && (
            <div className="mt-3 text-red-300 text-sm">
              {error}
            </div>
          )}
          
          <p className="mt-4 text-sm text-gray-400">
            By subscribing, you agree to our Privacy Policy and consent to receive marketing communications.
          </p>
        </div>
      </div>
    </div>
  );
}
