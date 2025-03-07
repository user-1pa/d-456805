// src/pages/PaymentDeclined.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface DeclinedReason {
  code: string;
  title: string;
  description: string;
  solution: string;
}

export default function PaymentDeclined() {
  const navigate = useNavigate();
  const location = useLocation();
  const [declineReason, setDeclineReason] = useState<DeclinedReason | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  // Extract error code and order ID from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const id = params.get('order');
    
    if (id) {
      setOrderId(id);
    }
    
    if (code) {
      const reason = getDeclineReasonByCode(code);
      setDeclineReason(reason);
    } else {
      // Default to generic decline reason if no code provided
      setDeclineReason(getDeclineReasonByCode('generic'));
    }
  }, [location]);
  
  // Sample decline reasons - in a real app, this would likely come from an API
  const getDeclineReasonByCode = (code: string): DeclinedReason => {
    const reasons: Record<string, DeclinedReason> = {
      'generic': {
        code: 'generic',
        title: 'Payment Declined',
        description: 'Your payment could not be processed at this time.',
        solution: 'Please try again with the same card or use a different payment method.'
      },
      'insufficient_funds': {
        code: 'insufficient_funds',
        title: 'Insufficient Funds',
        description: 'Your card was declined due to insufficient funds.',
        solution: 'Please try using a different card or contact your bank to resolve the issue.'
      },
      'card_declined': {
        code: 'card_declined',
        title: 'Card Declined',
        description: 'Your card was declined by your bank for an unspecified reason.',
        solution: 'Please contact your bank for more information or try a different payment method.'
      },
      'invalid_card': {
        code: 'invalid_card',
        title: 'Invalid Card Information',
        description: 'The card information you provided is invalid or expired.',
        solution: 'Please check your card details and try again, or use a different payment method.'
      },
      'processing_error': {
        code: 'processing_error',
        title: 'Processing Error',
        description: 'We encountered an error while processing your payment.',
        solution: 'This is a temporary issue. Please wait a few minutes and try again.'
      },
      'authentication_required': {
        code: 'authentication_required',
        title: 'Authentication Required',
        description: 'Your bank requires additional authentication for this transaction.',
        solution: 'Please try again and follow any authentication prompts from your bank.'
      }
    };
    
    return reasons[code] || reasons.generic;
  };
  
  const handleRetry = () => {
    // Redirect back to the checkout page, preserving cart contents
    if (orderId) {
      navigate(`/checkout?retry=${orderId}`);
    } else {
      navigate('/checkout');
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-red-50 p-6 sm:p-10 border-b border-red-100">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {declineReason?.title || 'Payment Declined'}
              </h1>
              <p className="mt-1 text-lg text-gray-600">
                Order #{orderId || 'Not Completed'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6 sm:p-10">
          <h2 className="text-lg font-medium text-gray-900 mb-6">What happened?</h2>
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-8">
            <p className="text-gray-800">
              {declineReason?.description}
            </p>
            <p className="mt-4 text-gray-800 font-medium">
              {declineReason?.solution}
            </p>
          </div>
          
          <h2 className="text-lg font-medium text-gray-900 mb-4">Common reasons for declined payments:</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-8">
            <li>Insufficient funds in your account</li>
            <li>Incorrect card details entered</li>
            <li>Expired card</li>
            <li>Unusual activity detected by your bank</li>
            <li>Transaction limits exceeded</li>
            <li>International transaction restrictions</li>
          </ul>
          
          <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleRetry}
              className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800"
            >
              Try Again
            </button>
            
            <Link
              to="/cart"
              className="w-full sm:w-auto block text-center bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-50"
            >
              Return to Cart
            </Link>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 sm:p-10 border-t border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Need help?</h2>
          <p className="text-gray-600 mb-4">
            If you continue to experience issues with your payment, our customer support team is here to help.
          </p>
          <div className="space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
            <Link
              to="/support"
              className="w-full sm:w-auto block text-center bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-50"
            >
              Visit Support
            </Link>
            
            <Link
              to="/contact"
              className="w-full sm:w-auto block text-center bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-50"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
