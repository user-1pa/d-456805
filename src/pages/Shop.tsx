
const Shop = () => {
  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">Shop</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-brand-accent rounded-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-gray-800">
                <img
                  src={`https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop`}
                  alt="Product placeholder"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Product {item}</h3>
                <p className="text-text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <div className="mt-4">
                  <span className="text-xl font-bold">$99.99</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
