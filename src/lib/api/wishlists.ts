import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';
import { Product } from '@/types/product';
import { mapSupabaseProduct } from './products';

export type WishlistItem = Database['public']['Tables']['wishlist_items']['Row'];

// Get all wishlist items for the current user
export const getWishlist = async (): Promise<{ products: Product[]; error: string | null }> => {
  try {
    // Get current user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (!sessionData.session) {
      return { products: [], error: 'You must be logged in to view your wishlist.' };
    }

    // Get wishlist items with product details
    const { data, error } = await supabase
      .from('wishlist_items')
      .select(`
        *,
        products:product_id (*)
      `)
      .eq('user_id', sessionData.session.user.id);

    if (error) {
      throw error;
    }

    // Transform to Product array
    const products = data.map(item => mapSupabaseProduct(item.products));

    return { products, error: null };
  } catch (error: any) {
    console.error('Error fetching wishlist:', error);
    return { products: [], error: error.message || 'An error occurred while fetching your wishlist.' };
  }
};

// Add a product to the wishlist
export const addToWishlist = async (productId: string): Promise<{ success: boolean; error: string | null }> => {
  try {
    // Get current user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (!sessionData.session) {
      return { success: false, error: 'You must be logged in to add items to your wishlist.' };
    }

    // Add item to wishlist
    const { error } = await supabase
      .from('wishlist_items')
      .insert({
        user_id: sessionData.session.user.id,
        product_id: productId,
      });

    if (error) {
      // If error is because item already exists, that's okay
      if (error.code === '23505') { // Unique violation
        return { success: true, error: null };
      }
      throw error;
    }

    return { success: true, error: null };
  } catch (error: any) {
    console.error(`Error adding product ${productId} to wishlist:`, error);
    return { success: false, error: error.message || 'An error occurred while adding to your wishlist.' };
  }
};

// Remove a product from the wishlist
export const removeFromWishlist = async (productId: string): Promise<{ success: boolean; error: string | null }> => {
  try {
    // Get current user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (!sessionData.session) {
      return { success: false, error: 'You must be logged in to remove items from your wishlist.' };
    }

    // Remove item from wishlist
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', sessionData.session.user.id)
      .eq('product_id', productId);

    if (error) {
      throw error;
    }

    return { success: true, error: null };
  } catch (error: any) {
    console.error(`Error removing product ${productId} from wishlist:`, error);
    return { success: false, error: error.message || 'An error occurred while removing from your wishlist.' };
  }
};

// Check if a product is in the user's wishlist
export const isInWishlist = async (productId: string): Promise<{ isInWishlist: boolean; error: string | null }> => {
  try {
    // Get current user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (!sessionData.session) {
      return { isInWishlist: false, error: null };
    }

    // Check if product is in wishlist
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', sessionData.session.user.id)
      .eq('product_id', productId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return { isInWishlist: !!data, error: null };
  } catch (error: any) {
    console.error(`Error checking if product ${productId} is in wishlist:`, error);
    return { isInWishlist: false, error: error.message || 'An error occurred while checking your wishlist.' };
  }
};

// Toggle a product in the wishlist (add if not present, remove if present)
export const toggleWishlist = async (productId: string): Promise<{ isInWishlist: boolean; error: string | null }> => {
  try {
    const { isInWishlist, error: checkError } = await isInWishlist(productId);
    
    if (checkError) {
      throw new Error(checkError);
    }

    if (isInWishlist) {
      const { success, error } = await removeFromWishlist(productId);
      if (!success) {
        throw new Error(error || 'Failed to remove from wishlist');
      }
      return { isInWishlist: false, error: null };
    } else {
      const { success, error } = await addToWishlist(productId);
      if (!success) {
        throw new Error(error || 'Failed to add to wishlist');
      }
      return { isInWishlist: true, error: null };
    }
  } catch (error: any) {
    console.error(`Error toggling product ${productId} in wishlist:`, error);
    return { isInWishlist: false, error: error.message || 'An error occurred while updating your wishlist.' };
  }
};
