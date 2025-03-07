// src/pages/Support.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface SupportTopicProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkTo: string;
}

const SupportTopic: React.FC<SupportTopicProps> = ({ title, description, icon, linkTo }) => (
  <Link
    to={linkTo}
    className="block bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow"
  >
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <div className="bg-black rounded-lg p-3 text-white">
          {icon}
        </div>
      </div>
      <div className="ml-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-1 text-gray-600">{description}</p>
      </div>
    </div>
  </Link>
);

export default function Support() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality or redirect to search results
    window.location.href = `/faq?search=${encodeURIComponent(searchQuery)}`;
  };
  
  // Common support topics
  const supportTopics = [
    {
      title: "Orders & Shipping",
      description: "Track your order, shipping information, and delivery times",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      linkTo: "/faq?category=orders"
    },
    {
      title: "Returns & Refunds",
      description: "Return policies, processing refunds, and exchanges",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
        </svg>
      ),
      linkTo: "/faq?category=returns"
    },
    {
      title: "Product Information",
      description: "Product specifications, usage guides, and compatibility",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      linkTo: "/faq?category=products"
    },
    {
      title: "Account Help",
      description: "Login issues, account management, and profile settings",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      linkTo: "/faq?category=account"
    },
    {
      title: "Payment Issues",
      description: "Payment methods, declined transactions, and billing inquiries",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      linkTo: "/payment-support"
    },
    {
      title: "Fitness Advice",
      description: "Workout guidance, exercise techniques, and training plans",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      linkTo: "/chat"
    }
  ];
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Customer Support</h1>
      
      {/* Search Bar */}
      <div className="bg-gray-100 rounded-lg p-6 mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">How can we help you?</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help with orders, returns, products, etc."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
          />
          <button
            type="submit"
            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800"
          >
            Search
          </button>
        </form>
      </div>
      
      {/* Support Topics */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Support Topics</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {supportTopics.map((topic, index) => (
            <SupportTopic key={index} {...topic} />
          ))}
        </div>
      </div>
      
      {/* Self-Service and Contact Options */}
      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Self-Service Options</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg className="h-5 w-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-900">
                  <Link to="/account/orders" className="hover:underline">Check order status</Link>
                </h3>
                <p className="text-gray-600">View and track your orders in your account</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg className="h-5 w-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-900">
                  <Link to="/account/returns" className="hover:underline">Start a return</Link>
                </h3>
                <p className="text-gray-600">Initiate a return or exchange for your order</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg className="h-5 w-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-900">
                  <Link to="/resources/assembly-guides" className="hover:underline">Product assembly guides</Link>
                </h3>
                <p className="text-gray-600">Step-by-step instructions for assembling products</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg className="h-5 w-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-900">
                  <Link to="/resources/size-guides" className="hover:underline">Size guides</Link>
                </h3>
                <p className="text-gray-600">Find the perfect fit for apparel and equipment</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg className="h-5 w-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-900">
                  <Link to="/faq" className="hover:underline">Browse all FAQs</Link>
                </h3>
                <p className="text-gray-600">Find answers to commonly asked questions</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Our Team</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Customer Support Team</h3>
              <p className="text-gray-600 mb-2">Available Monday-Friday, 9AM-6PM ET</p>
              <div className="flex items-center text-black font-medium">
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+18005551234" className="hover:underline">(800) 555-1234</a>
              </div>
              <div className="flex items-center mt-1 text-black font-medium">
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:support@4ortunefitness.com" className="hover:underline">support@4ortunefitness.com</a>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-900 mb-2">Other Ways to Connect</h3>
              <Link
                to="/contact"
                className="block mb-3 bg-black text-white px-4 py-2 rounded-md font-medium hover:bg-gray-800 text-center"
              >
                Contact Form
              </Link>
              
              <Link
                to="/chat"
                className="block bg-gray-100 text-black px-4 py-2 rounded-md font-medium hover:bg-gray-200 text-center"
              >
                Chat with Fitness Assistant
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
