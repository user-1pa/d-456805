// src/pages/ThankYou.tsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabaseClient } from '../lib/supabase';

interface OrderSummary {
  id: string;
  total_amount: number;
  created_at: string;
  shipping_address: any;
  items: Array<{
    product_name: string;
    quantity: number;
    price: number;
  }>;
}

export default function ThankYou() {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchOrder() {
      try {
        // Extract order ID from URL parameters
        const params = new URLSearchParams(location.search);
        const orderId = params.get('order_id');
        
        if (!orderId) {
          // If no order ID is provided, redirect to home page after a delay
          setTimeout(() => {
            navigate('/');
          }, 5000);
          return;
        }
        
        // Fetch order details from database
        const { data, error: fetchError } = await supabaseClient
          .from('orders')
          .select(`
            id,
            total_amount,
            created_at,
            shipping_address,
            order_items (
              product_name,
              quantity,
              price
            )
          `)
          .eq('id', orderId)
          .single();
          
        if (fetchError) {
          throw fetchError;
        }
        
        setOrderSummary({
          id: data.id,
          total_amount: data.total_amount,
          created_at: data.created_at,
          shipping_address: data.shipping_address,
          items: data.order_items
        });
      } catch (err: any) {
        console.error('Error fetching order:', err);
        setError('Unable to load order details.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchOrder();
  }, [location, navigate]);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-extrabold text-gray-900">Thank you for your order!</h1>
        {orderSummary ? (
          <p className="mt-2 text-xl text-gray-600">
            Order #{orderSummary.id}
          </p>
        ) : !loading && (
          <p className="mt-2 text-xl text-gray-600">
            Your order has been confirmed
          </p>
        )}
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading your order details...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-center mb-8">
          <p>{error}</p>
          <p className="mt-2">
            If you have any questions about your order, please contact our customer support.
          </p>
        </div>
      ) : orderSummary ? (
        <>
          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border mb-8">
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Order Details</h2>
            </div>
            
            <div className="px-6 py-4 border-b">
              <div className="flex justify-between text-sm">
                <div>
                  <p className="font-medium text-gray-900">Order date</p>
                  <p className="text-gray-600">{formatDate(orderSummary.created_at)}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Order number</p>
                  <p className="text-gray-600">{orderSummary.id}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Total amount</p>
                  <p className="text-gray-600">{formatCurrency(orderSummary.total_amount)}</p>
                </div>
              </div>
            </div>
            
            <div className="divide-y">
              {orderSummary.items.map((item, index) => (
                <div key={index} className="px-6 py-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{item.product_name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 px-6 py-4">
              <div className="flex justify-between font-medium">
                <p className="text-gray-900">Total</p>
                <p className="text-gray-900">{formatCurrency(orderSummary.total_amount)}</p>
              </div>
            </div>
          </div>
          
          {/* Shipping Information */}
          {orderSummary.shipping_address && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border mb-8">
              <div className="border-b px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
              </div>
              
              <div className="px-6 py-4">
                <p className="font-medium text-gray-900">{orderSummary.shipping_address.fullName}</p>
                <p className="text-gray-600">{orderSummary.shipping_address.address}</p>
                <p className="text-gray-600">
                  {orderSummary.shipping_address.city}, {orderSummary.shipping_address.state} {orderSummary.shipping_address.postalCode}
                </p>
                <p className="text-gray-600">{orderSummary.shipping_address.country}</p>
                {orderSummary.shipping_address.phone && (
                  <p className="text-gray-600 mt-2">{orderSummary.shipping_address.phone}</p>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border mb-8 p-6 text-center">
          <p className="text-gray-600">
            We've sent a confirmation email with your order details.
          </p>
        </div>
      )}
      
      {/* What's Next Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border mb-8">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">What's Next?</h2>
        </div>
        
        <div className="px-6 py-4">
          <div className="space-y-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-black text-white">
                  1
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-md font-medium text-gray-900">Order Confirmation</h3>
                <p className="text-sm text-gray-600">
                  You will receive an email confirmation with your order details.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-black text-white">
                  2
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-md font-medium text-gray-900">Order Processing</h3>
                <p className="text-sm text-gray-600">
                  We're preparing your order for shipment. This typically takes 1-2 business days.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-black text-white">
                  3
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-md font-medium text-gray-900">Shipping</h3>
                <p className="text-sm text-gray-600">
                  Once your order ships, you'll receive tracking information via email.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-black text-white">
                  4
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-md font-medium text-gray-900">Delivery</h3>
                <p className="text-sm text-gray-600">
                  Your package will arrive within the estimated delivery timeframe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800"
        >
          Continue Shopping
        </Link>
        
        <Link
          to="/account/orders"
          className="inline-block px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
        >
          View Order History
        </Link>
      </div>
    </div>
  );
}
