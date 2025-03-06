// Define the product category types
export type ProductCategory = 'apparel' | 'equipment' | 'supplements' | 'accessories';

// Define the product size types
export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'onesize';

// Define color options
export type ProductColor = 'black' | 'white' | 'grey' | 'blue' | 'red' | 'green';

// Define the product interface
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  images: string[];
  sizes?: ProductSize[];
  colors?: ProductColor[];
  inStock: boolean;
  featured?: boolean;
  discount?: number;
  rating?: number;
  reviews?: number;
  tags?: string[];
  createdAt: Date;
}

// Define cart item interface
export interface CartItem {
  product: Product;
  quantity: number;
  size?: ProductSize;
  color?: ProductColor;
}

// Define the shopping cart
export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}
