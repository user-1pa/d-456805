import React from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  // Calculate discounted price if applicable
  const discountedPrice = product.discount 
    ? product.price - (product.price * (product.discount / 100)) 
    : null;

  return (
    <div className={cn("group relative rounded-lg overflow-hidden bg-brand-accent transition-all duration-300 hover:shadow-xl", className)}>
      {/* Badge for featured or discount */}
      {(product.featured || product.discount) && (
        <div className="absolute top-2 left-2 z-10">
          {product.discount ? (
            <Badge className="bg-red-500 text-white font-medium">
              {product.discount}% OFF
            </Badge>
          ) : product.featured ? (
            <Badge className="bg-mint text-forest font-medium">
              Featured
            </Badge>
          ) : null}
        </div>
      )}
      
      {/* Wishlist button */}
      <button 
        className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label="Add to wishlist"
      >
        <Heart className="h-4 w-4 text-white" />
      </button>
      
      {/* Product image */}
      <Link to={`/shop/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
      </Link>
      
      {/* Product details */}
      <div className="p-4">
        <Link to={`/shop/${product.id}`} className="block">
          <h3 className="text-lg font-semibold mb-1 line-clamp-1 hover:text-mint transition-colors">
            {product.name}
          </h3>
        </Link>
        
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5", 
                    i < Math.floor(product.rating!) 
                      ? "text-yellow-400 fill-yellow-400" 
                      : "text-gray-400"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-text-muted ml-1">
              ({product.reviews})
            </span>
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-center mb-3">
          {discountedPrice ? (
            <>
              <span className="font-bold text-lg mr-2">
                ${discountedPrice.toFixed(2)}
              </span>
              <span className="text-sm text-text-muted line-through">
                ${product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="font-bold text-lg">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
        
        {/* Add to cart button */}
        <Button 
          className="w-full bg-mint hover:bg-mint/90 text-forest font-medium flex items-center justify-center gap-2"
          aria-label="Add to cart"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
