import { Product, ProductCategory } from "@/types/product";

// Sample product data
const products: Product[] = [
  {
    id: "prod_001",
    name: "4ortune Performance T-Shirt",
    description: "Breathable, moisture-wicking training t-shirt with the 4ortune logo. Perfect for intense workouts or casual wear.",
    price: 29.99,
    category: "apparel",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583744946564-b52d01a7b321?w=800&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["black", "white", "grey"],
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 124,
    tags: ["t-shirt", "training", "performance"],
    createdAt: new Date("2023-12-01")
  },
  {
    id: "prod_002",
    name: "4ortune Compression Shorts",
    description: "High-performance compression shorts that provide muscle support and comfort during intense training sessions.",
    price: 34.99,
    category: "apparel",
    images: [
      "https://images.unsplash.com/photo-1565693413969-22a6d9e01315?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1652530940550-52b02afb0ac2?w=800&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["black", "blue"],
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 89,
    tags: ["shorts", "training", "compression"],
    createdAt: new Date("2023-12-05")
  },
  {
    id: "prod_003",
    name: "4ortune Training Hoodie",
    description: "Stay warm before, during, and after workouts with this premium cotton-blend hoodie featuring the 4ortune logo.",
    price: 49.99,
    category: "apparel",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578763801-a2e08955498c?w=800&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["black", "grey", "blue"],
    inStock: true,
    featured: true,
    discount: 10,
    rating: 4.9,
    reviews: 156,
    tags: ["hoodie", "training", "casual"],
    createdAt: new Date("2023-12-10")
  },
  {
    id: "prod_004",
    name: "4ortune Resistance Bands Set",
    description: "Set of 5 resistance bands with varying levels of resistance for versatile home workouts. Includes carrying case.",
    price: 24.99,
    category: "equipment",
    images: [
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=800&auto=format&fit=crop"
    ],
    colors: ["black", "red", "green", "blue"],
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 78,
    tags: ["resistance bands", "home workout", "equipment"],
    createdAt: new Date("2023-12-15")
  },
  {
    id: "prod_005",
    name: "4ortune Shaker Bottle",
    description: "600ml BPA-free shaker bottle with mixing ball for smooth protein shakes. Leakproof and dishwasher safe.",
    price: 14.99,
    category: "accessories",
    images: [
      "https://images.unsplash.com/photo-1594735941481-90db3bdbc1ad?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1612875895579-b4b5bc0a0776?w=800&auto=format&fit=crop"
    ],
    colors: ["black", "white", "blue"],
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 62,
    tags: ["bottle", "protein", "accessories"],
    createdAt: new Date("2023-12-20")
  },
  {
    id: "prod_006",
    name: "4ortune Premium Whey Protein",
    description: "High-quality whey protein with 24g of protein per serving. Available in chocolate, vanilla, and strawberry flavors.",
    price: 39.99,
    category: "supplements",
    images: [
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1612871689353-cccf14d12a6a?w=800&auto=format&fit=crop"
    ],
    inStock: true,
    featured: true,
    discount: 15,
    rating: 4.7,
    reviews: 203,
    tags: ["protein", "supplements", "nutrition"],
    createdAt: new Date("2023-12-25")
  },
  {
    id: "prod_007",
    name: "4ortune Adjustable Dumbbell Set",
    description: "Space-saving adjustable dumbbells that can replace multiple sets of weights. Adjustable from 5 to 25 lbs per dumbbell.",
    price: 199.99,
    category: "equipment",
    images: [
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590239926044-4278086b2844?w=800&auto=format&fit=crop"
    ],
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 45,
    tags: ["dumbbells", "weights", "equipment"],
    createdAt: new Date("2024-01-05")
  },
  {
    id: "prod_008",
    name: "4ortune Joggers",
    description: "Comfortable and stylish joggers perfect for training or casual wear. Features deep pockets and tapered fit.",
    price: 44.99,
    category: "apparel",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["black", "grey"],
    inStock: true,
    featured: false,
    rating: 4.8,
    reviews: 67,
    tags: ["joggers", "pants", "casual"],
    createdAt: new Date("2024-01-10")
  },
  {
    id: "prod_009",
    name: "4ortune Fitness Tracker Band",
    description: "Waterproof fitness tracker that monitors steps, heart rate, sleep, and more. Compatible with iOS and Android.",
    price: 79.99,
    category: "accessories",
    images: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1576237934915-ee4b0cb7ba88?w=800&auto=format&fit=crop"
    ],
    colors: ["black", "blue", "red"],
    inStock: true,
    featured: true,
    rating: 4.6,
    reviews: 112,
    tags: ["tracker", "tech", "accessories"],
    createdAt: new Date("2024-01-15")
  }
];

// Function to get all products
export const getAllProducts = (): Product[] => {
  return products;
};

// Function to get a product by ID
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

// Function to get featured products
export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

// Function to get products by category
export const getProductsByCategory = (category: ProductCategory): Product[] => {
  return products.filter(product => product.category === category);
};

// Function to search products by name or description
export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(
    product => 
      product.name.toLowerCase().includes(lowercaseQuery) || 
      product.description.toLowerCase().includes(lowercaseQuery) ||
      (product.tags && product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
  );
};

export default products;
