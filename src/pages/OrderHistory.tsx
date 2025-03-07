// src/pages/OrderHistory.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getOrderHistory } from '../lib/api/stripe';
import { Link } from 'react-router-dom';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product_name: string;
  variant?: any;
}

interface Order {
  id: string;
  payment_intent_id: string;
  payment_status: string;
  total_amount: number;
  created_at: string;
  shipping_address: any;
  order_items: OrderItem[];
}

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchOrders() {
      try {
        const orderData = await getOrderHistory();
        setOrders(orderData);
      } catch (err: any) {
        setError('Failed to load your order history. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    if (user) {
      fetchOrders();
    }
  }, [user]);
  
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  if (orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-medium text-gray-600 mb-4">No orders yet</h2>
          <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
          <Link
            to="/shop"
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">
                  Order placed on {new Date(order.created_at).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-400">Order ID: {order.id}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${order.total_amount.toFixed(2)}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  order.payment_status === 'succeeded' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.payment_status === 'succeeded' ? 'Paid' : 'Processing'}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium mb-2">Items</h3>
              <div className="space-y-3">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                      {/* Placeholder for product image */}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium">{item.product_name}</h4>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                      {item.variant && (
                        <p className="text-xs text-gray-500">
                          {Object.entries(item.variant)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t px-4 py-3">
              <div className="flex justify-between">
                <h3 className="font-medium">Shipping Address</h3>
                <Link
                  to={`/orders/${order.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View Order Details
                </Link>
              </div>
              <address className="text-sm text-gray-600 not-italic mt-1">
                {order.shipping_address.fullName}<br />
                {order.shipping_address.address}<br />
                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postalCode}<br />
                {order.shipping_address.country}
              </address>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// src/pages/OrderDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getOrderById } from '../lib/api/stripe';

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchOrder() {
      try {
        if (!orderId) return;
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      } catch (err) {
        setError('Failed to load order details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    if (user) {
      fetchOrder();
    }
  }, [user, orderId]);
  
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link to="/orders" className="text-gray-500 hover:text-gray-700 mr-4">
            ← Back to Orders
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link to="/orders" className="text-gray-500 hover:text-gray-700 mr-4">
            ← Back to Orders
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <p>{error || 'Order not found'}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link to="/orders" className="text-gray-500 hover:text-gray-700 mr-4">
          ← Back to Orders
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="border rounded-lg overflow-hidden mb-6">
            <div className="bg-gray-50 p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Order Summary</h2>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  order.payment_status === 'succeeded' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.payment_status === 'succeeded' ? 'Paid' : 'Processing'}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Order ID: {order.id}
              </p>
              <p className="text-sm text-gray-500">
                Date: {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium mb-3">Items</h3>
              <div className="divide-y">
                {order.order_items.map((item) => (
                  <div key={item.id} className="py-4 flex items-center">
                    <div className="w-20 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                      {/* Placeholder for product image */}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium">{item.product_name}</h4>
                      {item.variant && (
                        <p className="text-sm text-gray-500">
                          {Object.entries(item.variant)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(', ')}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="border rounded-lg overflow-hidden mb-6">
            <div className="bg-gray-50 p-4">
              <h3 className="font-medium">Payment Information</h3>
            </div>
            <div className="p-4">
              <p className="text-sm mb-1">
                <span className="text-gray-600">Payment Status:</span>{' '}
                <span className="font-medium">{order.payment_status}</span>
              </p>
              <p className="text-sm mb-1">
                <span className="text-gray-600">Payment Method:</span>{' '}
                <span className="font-medium">Credit Card</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-600">Payment ID:</span>{' '}
                <span className="text-gray-500 break-all">{order.payment_intent_id}</span>
              </p>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden mb-6">
            <div className="bg-gray-50 p-4">
              <h3 className="font-medium">Shipping Address</h3>
            </div>
            <div className="p-4">
              <address className="text-sm text-gray-600 not-italic">
                {order.shipping_address.fullName}<br />
                {order.shipping_address.address}<br />
                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postalCode}<br />
                {order.shipping_address.country}<br />
                {order.shipping_address.phone}
              </address>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4">
              <h3 className="font-medium">Order Total</h3>
            </div>
            <div className="p-4">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>${order.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                  <span>Total:</span>
                  <span>${order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
