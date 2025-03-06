import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { StripeProvider } from '../components/payment/StripeProvider';
import { PaymentForm } from '../components/payment/PaymentForm';
import { PaymentSummary } from '../components/payment/PaymentSummary';

// Define the checkout steps
enum CheckoutStep {
  SHIPPING = 'shipping',
  PAYMENT = 'payment',
  CONFIRMATION = 'confirmation'
}

// Component for the shipping information form
function ShippingForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    phone: '',
    ...initialData
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
        />
      </div>
      
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
          />
        </div>
        
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State / Province
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
          />
        </div>
        
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            {/* Add more countries as needed */}
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
        />
      </div>
      
      <div className="pt-4">
        <button
          type="submit"
          className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Proceed to Payment
        </button>
      </div>
    </form>
  );
}

// Confirmation component
function OrderConfirmation({ orderId }) {
  const navigate = useNavigate();
  
  return (
    <div className="text-center space-y-6 py-8">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-900">Thank you for your order!</h2>
      
      <p className="text-gray-600">
        Your order has been received and is being processed. Your order ID is:
        <span className="font-medium text-gray-900 block mt-1">{orderId}</span>
      </p>
      
      <div className="pt-4">
        <button
          onClick={() => navigate('/orders')}
          className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 mr-4"
        >
          View Order History
        </button>
        
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

// Main Checkout Page Component
export default function Checkout() {
  const { cart, totalAmount, calculateTax, calculateShipping } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(CheckoutStep.SHIPPING);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [orderId, setOrderId] = useState(null);
  
  // If cart is empty, redirect to cart page
  React.useEffect(() => {
    if (cart.length === 0 && currentStep !== CheckoutStep.CONFIRMATION) {
      navigate('/cart');
    }
  }, [cart, navigate, currentStep]);
  
  // If user is not logged in, redirect to login page
  React.useEffect(() => {
    if (!user && currentStep !== CheckoutStep.CONFIRMATION) {
      navigate('/auth/login', { state: { from: '/checkout' } });
    }
  }, [user, navigate, currentStep]);
  
  const handleShippingSubmit = (data) => {
    setShippingAddress(data);
    setCurrentStep(CheckoutStep.PAYMENT);
  };
  
  const handlePaymentSuccess = (paymentIntentId) => {
    setOrderId(paymentIntentId);
    setCurrentStep(CheckoutStep.CONFIRMATION);
  };
  
  // Calculate order summary values
  const subtotal = totalAmount;
  const shipping = calculateShipping();
  const tax = calculateTax();
  const total = subtotal + shipping + tax;
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      {/* Checkout Steps Navigation */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div 
            className={`flex-1 pb-2 border-b-2 ${
              currentStep === CheckoutStep.SHIPPING || 
              currentStep === CheckoutStep.PAYMENT ||
              currentStep === CheckoutStep.CONFIRMATION
                ? 'border-black'
                : 'border-gray-200'
            }`}
          >
            <span className={`font-medium ${
              currentStep === CheckoutStep.SHIPPING ? 'text-black' : 'text-gray-500'
            }`}>
              1. Shipping
            </span>
          </div>
          
          <div 
            className={`flex-1 pb-2 border-b-2 ${
              currentStep === CheckoutStep.PAYMENT ||
              currentStep === CheckoutStep.CONFIRMATION
                ? 'border-black'
                : 'border-gray-200'
            }`}
          >
            <span className={`font-medium ${
              currentStep === CheckoutStep.PAYMENT ? 'text-black' : 'text-gray-500'
            }`}>
              2. Payment
            </span>
          </div>
          
          <div 
            className={`flex-1 pb-2 border-b-2 ${
              currentStep === CheckoutStep.CONFIRMATION
                ? 'border-black'
                : 'border-gray-200'
            }`}
          >
            <span className={`font-medium ${
              currentStep === CheckoutStep.CONFIRMATION ? 'text-black' : 'text-gray-500'
            }`}>
              3. Confirmation
            </span>
          </div>
        </div>
      </div>
      
      {/* Checkout Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {currentStep === CheckoutStep.SHIPPING && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <ShippingForm 
                onSubmit={handleShippingSubmit}
                initialData={user?.user_metadata || {}}
              />
            </div>
          )}
          
          {currentStep === CheckoutStep.PAYMENT && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Shipping Address</h3>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p>{shippingAddress.fullName}</p>
                  <p>{shippingAddress.address}</p>
                  <p>
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                  </p>
                  <p>{shippingAddress.country}</p>
                  <p>{shippingAddress.phone}</p>
                </div>
                <button
                  onClick={() => setCurrentStep(CheckoutStep.SHIPPING)}
                  className="text-sm text-gray-600 mt-2 underline"
                >
                  Edit Address
                </button>
              </div>
              
              <StripeProvider>
                <PaymentForm 
                  onSuccess={handlePaymentSuccess}
                  shippingAddress={shippingAddress}
                />
              </StripeProvider>
            </div>
          )}
          
          {currentStep === CheckoutStep.CONFIRMATION && (
            <OrderConfirmation orderId={orderId} />
          )}
        </div>
        
        <div>
          {currentStep !== CheckoutStep.CONFIRMATION && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex py-2 border-b last:border-b-0">
                    <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden mr-3">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      {item.variant && (
                        <p className="text-xs text-gray-500">
                          {Object.entries(item.variant)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(', ')}
                        </p>
                      )}
                      <div className="flex justify-between mt-1">
                        <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                        <span className="text-sm font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <PaymentSummary
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={total}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
