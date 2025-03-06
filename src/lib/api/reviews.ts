import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';

export type Review = Database['public']['Tables']['reviews']['Row'];

// Create a new review for a product
export const createReview = async (
  productId: string,
  rating: number,
  comment?: string
): Promise<{ review: Review | null; error: string | null }> => {
  try {
    // Get current user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (!sessionData.session) {
      return { review: null, error: 'You must be logged in to write a review.' };
    }

    // Check if user has already reviewed this product
    const { data: existingReview, error: existingError } = await supabase
      .from('reviews')
      .select('id')
      .eq('product_id', productId)
      .eq('user_id', sessionData.session.user.id)
      .maybeSingle();

    if (existingError && existingError.code !== 'PGRST116') {
      throw existingError;
    }

    // If user already has a review, update it instead of creating a new one
    if (existingReview) {
      return updateReview(existingReview.id, rating, comment);
    }

    // Create the review
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        product_id: productId,
        user_id: sessionData.session.user.id,
        rating,
        comment: comment || null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { review: data, error: null };
  } catch (error: any) {
    console.error('Error creating review:', error);
    return { review: null, error: error.message || 'An error occurred while creating the review.' };
  }
};

// Update an existing review
export const updateReview = async (
  reviewId: string,
  rating: number,
  comment?: string
): Promise<{ review: Review | null; error: string | null }> => {
  try {
    // Get current user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (!sessionData.session) {
      return { review: null, error: 'You must be logged in to update a review.' };
    }

    // Update the review
    const { data, error } = await supabase
      .from('reviews')
      .update({
        rating,
        comment: comment || null,
      })
      .eq('id', reviewId)
      .eq('user_id', sessionData.session.user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { review: data, error: null };
  } catch (error: any) {
    console.error(`Error updating review ${reviewId}:`, error);
    return { review: null, error: error.message || 'An error occurred while updating the review.' };
  }
};

// Delete a review
export const deleteReview = async (reviewId: string): Promise<{ success: boolean; error: string | null }> => {
  try {
    // Get current user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (!sessionData.session) {
      return { success: false, error: 'You must be logged in to delete a review.' };
    }

    // Delete the review
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)
      .eq('user_id', sessionData.session.user.id);

    if (error) {
      throw error;
    }

    return { success: true, error: null };
  } catch (error: any) {
    console.error(`Error deleting review ${reviewId}:`, error);
    return { success: false, error: error.message || 'An error occurred while deleting the review.' };
  }
};

// Get all reviews for a product
export const getProductReviews = async (productId: string): Promise<{ reviews: Review[]; error: string | null }> => {
  try {
    // Get reviews for the product
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return { reviews: data, error: null };
  } catch (error: any) {
    console.error(`Error fetching reviews for product ${productId}:`, error);
    return { reviews: [], error: error.message || 'An error occurred while fetching reviews.' };
  }
};

// Get all reviews by the current user
export const getUserReviews = async (): Promise<{ reviews: Review[]; error: string | null }> => {
  try {
    // Get current user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (!sessionData.session) {
      return { reviews: [], error: 'You must be logged in to view your reviews.' };
    }

    // Get reviews by the user
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        products:product_id (
          name,
          images
        )
      `)
      .eq('user_id', sessionData.session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return { reviews: data, error: null };
  } catch (error: any) {
    console.error('Error fetching user reviews:', error);
    return { reviews: [], error: error.message || 'An error occurred while fetching your reviews.' };
  }
};

// Check if user has reviewed a product
export const hasUserReviewedProduct = async (productId: string): Promise<{ hasReviewed: boolean; reviewId?: string; error: string | null }> => {
  try {
    // Get current user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (!sessionData.session) {
      return { hasReviewed: false, error: null };
    }

    // Check for review
    const { data, error } = await supabase
      .from('reviews')
      .select('id')
      .eq('product_id', productId)
      .eq('user_id', sessionData.session.user.id)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return { 
      hasReviewed: !!data, 
      reviewId: data?.id, 
      error: null 
    };
  } catch (error: any) {
    console.error(`Error checking if user reviewed product ${productId}:`, error);
    return { hasReviewed: false, error: error.message || 'An error occurred while checking review status.' };
  }
};
