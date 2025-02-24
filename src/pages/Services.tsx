
const Services = () => {
  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">Services</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-brand-accent rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&auto=format&fit=crop"
              alt="Service 1"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-4">Personal Training</h3>
              <p className="text-text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
          </div>
          <div className="bg-brand-accent rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&auto=format&fit=crop"
              alt="Service 2"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-4">Group Classes</h3>
              <p className="text-text-muted">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
