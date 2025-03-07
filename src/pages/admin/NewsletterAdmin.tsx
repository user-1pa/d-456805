// src/pages/admin/NewsletterAdmin.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabaseClient } from '../../lib/supabase';

// Types
interface NewsletterTemplate {
  id: string;
  name: string;
  preview_text: string;
  main_heading: string;
  hero_image_url: string;
  content_blocks: any[];
  created_at: string;
  updated_at: string;
}

interface Campaign {
  id: string;
  template_id: string;
  subject: string;
  target_segment: any;
  sent_count: number;
  status: string;
  sent_at: string;
}

interface SubscriberStats {
  total: number;
  active: number;
  inactive: number;
  preferences: {
    promotions: number;
    product_updates: number;
    blog_posts: number;
    workouts: number;
  }
}

export default function NewsletterAdmin() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<NewsletterTemplate[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<SubscriberStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Selected template for sending
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [targetSegment, setTargetSegment] = useState({
    preferences: {
      promotions: false,
      product_updates: false,
      blog_posts: false,
      workouts: false
    }
  });
  
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<any>(null);
  
  useEffect(() => {
    // Check if user is admin
    async function checkAdminAccess() {
      if (!user) return;
      
      try {
        const { data, error } = await supabaseClient
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();
          
        if (error || !data || data.role !== 'admin') {
          setError('You do not have permission to access this page');
          setLoading(false);
          return;
        }
        
        // If user is admin, fetch newsletter data
        await fetchNewsletterData();
      } catch (err) {
        console.error('Error checking admin access:', err);
        setError('Failed to verify access permissions');
        setLoading(false);
      }
    }
    
    async function fetchNewsletterData() {
      try {
        // Fetch templates
        const { data: templateData, error: templateError } = await supabaseClient
          .from('newsletter_templates')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (templateError) throw templateError;
        setTemplates(templateData || []);
        
        // Fetch campaigns
        const { data: campaignData, error: campaignError } = await supabaseClient
          .from('newsletter_campaigns')
          .select('*')
          .order('sent_at', { ascending: false })
          .limit(10);
          
        if (campaignError) throw campaignError;
        setCampaigns(campaignData || []);
        
        // Fetch subscriber stats
        const { data: statsData, error: statsError } = await supabaseClient
          .rpc('get_newsletter_stats');
          
        if (statsError) throw statsError;
        setStats(statsData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching newsletter data:', err);
        setError('Failed to load newsletter data');
        setLoading(false);
      }
    }
    
    checkAdminAccess();
  }, [user]);
  
  const handleSegmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setTargetSegment(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: checked
      }
    }));
  };
  
  const handleSendNewsletter = async () => {
    if (!selectedTemplate || !subject) {
      setError('Please select a template and enter a subject');
      return;
    }
    
    setSending(true);
    setError(null);
    setSendResult(null);
    
    try {
      const response = await supabaseClient.functions.invoke('send-newsletter', {
        body: {
          newsletterId: selectedTemplate,
          subject,
          targetSegment
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to send newsletter');
      }
      
      setSendResult(response.data);
      
      // Refresh campaigns list
      const { data: campaignData, error: campaignError } = await supabaseClient
        .from('newsletter_campaigns')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(10);
        
      if (!campaignError) {
        setCampaigns(campaignData || []);
      }
    } catch (err: any) {
      console.error('Error sending newsletter:', err);
      setError(err.message || 'Failed to send newsletter');
    } finally {
      setSending(false);
    }
  };
  
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Newsletter Administration</h1>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }
  
  if (error && error.includes('permission')) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <h3 className="text-lg font-medium">Access Denied</h3>
          <p className="mt-2">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Newsletter Administration</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {sendResult && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium">Newsletter Sent Successfully</h3>
          <p className="mt-2">Sent to {sendResult.message}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-xl font-semibold">Send Newsletter</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Template
                  </label>
                  <select
                    id="template"
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                  >
                    <option value="">Select a template</option>
                    {templates.map(template => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter email subject line"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                  />
                </div>
                
                <div>
                  <p className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience (Content Preferences)
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <input
                        id="promotions"
                        name="promotions"
                        type="checkbox"
                        checked={targetSegment.preferences.promotions}
                        onChange={handleSegmentChange}
                        className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                      />
                      <label htmlFor="promotions" className="ml-2 block text-sm text-gray-700">
                        Promotions and Offers
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="product_updates"
                        name="product_updates"
                        type="checkbox"
                        checked={targetSegment.preferences.product_updates}
                        onChange={handleSegmentChange}
                        className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                      />
                      <label htmlFor="product_updates" className="ml-2 block text-sm text-gray-700">
                        Product Updates
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="blog_posts"
                        name="blog_posts"
                        type="checkbox"
                        checked={targetSegment.preferences.blog_posts}
                        onChange={handleSegmentChange}
                        className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                      />
                      <label htmlFor="blog_posts" className="ml-2 block text-sm text-gray-700">
                        Blog Posts
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="workouts"
                        name="workouts"
                        type="checkbox"
                        checked={targetSegment.preferences.workouts}
                        onChange={handleSegmentChange}
                        className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                      />
                      <label htmlFor="workouts" className="ml-2 block text-sm text-gray-700">
                        Workout Plans
                      </label>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Leave all unchecked to send to all active subscribers
                  </p>
                </div>
                
                <div className="pt-4">
                  <button
                    onClick={handleSendNewsletter}
                    disabled={sending || !selectedTemplate || !subject}
                    className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {sending ? 'Sending...' : 'Send Newsletter'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-xl font-semibold">Recent Campaigns</h2>
            </div>
            <div className="p-6">
              {campaigns.length === 0 ? (
                <p className="text-gray-500">No campaigns have been sent yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Recipients
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {campaigns.map(campaign => (
                        <tr key={campaign.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(campaign.sent_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {campaign.subject}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {campaign.sent_count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {campaign.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-xl font-semibold">Subscriber Stats</h2>
            </div>
            <div className="p-6">
              {!stats ? (
                <p className="text-gray-500">No subscriber data available.</p>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Total Subscribers</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Active Subscribers</p>
                      <p className="text-2xl font-bold">{stats.active}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Preference Breakdown</h3>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Promotions</span>
                          <span>{stats.preferences.promotions} subscribers</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-black h-2 rounded-full"
                            style={{ width: `${(stats.preferences.promotions / stats.active) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Product Updates</span>
                          <span>{stats.preferences.product_updates} subscribers</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-black h-2 rounded-full"
                            style={{ width: `${(stats.preferences.product_updates / stats.active) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Blog Posts</span>
                          <span>{stats.preferences.blog_posts} subscribers</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-black h-2 rounded-full"
                            style={{ width: `${(stats.preferences.blog_posts / stats.active) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Workout Plans</span>
                          <span>{stats.preferences.workouts} subscribers</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-black h-2 rounded-full"
                            style={{ width: `${(stats.preferences.workouts / stats.active) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-xl font-semibold">Templates</h2>
            </div>
            <div className="p-6">
              {templates.length === 0 ? (
                <p className="text-gray-500">No templates available.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {templates.map(template => (
                    <li key={template.id} className="py-3">
                      <div className="flex justify-between">
                        <p className="font-medium">{template.name}</p>
                        <button className="text-sm text-gray-500 hover:text-gray-700">
                          Edit
                        </button>
                      </div>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(template.created_at).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4 pt-4 border-t">
                <button className="text-sm font-medium text-black hover:text-gray-700">
                  + Create New Template
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
