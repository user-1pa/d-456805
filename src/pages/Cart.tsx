import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Cart = () => {
  const { cart, removeItem, updateQuantity, clearCart, itemCount } = useCart();
  const navigate = useNavigate();

  // Function to handle quantity changes
  const handleQuantityChange = (
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ) => {
    updateQuantity(productId, quantity, size as any, color as any);
  };

  // Function to remove item from cart
  const handleRemoveItem = (
    productId: string,
    size?: string,
    color?: string
  ) => {
    removeItem(productId, size as any, color as any);
  };

  // Function to proceed to checkout
  const handleCheckout = () => {
    navigate("/checkout");
  };

  // Empty cart view
  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="text-center max-w-md">
            <ShoppingCart className="w-20 h-20 mx-auto mb-6 text-text-muted" />
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-text-muted mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link to="/shop">
              <Button className="bg-mint hover:bg-mint/90 text-forest font-medium">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow px-4 py-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-brand-accent p-4 rounded-lg flex items-center justify-between">
                <h2 className="font-semibold">
                  {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCart}
                  className="text-text-muted hover:text-white border-text-muted"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </div>

              {/* Cart Item List */}
              <div className="space-y-4">
                {cart.items.map((item, index) => {
                  // Calculate item price (accounting for discounts)
                  const itemPrice = item.product.discount
                    ? item.product.price * (1 - item.product.discount / 100)
                    : item.product.price;

                  return (
                    <div
                      key={`${item.product.id}-${item.size}-${item.color}-${index}`}
                      className="bg-brand-accent p-4 rounded-lg flex flex-col sm:flex-row gap-4"
                    >
                      {/* Product Image */}
                      <Link
                        to={`/shop/${item.product.id}`}
                        className="flex-shrink-0"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full sm:w-24 h-24 object-cover rounded"
                        />
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <Link
                              to={`/shop/${item.product.id}`}
                              className="font-semibold hover:text-mint transition-colors"
                            >
                              {item.product.name}
                            </Link>
                            {/* Product Options */}
                            <div className="text-sm text-text-muted mt-1">
                              {item.size && <span>Size: {item.size}</span>}
                              {item.size && item.color && <span> | </span>}
                              {item.color && (
                                <span>
                                  Color:{" "}
                                  <span
                                    className="inline-block w-3 h-3 rounded-full ml-1"
                                    style={{ backgroundColor: item.color }}
                                  ></span>
                                </span>
                              )}
                            </div>
                          </div>
                          {/* Price */}
                          <div className="text-right">
                            <div className="font-bold">
                              ${itemPrice.toFixed(2)}
                            </div>
                            {item.product.discount && (
                              <div className="text-sm">
                                <span className="text-text-muted line-through mr-1">
                                  ${item.product.price.toFixed(2)}
                                </span>
                                <Badge className="bg-red-500">
                                  {item.product.discount}% OFF
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex justify-between items-end mt-4">
                          <div className="flex items-center">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.product.id,
                                  item.quantity - 1,
                                  item.size,
                                  item.color
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center border border-text-muted rounded-l"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <div className="w-10 h-8 flex items-center justify-center border-t border-b border-text-muted">
                              {item.quantity}
                            </div>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.product.id,
                                  item.quantity + 1,
                                  item.size,
                                  item.color
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center border border-text-muted rounded-r"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Item Total & Remove Button */}
                          <div className="flex items-center">
                            <div className="font-medium mr-4">
                              ${(itemPrice * item.quantity).toFixed(2)}
                            </div>
                            <button
                              onClick={() =>
                                handleRemoveItem(
                                  item.product.id,
                                  item.size,
                                  item.color
                                )
                              }
                              className="text-text-muted hover:text-white transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-brand-accent p-6 rounded-lg h-fit">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  {cart.shipping === 0 ? (
                    <span className="text-green-500">Free</span>
                  ) : (
                    <span>${cart.shipping.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${cart.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-3 border-t border-brand">
                  <span>Total</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                className="w-full bg-mint hover:bg-mint/90 text-forest font-medium h-12 mb-4"
                onClick={handleCheckout}
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              {/* Continue Shopping */}
              <Link to="/shop">
                <Button
                  variant="outline"
                  className="w-full border-text-muted text-text-muted hover:text-white hover:border-white"
                >
                  Continue Shopping
                </Button>
              </Link>

              {/* Shipping Notice */}
              <div className="mt-6 text-sm text-text-muted">
                {cart.subtotal < 50 ? (
                  <p>
                    Add ${(50 - cart.subtotal).toFixed(2)} more to qualify for
                    free shipping.
                  </p>
                ) : (
                  <p>You've qualified for free shipping!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
