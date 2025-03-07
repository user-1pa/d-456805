// src/lib/api/newsletter.ts
import { supabaseClient } from '../supabase';

export interface NewsletterSubscription {
  email: string;
  first_name?: string;
  last_name?: string;
  preferences?: {
    promotions?: boolean;
    product_updates?: boolean;
    blog_posts?: boolean;
    workouts?: boolean;
  };
}

/**
 * Subscribe a user to the newsletter
 * @param subscription Subscription details
 * @returns The created subscription or throws an error
 */
export async function subscribeToNewsletter(subscription: NewsletterSubscription) {
  // Check if the email already exists
  const { data: existingUser } = await supabaseClient
    .from('newsletter_subscriptions')
    .select('id, email')
    .eq('email', subscription.email)
    .single();

  if (existingUser) {
    // Update existing subscription
    const { data, error } = await supabaseClient
      .from('newsletter_subscriptions')
      .update({
        first_name: subscription.first_name,
        last_name: subscription.last_name,
        preferences: subscription.preferences || {},
        updated_at: new Date()
      })
      .eq('email', subscription.email)
      .select()
      .single();
      
    if (error) throw error;
    return { data, isNewSubscription: false };
  } else {
    // Create new subscription
    const { data, error } = await supabaseClient
      .from('newsletter_subscriptions')
      .insert([
        {
          email: subscription.email,
          first_name: subscription.first_name || null,
          last_name: subscription.last_name || null,
          preferences: subscription.preferences || {},
          subscribed_at: new Date(),
        }
      ])
      .select()
      .single();
      
    if (error) throw error;
    return { data, isNewSubscription: true };
  }
}

/**
 * Unsubscribe a user from the newsletter
 * @param email Email to unsubscribe
 * @returns Success or error message
 */
export async function unsubscribeFromNewsletter(email: string) {
  const { error } = await supabaseClient
    .from('newsletter_subscriptions')
    .update({ 
      is_active: false,
      unsubscribed_at: new Date() 
    })
    .eq('email', email);
    
  if (error) throw error;
  return { success: true, message: 'Successfully unsubscribed' };
}

/**
 * Update newsletter preferences
 * @param email Email of the subscriber
 * @param preferences New preferences
 * @returns Updated subscription
 */
export async function updateNewsletterPreferences(
  email: string, 
  preferences: NewsletterSubscription['preferences']
) {
  const { data, error } = await supabaseClient
    .from('newsletter_subscriptions')
    .update({ 
      preferences,
      updated_at: new Date() 
    })
    .eq('email', email)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

/**
 * Get newsletter subscription status for an email
 * @param email Email to check
 * @returns Subscription details or null
 */
export async function getNewsletterStatus(email: string) {
  const { data, error } = await supabaseClient
    .from('newsletter_subscriptions')
    .select('*')
    .eq('email', email)
    .single();
    
  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" - not an error for us
    throw error;
  }
  
  return data;
}
