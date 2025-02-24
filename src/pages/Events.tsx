
const Events = () => {
  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">Events</h1>
        <div className="space-y-8">
          {[1, 2, 3].map((event) => (
            <div key={event} className="bg-brand-accent rounded-lg overflow-hidden flex flex-col md:flex-row">
              <img
                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&auto=format&fit=crop"
                alt={`Event ${event}`}
                className="w-full md:w-1/3 h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4">Upcoming Event {event}</h3>
                <p className="text-text-muted mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <div className="flex items-center gap-4">
                  <span className="text-text-muted">Date: Jan {event}, 2024</span>
                  <span className="text-text-muted">Time: 6:00 PM</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
