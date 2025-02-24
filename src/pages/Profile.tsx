
const Profile = () => {
  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-brand-accent p-6 rounded-lg text-center">
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&auto=format&fit=crop"
              alt="Profile"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <h2 className="text-xl font-bold mb-2">John Doe</h2>
            <p className="text-text-muted">Member since 2023</p>
          </div>
          <div className="md:col-span-2 space-y-6">
            <div className="bg-brand-accent p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input type="text" className="w-full p-2 rounded bg-brand text-text" value="John Doe" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" className="w-full p-2 rounded bg-brand text-text" value="john@example.com" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="tel" className="w-full p-2 rounded bg-brand text-text" value="(555) 123-4567" readOnly />
                </div>
              </div>
            </div>
            <div className="bg-brand-accent p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((order) => (
                  <div key={order} className="flex justify-between items-center pb-2 border-b border-brand">
                    <div>
                      <p className="font-semibold">Order #{order}0001</p>
                      <p className="text-text-muted text-sm">January {order}, 2024</p>
                    </div>
                    <span className="font-bold">$99.99</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
