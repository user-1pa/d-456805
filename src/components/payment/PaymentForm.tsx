import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createPaymentIntent, saveOrderToDatabase } from '../../lib/api/stripe';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

interface PaymentFormProps {
  onSuccess: (paymentIntentId: string) => void;
  shippingAddress: any;
}

export function PaymentForm({ onSuccess, shippingAddress }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Create a payment intent on the server
      const { clientSecret } = await createPaymentIntent(totalAmount, {
        cartItems: JSON.stringify(cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        }))),
      });
      
      // Confirm the payment with the card element
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }
      
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: user?.user_metadata?.full_name || 'Customer',
              email: user?.email,
            },
          },
        }
      );
      
      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        setLoading(false);
        return;
      }
      
      if (paymentIntent?.status === 'succeeded') {
        // Save the order to the database
        const order = {
          user_id: user!.id,
          total_amount: totalAmount,
          payment_intent_id: paymentIntent.id,
          payment_status: paymentIntent.status,
          shipping_address: shippingAddress,
          order_items: cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
            product_name: item.name,
            variant: item.variant || null,
          })),
        };
        
        await saveOrderToDatabase(order);
        
        // Clear the cart
        clearCart();
        
        // Notify parent component
        onSuccess(paymentIntent.id);
      }
    } catch (err: any) {
      setError('An error occurred while processing your payment. Please try again.');
      console.error(err);
    }
    
    setLoading(false);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
      </button>
    </form>
  );
}
