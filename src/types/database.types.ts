export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          country: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          country?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          country?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          category: string
          images: string[]
          sizes: string[] | null
          colors: string[] | null
          in_stock: boolean
          featured: boolean | null
          discount: number | null
          rating: number | null
          reviews_count: number | null
          tags: string[] | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          category: string
          images: string[]
          sizes?: string[] | null
          colors?: string[] | null
          in_stock?: boolean
          featured?: boolean | null
          discount?: number | null
          rating?: number | null
          reviews_count?: number | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          category?: string
          images?: string[]
          sizes?: string[] | null
          colors?: string[] | null
          in_stock?: boolean
          featured?: boolean | null
          discount?: number | null
          rating?: number | null
          reviews_count?: number | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          order_number: string
          status: string
          total: number
          subtotal: number
          shipping: number
          tax: number
          shipping_address: Json
          billing_address: Json
          payment_method: string
          items: Json[]
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          order_number?: string
          status?: string
          total: number
          subtotal: number
          shipping: number
          tax: number
          shipping_address: Json
          billing_address: Json
          payment_method: string
          items: Json[]
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          order_number?: string
          status?: string
          total?: number
          subtotal?: number
          shipping?: number
          tax?: number
          shipping_address?: Json
          billing_address?: Json
          payment_method?: string
          items?: Json[]
          created_at?: string
          updated_at?: string | null
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      wishlist_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
