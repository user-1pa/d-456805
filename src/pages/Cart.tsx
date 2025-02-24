
const Cart = () => {
  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-brand-accent p-4 rounded-lg flex gap-4">
                <img
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=200&auto=format&fit=crop"
                  alt={`Cart item ${item}`}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">Product {item}</h3>
                  <p className="text-text-muted">Lorem ipsum dolor sit amet</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold">$99.99</span>
                    <div className="flex items-center gap-2">
                      <button className="px-2 py-1 bg-brand-light text-brand rounded">-</button>
                      <span>1</span>
                      <button className="px-2 py-1 bg-brand-light text-brand rounded">+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-brand-accent p-6 rounded-lg h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>$299.97</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>$9.99</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-brand">
                <span>Total</span>
                <span>$309.96</span>
              </div>
            </div>
            <button className="w-full bg-brand-light text-brand py-2 rounded hover:bg-opacity-90">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
