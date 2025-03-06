import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';
import { Cart, CartItem } from '@/types/product';

export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type ShippingAddress = {
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
};

export type PaymentMethod = 'credit_card' | 'paypal';

// Create a new order
export const createOrder = async (
  cart: Cart,
  shippingAddress: ShippingAddress,
  billingAddress: ShippingAddress,
  paymentMethod: PaymentMethod,
  paymentDetails?: any
): Promise<{ order: Order | null; error: string | null }> => {
  try {
    // Get current user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (!sessionData.session) {
      return { order: null, error: 'You must be logged in to create an order.' };
    }

    // Format cart items for storage
    const orderItems = cart.items.map((item: CartItem) => ({
      product_id: item.product.id,
      product_name: item.product.name,
      price: item.product.discount 
        ? item.product.price * (1 - item.product.discount / 100) 
        : item.product.price,
      quantity: item.quantity,
      size: item.size || null,
      color: item.color || null,
      image: item.product.images[0],
    }));

    // Create the order
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: sessionData.session.user.id,
        status: 'pending',
        total: cart.total,
        subtotal: cart.subtotal,
        shipping: cart.shipping,
        tax: cart.tax,
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        payment_method: paymentMethod,
        items: orderItems,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { order: data, error: null };
  } catch (error: any) {
    console.error('Error creating order:', error);
    return { order: null, error: error.message || 'An error occurred while creating the order.' };
  }
};

// Get orders for the current user
export const getUserOrders = async (): Promise<{ orders: Order[]; error: string | null }> => {
  try {
    // Get current user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (!sessionData.session) {
      return { orders: [], error: 'You must be logged in to view your orders.' };
    }

    // Get all orders for the current user
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', sessionData.session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return { orders: data, error: null };
  } catch (error: any) {
    console.error('Error fetching user orders:', error);
    return { orders: [], error: error.message || 'An error occurred while fetching orders.' };
  }
};

// Get a specific order by ID
export const getOrderById = async (orderId: string): Promise<{ order: Order | null; error: string | null }> => {
  try {
    // Get current user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (!sessionData.session) {
      return { order: null, error: 'You must be logged in to view an order.' };
    }

    // Get the order
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', sessionData.session.user.id)
      .single();

    if (error) {
      throw error;
    }

    return { order: data, error: null };
  } catch (error: any) {
    console.error(`Error fetching order ${orderId}:`, error);
    return { order: null, error: error.message || 'An error occurred while fetching the order.' };
  }
};

// Cancel an order (only if it's still pending)
export const cancelOrder = async (orderId: string): Promise<{ success: boolean; error: string | null }> => {
  try {
    // Get current user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (!sessionData.session) {
      return { success: false, error: 'You must be logged in to cancel an order.' };
    }

    // First, get the order to check its status
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('status')
      .eq('id', orderId)
      .eq('user_id', sessionData.session.user.id)
      .single();

    if (orderError) {
      throw orderError;
    }

    // Only allow cancellation if the order is 'pending' or 'processing'
    if (orderData.status !== 'pending' && orderData.status !== 'processing') {
      return { 
        success: false, 
        error: `Order cannot be cancelled because it is ${orderData.status}.` 
      };
    }

    // Update the order status to cancelled
    const { error } = await supabase
      .from('orders')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .eq('user_id', sessionData.session.user.id);

    if (error) {
      throw error;
    }

    return { success: true, error: null };
  } catch (error: any) {
    console.error(`Error cancelling order ${orderId}:`, error);
    return { success: false, error: error.message || 'An error occurred while cancelling the order.' };
  }
};
