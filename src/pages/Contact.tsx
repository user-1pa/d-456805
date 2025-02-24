
const Contact = () => {
  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">Contact</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop"
              alt="Contact"
              className="w-full h-[300px] object-cover rounded-lg mb-6"
            />
            <div className="space-y-4">
              <p className="text-text-muted">
                <strong>Address:</strong> 123 Fitness Street, Exercise City, SP 12345
              </p>
              <p className="text-text-muted">
                <strong>Email:</strong> contact@4ortunefitness.com
              </p>
              <p className="text-text-muted">
                <strong>Phone:</strong> (555) 123-4567
              </p>
            </div>
          </div>
          <div className="bg-brand-accent p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Send us a message</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" className="w-full p-2 rounded bg-brand text-text" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="w-full p-2 rounded bg-brand text-text" placeholder="Your email" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea className="w-full p-2 rounded bg-brand text-text h-32" placeholder="Your message"></textarea>
              </div>
              <button className="bg-brand-light text-brand px-6 py-2 rounded hover:bg-opacity-90">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
