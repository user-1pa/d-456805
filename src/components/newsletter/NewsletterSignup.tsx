// src/components/newsletter/NewsletterSignup.tsx
import React, { useState } from 'react';
import { subscribeToNewsletter } from '../../lib/api/newsletter';

interface NewsletterSignupProps {
  variant?: 'simple' | 'detailed';
  onSuccess?: (isNewSubscription: boolean) => void;
  className?: string;
}

export function NewsletterSignup({ 
  variant = 'simple', 
  onSuccess,
  className = ''
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [preferences, setPreferences] = useState({
    promotions: true,
    product_updates: true,
    blog_posts: false,
    workouts: false
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const result = await subscribeToNewsletter({
        email,
        ...(variant === 'detailed' ? {
          first_name: firstName,
          last_name: lastName,
          preferences
        } : {})
      });
      
      setSuccess(true);
      setEmail('');
      setFirstName('');
      setLastName('');
      
      if (onSuccess) {
        onSuccess(result.isNewSubscription);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to subscribe. Please try again.');
      console.error('Newsletter subscription error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  if (variant === 'simple') {
    return (
      <div className={`bg-gray-100 p-6 rounded-lg ${className}`}>
        <h3 className="text-xl font-bold mb-2">Subscribe to Our Newsletter</h3>
        <p className="text-gray-600 mb-4">
          Stay updated with the latest fitness tips, product news, and exclusive offers.
        </p>
        
        {success ? (
          <div className="bg-green-50 text-green-800 p-4 rounded-md mb-4">
            Thanks for subscribing! Check your inbox soon for updates.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
            
            <p className="text-xs text-gray-500 mt-2">
              By subscribing, you agree to our Privacy Policy and consent to receive marketing emails.
            </p>
          </form>
        )}
      </div>
    );
  }
  
  // Detailed variant with name fields and preferences
  return (
    <div className={`bg-gray-100 p-6 rounded-lg ${className}`}>
      <h3 className="text-xl font-bold mb-2">Join Our Fitness Community</h3>
      <p className="text-gray-600 mb-4">
        Subscribe to receive personalized fitness content, training plans, and exclusive offers.
      </p>
      
      {success ? (
        <div className="bg-green-50 text-green-800 p-4 rounded-md mb-4">
          Thanks for joining our community! Check your inbox soon for updates tailored to your preferences.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address*
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">
              I'm interested in receiving:
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="promotions"
                  name="promotions"
                  type="checkbox"
                  checked={preferences.promotions}
                  onChange={handlePreferenceChange}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="promotions" className="ml-2 block text-sm text-gray-700">
                  Promotions and Special Offers
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="product_updates"
                  name="product_updates"
                  type="checkbox"
                  checked={preferences.product_updates}
                  onChange={handlePreferenceChange}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="product_updates" className="ml-2 block text-sm text-gray-700">
                  New Product Announcements
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="blog_posts"
                  name="blog_posts"
                  type="checkbox"
                  checked={preferences.blog_posts}
                  onChange={handlePreferenceChange}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="blog_posts" className="ml-2 block text-sm text-gray-700">
                  Blog Posts and Articles
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="workouts"
                  name="workouts"
                  type="checkbox"
                  checked={preferences.workouts}
                  onChange={handlePreferenceChange}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="workouts" className="ml-2 block text-sm text-gray-700">
                  Workout Plans and Fitness Tips
                </label>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Subscribing...' : 'Subscribe Now'}
          </button>
          
          <p className="text-xs text-gray-500 mt-2">
            By subscribing, you agree to our Privacy Policy and consent to receive marketing emails.
            You can unsubscribe at any time.
          </p>
        </form>
      )}
    </div>
  );
}
