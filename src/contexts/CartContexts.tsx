import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Product, ProductSize, ProductColor, CartItem, Cart } from "@/types/product";

// Define cart action types
type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: string; size?: ProductSize; color?: ProductColor } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number; size?: ProductSize; color?: ProductColor } }
  | { type: "CLEAR_CART" };

// Define cart context type
interface CartContextType {
  cart: Cart;
  addItem: (product: Product, quantity: number, size?: ProductSize, color?: ProductColor) => void;
  removeItem: (id: string, size?: ProductSize, color?: ProductColor) => void;
  updateQuantity: (id: string, quantity: number, size?: ProductSize, color?: ProductColor) => void;
  clearCart: () => void;
  itemCount: number;
}

// Initial state for cart
const initialCart: Cart = {
  items: [],
  subtotal: 0,
  shipping: 0,
  tax: 0,
  total: 0,
};

// Create the cart context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to generate item key
const getItemKey = (id: string, size?: ProductSize, color?: ProductColor): string => {
  return `${id}${size ? `-${size}` : ""}${color ? `-${color}` : ""}`;
};

// Cart reducer function
const cartReducer = (state: Cart, action: CartAction): Cart => {
  switch (action.type) {
    case "ADD_ITEM": {
      const newItem = action.payload;
      
      // Check if item already exists in cart (with same product, size, and color)
      const existingItemIndex = state.items.findIndex(
        (item) => 
          item.product.id === newItem.product.id && 
          item.size === newItem.size && 
          item.color === newItem.color
      );

      let updatedItems;
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
        };
      } else {
        // Item doesn't exist, add new item
        updatedItems = [...state.items, newItem];
      }
      
      // Calculate new totals
      const subtotal = calculateSubtotal(updatedItems);
      const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping for orders over $50
      const tax = subtotal * 0.08; // 8% tax
      const total = subtotal + shipping + tax;
      
      return {
        items: updatedItems,
        subtotal,
        shipping,
        tax,
        total,
      };
    }
    
    case "REMOVE_ITEM": {
      const { id, size, color } = action.payload;
      
      // Filter out the item to remove
      const updatedItems = state.items.filter(
        (item) => 
          !(item.product.id === id && item.size === size && item.color === color)
      );
      
      // Calculate new totals
      const subtotal = calculateSubtotal(updatedItems);
      const shipping = subtotal > 50 ? 0 : 9.99;
      const tax = subtotal * 0.08;
      const total = subtotal + shipping + tax;
      
      return {
        items: updatedItems,
        subtotal,
        shipping,
        tax,
        total,
      };
    }
    
    case "UPDATE_QUANTITY": {
      const { id, quantity, size, color } = action.payload;
      
      // Find the item to update
      const itemIndex = state.items.findIndex(
        (item) => 
          item.product.id === id && 
          item.size === size && 
          item.color === color
      );
      
      if (itemIndex === -1) {
        return state;
      }
      
      // Create updated items array
      const updatedItems = [...state.items];
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        updatedItems.splice(itemIndex, 1);
      } else {
        // Update quantity otherwise
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          quantity,
        };
      }
      
      // Calculate new totals
      const subtotal = calculateSubtotal(updatedItems);
      const shipping = subtotal > 50 ? 0 : 9.99;
      const tax = subtotal * 0.08;
      const total = subtotal + shipping + tax;
      
      return {
        items: updatedItems,
        subtotal,
        shipping,
        tax,
        total,
      };
    }
    
    case "CLEAR_CART":
      return initialCart;
      
    default:
      return state;
  }
};

// Helper function to calculate subtotal
const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    // Calculate the price (accounting for discounts)
    const price = item.product.discount
      ? item.product.price * (1 - item.product.discount / 100)
      : item.product.price;
      
    return total + price * item.quantity;
  }, 0
