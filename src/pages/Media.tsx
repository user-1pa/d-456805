
const Media = () => {
  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">Media</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
            <div key={item} className="aspect-w-16 aspect-h-9 bg-brand-accent rounded-lg overflow-hidden">
              <img
                src={`https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop`}
                alt={`Media ${item}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Media;
