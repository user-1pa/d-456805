import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById, getAllProducts } from "@/data/products";
import { Product, ProductSize, ProductColor } from "@/types/product";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  Heart, 
  ShoppingCart, 
  Star, 
  TruckIcon, 
  RotateCcw, 
  Shield, 
  Minus, 
  Plus 
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Product options state
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);

  // Load product details
  useEffect(() => {
    if (id) {
      const foundProduct = getProductById(id);
      
      if (foundProduct) {
        setProduct(foundProduct);
        
        // Set default selected options if available
        if (foundProduct.sizes && foundProduct.sizes.length > 0) {
          setSelectedSize(foundProduct.sizes[0]);
        }
        
        if (foundProduct.colors && foundProduct.colors.length > 0) {
          setSelectedColor(foundProduct.colors[0]);
        }
        
        // Get related products (same category, exclude current product)
        const related = getAllProducts()
          .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 4);
        setRelatedProducts(related);
        
        setLoading(false);
      } else {
        setError("Product not found");
        setLoading(false);
      }
    }
  }, [id]);

  // Calculate discounted price if applicable
  const discountedPrice = product?.discount 
    ? product.price - (product.price * (product.discount / 100)) 
    : null;

  // Handle quantity change
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Handle add to cart (placeholder for now)
  const handleAddToCart = () => {
    // This will be implemented with the cart context
    console.log("Added to cart:", {
      product,
      quantity,
      size: selectedSize,
      color: selectedColor
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse">Loading product details...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-text-muted mb-8">Sorry, we couldn't find the product you're looking for.</p>
          <Link to="/shop">
            <Button>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Return to Shop
            </Button>
          </Link>
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
          {/* Breadcrumbs */}
          <div className="mb-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link to="/" className="text-text-muted hover:text-white">Home</Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="mx-2.5 text-text-muted">/</span>
                    <Link to="/shop" className="text-text-muted hover:text-white">Shop</Link>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <span className="mx-2.5 text-text-muted">/</span>
                    <span className="text-text-muted">{product.name}</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          
          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-lg overflow-hidden bg-brand-accent">
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
                
                {/* Badges */}
                {(product.featured || product.discount) && (
                  <div className="absolute top-4 left-4">
                    {product.discount ? (
                      <div className="bg-red-500 text-white font-medium px-3 py-1 rounded-full text-sm">
                        {product.discount}% OFF
                      </div>
                    ) : product.featured ? (
                      <div className="bg-mint text-forest font-medium px-3 py-1 rounded-full text-sm">
                        Featured
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        "w-20 h-20 rounded border-2",
                        selectedImage === index 
                          ? "border-mint" 
                          : "border-transparent hover:border-gray-400"
                      )}
                    >
                      <img 
                        src={image} 
                        alt={`${product.name} thumbnail ${index + 1}`} 
                        className="w-full h-full object-cover rounded"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              {/* Rating */}
              {product.rating && (
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={cn(
                          "h-4 w-4 mr-0.5", 
                          i < Math.floor(product.rating) 
                            ? "text-yellow-400 fill-yellow-400" 
                            : "text-gray-400"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-text-muted ml-2">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              )}
              
              {/* Price */}
              <div className="flex items-center mb-6">
                {discountedPrice ? (
                  <>
                    <span className="text-3xl font-bold mr-3">
                      ${discountedPrice.toFixed(2)}
                    </span>
                    <span className="text-xl text-text-muted line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
              
              {/* Description */}
              <p className="text-text-muted mb-6">{product.description}</p>
              
              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Size:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "px-4 py-2 border rounded-md transition-colors",
                          selectedSize === size
                            ? "bg-mint text-forest border-mint"
                            : "border-text-muted text-text-muted hover:border-white hover:text-white"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Color:</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "w-8 h-8 rounded-full border-2",
                          selectedColor === color
                            ? "border-mint"
                            : "border-transparent hover:border-white"
                        )}
                        style={{ backgroundColor: color }}
                        aria-label={`Select ${color} color`}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Quantity */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Quantity:</h3>
                <div className="flex items-center w-32">
                  <button
                    onClick={decrementQuantity}
                    className="w-8 h-8 flex items-center justify-center border border-text-muted rounded-l"
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="flex-1 h-8 flex items-center justify-center border-t border-b border-text-muted">
                    {quantity}
                  </div>
                  <button
                    onClick={incrementQuantity}
                    className="w-8 h-8 flex items-center justify-center border border-text-muted rounded-r"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Button 
                  className="flex-1 bg-mint hover:bg-mint/90 text-forest font-medium h-12"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-text-muted text-text-muted hover:text-white hover:border-white h-12"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Add to Wishlist
                </Button>
              </div>
              
              {/* Product Features */}
              <div className="space-y-3 border-t border-b border-text-muted py-4 mb-6">
                <div className="flex items-center gap-2">
                  <TruckIcon className="h-5 w-5 text-mint" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-mint" />
                  <span>30-day easy returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-mint" />
                  <span>Satisfaction guaranteed</span>
                </div>
              </div>
              
              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-brand-accent px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Product Tabs */}
          <div className="mb-16">
            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start border-b rounded-none">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="py-6">
                <div className="prose prose-invert max-w-none">
                  <p>{product.description}</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec velit eget lorem lacinia consequat. Proin consequat, velit a tincidunt varius, nisi ligula fermentum nulla, nec vestibulum nulla magna eget turpis. Vivamus pharetra, eros at condimentum elementum, nisl enim aliquet erat, et aliquet nisl odio at libero.</p>
                  <p>Features:</p>
                  <ul>
                    <li>Premium quality materials</li>
                    <li>Designed for maximum performance</li>
                    <li>Durable construction</li>
                    <li>Comfortable fit</li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="details" className="py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Product Details</h3>
                    <ul className="space-y-2">
                      <li><strong>Material:</strong> Premium quality fabric</li>
                      <li><strong>Weight:</strong> 0.5 kg</li>
                      <li><strong>Dimensions:</strong> Variable by size</li>
                      <li><strong>Care Instructions:</strong> Machine wash cold</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Shipping Information</h3>
                    <ul className="space-y-2">
                      <li><strong>Processing Time:</strong> 1-2 business days</li>
                      <li><strong>Shipping Time:</strong> 3-5 business days</li>
                      <li><strong>Return Policy:</strong> 30-day easy returns</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="py-6">
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-5xl font-bold">{product.rating}</div>
                      <div className="text-sm text-text-muted">out of 5</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={cn(
                                "h-4 w-4 mr-0.5", 
                                "text-yellow-400 fill-yellow-400"
                              )}
                            />
                          ))}
                        </div>
                        <div className="ml-2 w-full bg-brand-accent rounded-full h-2.5">
                          <div className="bg-mint h-2.5 rounded-full w-3/4"></div>
                        </div>
                        <span className="ml-2 text-sm text-text-muted">75%</span>
                      </div>
                      <div className="flex items-center mb-1">
                        <div className="flex">
                          {[...Array(4)].map((_, i) => (
                            <Star 
                              key={i}
                              className={cn(
                                "h-4 w-4 mr-0.5", 
                                "text-yellow-400 fill-yellow-400"
                              )}
                            />
                          ))}
                          <Star className="h-4 w-4 mr-0.5 text-gray-400" />
                        </div>
                        <div className="ml-2 w-full bg-brand-accent rounded-full h-2.5">
                          <div className="bg-mint h-2.5 rounded-full w-1/5"></div>
                        </div>
                        <span className="ml-2 text-sm text-text-muted">20%</span>
                      </div>
                      <div className="flex items-center mb-1">
                        <div className="flex">
                          {[...Array(3)].map((_, i) => (
                            <Star 
                              key={i}
                              className={cn(
                                "h-4 w-4 mr-0.5", 
                                "text-yellow-400 fill-yellow-400"
                              )}
                            />
                          ))}
                          {[...Array(2)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 mr-0.5 text-gray-400" />
                          ))}
                        </div>
                        <div className="ml-2 w-full bg-brand-accent rounded-full h-2.5">
                          <div className="bg-mint h-2.5 rounded-full w-[5%]"></div>
                        </div>
                        <span className="ml-2 text-sm text-text-muted">5%</span>
                      </div>
                      <div className="flex items-center mb-1">
                        <div className="flex">
                          {[...Array(2)].map((_, i) => (
                            <Star 
                              key={i}
                              className={cn(
                                "h-4 w-4 mr-0.5", 
                                "text-yellow-400 fill-yellow-400"
                              )}
                            />
                          ))}
                          {[...Array(3)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 mr-0.5 text-gray-400" />
                          ))}
                        </div>
                        <div className="ml-2 w-full bg-brand-accent rounded-full h-2.5">
                          <div className="bg-mint h-2.5 rounded-full w-0"></div>
                        </div>
                        <span className="ml-2 text-sm text-text-muted">0%</span>
                      </div>
                      <div className="flex items-center">
                        <div className="flex">
                          <Star 
                            className={cn(
                              "h-4 w-4 mr-0.5", 
                              "text-yellow-400 fill-yellow-400"
                            )}
                          />
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 mr-0.5 text-gray-400" />
                          ))}
                        </div>
                        <div className="ml-2 w-full bg-brand-accent rounded-full h-2.5">
                          <div className="bg-mint h-2.5 rounded-full w-0"></div>
                        </div>
                        <span className="ml-2 text-sm text-text-muted">0%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sample Reviews */}
                  <div className="border-t border-text-muted pt-6 space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <div className="font-semibold">John Doe</div>
                        <div className="text-text-muted text-sm">2 weeks ago</div>
                      </div>
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            className={cn(
                              "h-4 w-4 mr-0.5", 
                              i < 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                            )}
                          />
                        ))}
                      </div>
                      <p>Great product! Exactly as described. The material is high quality and the fit is perfect. Would definitely recommend.</p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <div className="font-semibold">Jane Smith</div>
                        <div className="text-text-muted text-sm">1 month ago</div>
                      </div>
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            className={cn(
                              "h-4 w-4 mr-0.5", 
                              i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                            )}
                          />
                        ))}
                      </div>
                      <p>Good product, but the sizing runs a bit small. I would recommend ordering one size up from your usual size. Otherwise, the quality is excellent.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
