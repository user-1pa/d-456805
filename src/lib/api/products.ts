import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';
import { Product, ProductCategory } from '@/types/product';

type SupabaseProduct = Database['public']['Tables']['products']['Row'];

// Convert Supabase product to our application Product type
export const mapSupabaseProduct = (product: SupabaseProduct): Product => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    category: product.category as ProductCategory,
    images: product.images,
    sizes: product.sizes as any,
    colors: product.colors as any,
    inStock: product.in_stock,
    featured: product.featured || false,
    discount: product.discount ? Number(product.discount) : undefined,
    rating: product.rating ? Number(product.rating) : undefined,
    reviews: product.reviews_count || 0,
    tags: product.tags || [],
    createdAt: new Date(product.created_at),
  };
};

// Get all products
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(mapSupabaseProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Get a single product by ID
export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return mapSupabaseProduct(data);
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
};

// Get featured products
export const fetchFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(mapSupabaseProduct);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
};

// Get products by category
export const fetchProductsByCategory = async (category: ProductCategory): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(mapSupabaseProduct);
  } catch (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    return [];
  }
};

// Search products
export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(mapSupabaseProduct);
  } catch (error) {
    console.error(`Error searching products with query "${query}":`, error);
    return [];
  }
};

// Create a new product (admin only)
export const createProduct = async (product: Omit<Product, 'id' | 'createdAt'>): Promise<Product | null> => {
  try {
    const supabaseProduct = {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      images: product.images,
      sizes: product.sizes || null,
      colors: product.colors || null,
      in_stock: product.inStock,
      featured: product.featured || false,
      discount: product.discount || null,
      tags: product.tags || null,
    };

    const { data, error } = await supabase
      .from('products')
      .insert(supabaseProduct)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapSupabaseProduct(data);
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
};

// Update a product (admin only)
export const updateProduct = async (id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product | null> => {
  try {
    const supabaseUpdates: any = {};
    
    if (updates.name) supabaseUpdates.name = updates.name;
    if (updates.description) supabaseUpdates.description = updates.description;
    if (updates.price !== undefined) supabaseUpdates.price = updates.price;
    if (updates.category) supabaseUpdates.category = updates.category;
    if (updates.images) supabaseUpdates.images = updates.images;
    if (updates.sizes) supabaseUpdates.sizes = updates.sizes;
    if (updates.colors) supabaseUpdates.colors = updates.colors;
    if (updates.inStock !== undefined) supabaseUpdates.in_stock = updates.inStock;
    if (updates.featured !== undefined) supabaseUpdates.featured = updates.featured;
    if (updates.discount !== undefined) supabaseUpdates.discount = updates.discount;
    if (updates.tags) supabaseUpdates.tags = updates.tags;

    const { data, error } = await supabase
      .from('products')
      .update(supabaseUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapSupabaseProduct(data);
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    return null;
  }
};

// Delete a product (admin only)
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    return false;
  }
};
