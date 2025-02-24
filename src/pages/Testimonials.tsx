
const Testimonials = () => {
  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">Testimonials</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((testimonial) => (
            <div key={testimonial} className="bg-brand-accent rounded-lg p-6">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&auto=format&fit=crop"
                  alt={`Client ${testimonial}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h3 className="font-semibold">Client Name {testimonial}</h3>
                  <p className="text-text-muted text-sm">Member since 2023</p>
                </div>
              </div>
              <p className="text-text-muted">
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
