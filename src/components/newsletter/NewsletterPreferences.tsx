// src/components/newsletter/NewsletterPreferences.tsx
import React, { useEffect, useState } from 'react';
import { 
  getNewsletterStatus, 
  updateNewsletterPreferences, 
  unsubscribeFromNewsletter 
} from '../../lib/api/newsletter';
import { useAuth } from '../../contexts/AuthContext';

interface NewsletterPreferencesProps {
  onUpdate?: () => void;
  className?: string;
}

export function NewsletterPreferences({ onUpdate, className = '' }: NewsletterPreferencesProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [preferences, setPreferences] = useState({
    promotions: false,
    product_updates: false,
    blog_posts: false,
    workouts: false
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchSubscriptionStatus() {
      if (!user?.email) return;
      
      try {
        const data = await getNewsletterStatus(user.email);
        setSubscription(data);
        
        if (data && data.preferences) {
          setPreferences({
            promotions: data.preferences.promotions || false,
            product_updates: data.preferences.product_updates || false,
            blog_posts: data.preferences.blog_posts || false,
            workouts: data.preferences.workouts || false
          });
        }
      } catch (err: any) {
        console.error('Error fetching newsletter status:', err);
        setError('Unable to load your newsletter preferences');
      } finally {
        setLoading(false);
      }
    }
    
    fetchSubscriptionStatus();
  }, [user]);
  
  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleSavePreferences = async () => {
    if (!user?.email) return;
    
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      await updateNewsletterPreferences(user.email, preferences);
      setSuccessMessage('Your newsletter preferences have been updated');
      if (onUpdate) onUpdate();
    } catch (err: any) {
      console.error('Error updating preferences:', err);
      setError('Failed to update preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const handleUnsubscribe = async () => {
    if (!user?.email || !confirm('Are you sure you want to unsubscribe from all newsletters?')) {
      return;
    }
    
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      await unsubscribeFromNewsletter(user.email);
      setSubscription(prev => ({ ...prev, is_active: false }));
      setSuccessMessage('You have been unsubscribed from all newsletters');
      if (onUpdate) onUpdate();
    } catch (err: any) {
      console.error('Error unsubscribing:', err);
      setError('Failed to unsubscribe. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className={`bg-white p-6 rounded-lg shadow-sm ${className}`}>
        <h3 className="text-xl font-bold mb-4">Newsletter Preferences</h3>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }
  
  if (!subscription) {
    return (
      <div className={`bg-white p-6 rounded-lg shadow-sm ${className}`}>
        <h3 className="text-xl font-bold mb-4">Newsletter Preferences</h3>
        <p className="text-gray-600 mb-4">
          You are not currently subscribed to our newsletter.
        </p>
      </div>
    );
  }
  
  if (!subscription.is_active) {
    return (
      <div className={`bg-white p-6 rounded-lg shadow-sm ${className}`}>
        <h3 className="text-xl font-bold mb-4">Newsletter Preferences</h3>
        <p className="text-gray-600 mb-4">
          You have unsubscribed from our newsletter. 
          Would you like to resubscribe to receive updates?
        </p>
        <button
          onClick={handleSavePreferences}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          Resubscribe
        </button>
      </div>
    );
  }
  
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm ${className}`}>
      <h3 className="text-xl font-bold mb-4">Newsletter Preferences</h3>
      
      {successMessage && (
        <div className="bg-green-50 text-green-800 p-4 rounded-md mb-4">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Choose which types of emails you'd like to receive from 4ortune Fitness:
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              id="promotions"
              name="promotions"
              type="checkbox"
              checked={preferences.promotions}
              onChange={handlePreferenceChange}
              className="h-5 w-5 text-black focus:ring-black border-gray-300 rounded"
            />
            <div className="ml-3">
              <label htmlFor="promotions" className="font-medium text-gray-800">
                Promotions and Special Offers
              </label>
              <p className="text-sm text-gray-500">
                Exclusive deals, discounts, and limited-time offers
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              id="product_updates"
              name="product_updates"
              type="checkbox"
              checked={preferences.product_updates}
              onChange={handlePreferenceChange}
              className="h-5 w-5 text-black focus:ring-black border-gray-300 rounded"
            />
            <div className="ml-3">
              <label htmlFor="product_updates" className="font-medium text-gray-800">
                New Product Announcements
              </label>
              <p className="text-sm text-gray-500">
                Stay updated on our latest fitness gear and apparel
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              id="blog_posts"
              name="blog_posts"
              type="checkbox"
              checked={preferences.blog_posts}
              onChange={handlePreferenceChange}
              className="h-5 w-5 text-black focus:ring-black border-gray-300 rounded"
            />
            <div className="ml-3">
              <label htmlFor="blog_posts" className="font-medium text-gray-800">
                Blog Posts and Articles
              </label>
              <p className="text-sm text-gray-500">
                Health tips, fitness research, and wellness insights
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              id="workouts"
              name="workouts"
              type="checkbox"
              checked={preferences.workouts}
              onChange={handlePreferenceChange}
              className="h-5 w-5 text-black focus:ring-black border-gray-300 rounded"
            />
            <div className="ml-3">
              <label htmlFor="workouts" className="font-medium text-gray-800">
                Workout Plans and Fitness Tips
              </label>
              <p className="text-sm text-gray-500">
                Training programs, exercise tutorials, and fitness challenges
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:justify-between space-y-3 sm:space-y-0">
        <button
          onClick={handleSavePreferences}
          disabled={saving}
          className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
        
        <button
          onClick={handleUnsubscribe}
          disabled={saving}
          className="text-red-600 hover:text-red-800 underline text-sm py-2"
        >
          Unsubscribe from all newsletters
        </button>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Email subscription status: <span className="font-medium">Subscribed</span> since {
            new Date(subscription.subscribed_at).toLocaleDateString()
          }
        </p>
        <p className="text-xs text-gray-500 mt-1">
          You can update your preferences or unsubscribe at any time.
        </p>
      </div>
    </div>
  );
}
