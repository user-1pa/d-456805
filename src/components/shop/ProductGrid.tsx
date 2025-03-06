import React from "react";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  className?: string;
}

// This component renders a grid of product cards
const ProductGrid: React.FC<ProductGridProps> = ({ products, className }) => {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-text-muted">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
