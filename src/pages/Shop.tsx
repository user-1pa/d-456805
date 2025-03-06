import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/shop/ProductGrid";
import { Product, ProductCategory } from "@/types/product";
import { getAllProducts, getFeaturedProducts, getProductsByCategory } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Shop = () => {
  // State for products and filters
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [isLoading, setIsLoading] = useState(true);

  // Load products on component mount
  useEffect(() => {
    setIsLoading(true);
    try {
      const allProducts = getAllProducts();
      setProducts(allProducts);
      setFilteredProducts(allProducts);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          (product.tags && product.tags.some((tag) => tag.toLowerCase().includes(query)))
      );
    }

    // Apply price range filter
    result = result.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "featured":
      default:
        result = [
          ...result.filter((p) => p.featured),
          ...result.filter((p) => !p.featured),
        ];
        break;
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, searchQuery, sortBy, priceRange]);

  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already applied via useEffect
  };

  // Handle price range change
  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange([min, max]);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSortBy("featured");
    setPriceRange([0, 200]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Shop Header */}
      <div className="bg-brand-accent py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Shop</h1>
          <p className="text-text-muted max-w-2xl mx-auto">
            Discover our high-quality fitness apparel, equipment, and supplements designed to enhance your performance.
          </p>
        </div>
      </div>
      
      {/* Shop Content */}
      <div className="flex-grow px-4 py-8">
        <div className="container mx-auto">
          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-8">
            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full lg:w-auto">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
                className="whitespace-nowrap"
              >
                All Products
              </Button>
              <Button
                variant={selectedCategory === "apparel" ? "default" : "outline"}
                onClick={() => setSelectedCategory("apparel")}
                className="whitespace-nowrap"
              >
                Apparel
              </Button>
              <Button
                variant={selectedCategory === "equipment" ? "default" : "outline"}
                onClick={() => setSelectedCategory("equipment")}
                className="whitespace-nowrap"
              >
                Equipment
              </Button>
              <Button
                variant={selectedCategory === "supplements" ? "default" : "outline"}
                onClick={() => setSelectedCategory("supplements")}
                className="whitespace-nowrap"
              >
                Supplements
              </Button>
              <Button
                variant={selectedCategory === "accessories" ? "default" : "outline"}
                onClick={() => setSelectedCategory("accessories")}
                className="whitespace-nowrap"
              >
                Accessories
              </Button>
            </div>

            {/* Search and Sort */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <form onSubmit={handleSearch} className="relative flex-grow">
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4 text-text-muted" />
                </button>
              </form>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Best Rated</SelectItem>
                </SelectContent>
              </Select>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Products</SheetTitle>
                    <SheetDescription>
                      Adjust filters to find exactly what you need
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="py-4 space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Categories</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="cat-all" 
                            checked={selectedCategory === "all"} 
                            onChange={() => setSelectedCategory("all")}
                            className="mr-2"
                          />
                          <label htmlFor="cat-all">All Products</label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="cat-apparel" 
                            checked={selectedCategory === "apparel"} 
                            onChange={() => setSelectedCategory("apparel")}
                            className="mr-2"
                          />
                          <label htmlFor="cat-apparel">Apparel</label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="cat-equipment" 
                            checked={selectedCategory === "equipment"} 
                            onChange={() => setSelectedCategory("equipment")}
                            className="mr-2"
                          />
                          <label htmlFor="cat-equipment">Equipment</label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="cat-supplements" 
                            checked={selectedCategory === "supplements"} 
                            onChange={() => setSelectedCategory("supplements")}
                            className="mr-2"
                          />
                          <label htmlFor="cat-supplements">Supplements</label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="cat-accessories" 
                            checked={selectedCategory === "accessories"} 
                            onChange={() => setSelectedCategory("accessories")}
                            className="mr-2"
                          />
                          <label htmlFor="cat-accessories">Accessories</label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Price Range</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>${priceRange[0]}</span>
                          <span>${priceRange[1]}</span>
                        </div>
                        <div className="flex gap-4">
                          <Input
                            type="number"
                            min="0"
                            max={priceRange[1]}
                            value={priceRange[0]}
                            onChange={(e) => handlePriceRangeChange(Number(e.target.value), priceRange[1])}
                          />
                          <Input
                            type="number"
                            min={priceRange[0]}
                            value={priceRange[1]}
                            onChange={(e) => handlePriceRangeChange(priceRange[0], Number(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Button onClick={resetFilters} className="w-full">
                      Reset Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          
          {/* Product Listings */}
          <div>
            <div className="mb-4 text-text-muted">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </div>
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Shop;
