// src/pages/Contact.tsx
import React, { useState } from 'react';
import { supabaseClient } from '../lib/supabase';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  orderNumber: string;
}

export default function Contact() {
  const [formState, setFormState] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    orderNumber: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formState.email || !formState.subject || !formState.message) {
      setError('Please fill out all required fields.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Submit to Supabase contact_submissions table
      const { error: submissionError } = await supabaseClient
        .from('contact_submissions')
        .insert([
          {
            first_name: formState.firstName,
            last_name: formState.lastName,
            email: formState.email,
            phone: formState.phone,
            subject: formState.subject,
            message: formState.message,
            order_number: formState.orderNumber || null,
            status: 'new'
          }
        ]);
        
      if (submissionError) throw submissionError;
      
      // Send notification to admin (optional - could be handled by a database trigger)
      // Here we're using a Supabase Edge Function, but this could also be replaced by a direct email API call
      await supabaseClient.functions.invoke('send-contact-notification', {
        body: {
          subject: `New Contact Form Submission: ${formState.subject}`,
          email: formState.email,
          name: `${formState.firstName} ${formState.lastName}`
        }
      });
      
      // Reset form and show success message
      setFormState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        orderNumber: '',
      });
      
      setSuccess(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
      
    } catch (err: any) {
      console.error('Error submitting contact form:', err);
      setError('There was a problem submitting your request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="md:col-span-1">
          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Reach Us</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Customer Support</h3>
                <p className="text-gray-600">
                  Our team is available Monday through Friday, 9am-5pm ET.
                </p>
                <p className="mt-2">
                  <a href="mailto:support@4ortunefitness.com" className="text-black font-medium hover:underline">
                    support@4ortunefitness.com
                  </a>
                </p>
                <p className="mt-1">
                  <a href="tel:+18005551234" className="text-black font-medium hover:underline">
                    (800) 555-1234
                  </a>
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Headquarters</h3>
                <address className="text-gray-600 not-italic">
                  4ortune Fitness, Inc.<br />
                  123 Fitness Street<br />
                  Workout City, WO 12345<br />
                  United States
                </address>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Connect With Us</h3>
                <div className="flex space-x-4 mt-2">
                  <a href="https://instagram.com/4ortunefitness" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>
                  <a href="https://facebook.com/4ortunefitness" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a href="https://twitter.com/4ortunefitness" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="https://youtube.com/4ortunefitness" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Need Immediate Help?</h3>
              <a
                href="/chat"
                className="flex items-center justify-center gap-2 w-full bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Chat with Our Fitness Assistant
              </a>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Available 24/7 for quick questions and fitness advice
              </p>
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Send Us a Message</h2>
            
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4">
                <p className="font-medium">Thank you for contacting us!</p>
                <p>We've received your message and will get back to you as soon as possible.</p>
              </div>
            )}
            
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formState.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formState.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formState.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formState.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                >
                  <option value="">Select a subject</option>
                  <option value="Order Inquiry">Order Inquiry</option>
                  <option value="Product Question">Product Question</option>
                  <option value="Return Request">Return Request</option>
                  <option value="Shipping Information">Shipping Information</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Order Number (if applicable)
                </label>
                <input
                  type="text"
                  id="orderNumber"
                  name="orderNumber"
                  value={formState.orderNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="e.g. ORD12345678"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="Please provide as much detail as possible..."
                ></textarea>
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                * Required fields. By submitting this form, you agree to our <a href="/privacy" className="underline">Privacy Policy</a>.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
