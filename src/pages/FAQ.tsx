// src/pages/FAQ.tsx
import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
  category: string;
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const faqItems: FAQItem[] = [
    {
      question: "How do I track my order?",
      answer: (
        <p>
          After your order ships, you'll receive a tracking number via email. 
          You can also view your order status by logging into your account and 
          going to the "Order History" section. There, you'll find detailed 
          information about your orders, including tracking information.
        </p>
      ),
      category: "orders",
    },
    {
      question: "What is your return policy?",
      answer: (
        <div>
          <p>
            We offer a 30-day return policy for most items. To be eligible for a return:
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>Items must be unused and in their original packaging</li>
            <li>You must have the receipt or proof of purchase</li>
            <li>Items on sale or marked as final sale cannot be returned</li>
          </ul>
          <p className="mt-2">
            To initiate a return, please contact our customer service team or visit the 
            "Returns" section in your account.
          </p>
        </div>
      ),
      category: "orders",
    },
    {
      question: "Do you ship internationally?",
      answer: (
        <p>
          Yes, we ship to most countries worldwide. International shipping rates and 
          delivery times vary depending on the destination. Additional customs fees, 
          import duties, or taxes may apply and are the responsibility of the customer.
        </p>
      ),
      category: "shipping",
    },
    {
      question: "How long does shipping take?",
      answer: (
        <div>
          <p>Shipping times depend on your location:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Domestic (US): 3-5 business days</li>
            <li>Canada: 5-7 business days</li>
            <li>Europe: 7-10 business days</li>
            <li>Australia/New Zealand: 10-14 business days</li>
            <li>Rest of the world: 14-21 business days</li>
          </ul>
          <p className="mt-2">
            Expedited shipping options are available at checkout for most locations.
          </p>
        </div>
      ),
      category: "shipping",
    },
    {
      question: "How do I choose the right size for fitness apparel?",
      answer: (
        <div>
          <p>
            We provide detailed size guides for all our apparel. To find the perfect fit:
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>Check the size chart on each product page</li>
            <li>Take your measurements following our measurement guide</li>
            <li>Compare your measurements to our size charts</li>
          </ul>
          <p className="mt-2">
            If you're between sizes, we generally recommend sizing up for a more comfortable fit.
          </p>
        </div>
      ),
      category: "products",
    },
    {
      question: "Are your products suitable for beginners?",
      answer: (
        <p>
          Absolutely! We design our products with all fitness levels in mind. 
          For beginners, we recommend starting with our entry-level equipment and 
          apparel marked with "Beginner Friendly" tags. These items are specifically 
          designed to be approachable and easy to use for those new to fitness.
        </p>
      ),
      category: "products",
    },
    {
      question: "How do I clean and maintain my fitness equipment?",
      answer: (
        <div>
          <p>
            Proper maintenance extends the life of your fitness equipment:
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>Wipe down equipment after each use with a damp cloth</li>
            <li>For apparel, follow the care instructions on the label</li>
            <li>Regularly check for and tighten any loose parts</li>
            <li>Store equipment in a dry place away from direct sunlight</li>
          </ul>
          <p className="mt-2">
            For detailed care instructions for specific products, please refer to the 
            product manual or contact our customer service team.
          </p>
        </div>
      ),
      category: "products",
    },
    {
      question: "How do I create an account?",
      answer: (
        <p>
          Creating an account is simple! Click on the "Sign Up" button in the top 
          right corner of our website. You can register using your email address 
          or sign up with your Google account for faster access. Once registered, 
          you'll have access to order tracking, wishlists, and personalized recommendations.
        </p>
      ),
      category: "account",
    },
    {
      question: "How can I reset my password?",
      answer: (
        <p>
          If you've forgotten your password, click on the "Login" button, then select 
          "Forgot Password." Enter the email address associated with your account, 
          and we'll send you a link to reset your password. For security reasons, 
          the link expires after 24 hours.
        </p>
      ),
      category: "account",
    },
    {
      question: "Do you offer discounts for regular customers?",
      answer: (
        <div>
          <p>
            Yes, we value our loyal customers and offer several ways to save:
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>Loyalty points program: earn points with every purchase</li>
            <li>Subscribe to our newsletter for exclusive discounts</li>
            <li>Seasonal sales and special promotions</li>
            <li>Referral bonuses when your friends make their first purchase</li>
          </ul>
          <p className="mt-2">
            Join our rewards program in your account settings to start earning benefits.
          </p>
        </div>
      ),
      category: "payments",
    },
    {
      question: "What payment methods do you accept?",
      answer: (
        <div>
          <p>We accept a variety of payment methods:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Credit/debit cards (Visa, Mastercard, American Express, Discover)</li>
            <li>PayPal</li>
            <li>Apple Pay</li>
            <li>Google Pay</li>
            <li>Shop Pay</li>
          </ul>
          <p className="mt-2">
            All payments are securely processed and your information is never stored on our servers.
          </p>
        </div>
      ),
      category: "payments",
    },
    {
      question: "Do you offer workout plans?",
      answer: (
        <p>
          Yes, we offer personalized workout plans designed by certified fitness 
          professionals. You can find our workout plans in the "Training" section 
          of our website. We offer plans for different fitness levels, goals, and 
          available equipment. Some basic plans are free, while premium plans are 
          available for purchase.
        </p>
      ),
      category: "training",
    },
    {
      question: "How can I chat with a fitness expert?",
      answer: (
        <p>
          You can chat with our fitness experts through the chat widget available 
          on our website. Our AI-powered fitness assistant can answer most common 
          questions immediately. For more personalized advice, you can schedule a 
          virtual consultation with one of our certified fitness trainers through 
          your account dashboard.
        </p>
      ),
      category: "training",
    },
  ];

  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'orders', name: 'Orders & Returns' },
    { id: 'shipping', name: 'Shipping' },
    { id: 'products', name: 'Products' },
    { id: 'account', name: 'Account' },
    { id: 'payments', name: 'Payments & Discounts' },
    { id: 'training', name: 'Training & Support' },
  ];

  const toggleItem = (index: number) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(index)) {
      newExpandedItems.delete(index);
    } else {
      newExpandedItems.add(index);
    }
    setExpandedItems(newExpandedItems);
  };

  const filteredFAQs = activeCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>
      
      {/* Category Tabs */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* FAQ Accordion */}
      <div className="space-y-4">
        {filteredFAQs.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleItem(index)}
              className="flex justify-between items-center w-full px-6 py-4 text-left font-medium text-gray-900 focus:outline-none"
            >
              <span>{item.question}</span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  expandedItems.has(index) ? 'transform rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className={`px-6 py-4 bg-gray-50 text-gray-700 ${
                expandedItems.has(index) ? 'block' : 'hidden'
              }`}
            >
              {item.answer}
            </div>
          </div>
        ))}
        
        {filteredFAQs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No FAQs found in this category.
          </div>
        )}
      </div>
      
      {/* Still have questions */}
      <div className="mt-12 bg-gray-100 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Still have questions?</h2>
        <p className="text-gray-600 mb-6">
          Our customer service team is here to help you with any questions you may have.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/contact"
            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800"
          >
            Contact Us
          </a>
          <a
            href="/chat"
            className="bg-white text-black border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50"
          >
            Chat with Fitness Assistant
          </a>
        </div>
