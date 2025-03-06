import { supabaseClient } from '../supabase';

interface PaymentIntentResponse {
  clientSecret: string;
}

export interface OrderMetadata {
  cartItems?: string;
  [key: string]: any;
}

export async function createPaymentIntent(amount: number, metadata: OrderMetadata = {}): Promise<PaymentIntentResponse> {
  const response = await supabaseClient.functions.invoke('create-payment-intent', {
    body: { amount, metadata },
  });
  
  if (response.error) {
    throw new Error(response.error.message || 'Failed to create payment intent');
  }
  
  return response.data as PaymentIntentResponse;
}

export interface OrderData {
  user_id: string;
  total_amount: number;
  payment_intent_id: string;
  payment_status: string;
  shipping_address: any;
  order_items: Array<{
    product_id: string;
    quantity: number;
    price: number;
    product_name: string;
    variant?: any;
  }>;
}

export async function saveOrderToDatabase(order: OrderData) {
  // First insert the order
  const { data: orderData, error: orderError } = await supabaseClient
    .from('orders')
    .insert([{
      user_id: order.user_id,
      total_amount: order.total_amount,
      payment_intent_id: order.payment_intent_id,
      payment_status: order.payment_status,
      shipping_address: order.shipping_address
    }])
    .select('id')
    .single();
    
  if (orderError) throw orderError;
  
  // Then insert all order items with the order_id
  const orderItems = order.order_items.map(item => ({
    order_id: orderData.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
    product_name: item.product_name,
    variant: item.variant || null
  }));
  
  const { error: itemsError } = await supabaseClient
    .from('order_items')
    .insert(orderItems);
    
  if (itemsError) throw itemsError;
  
  return orderData;
}

export async function getOrderHistory() {
  const { data, error } = await supabaseClient
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
}

export async function getOrderById(orderId: string) {
  const { data, error } = await supabaseClient
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('id', orderId)
    .single();
    
  if (error) throw error;
  return data;
}
