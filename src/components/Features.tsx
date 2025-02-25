
import React from "react";

const Features = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl font-bold mb-8 text-white">
              Our Mission – Build Strength, Create Fortune
            </h2>
            <p className="text-white/80 mb-8">
              At 4ortune Fitness, we believe that every rep, every step, and every drop of sweat brings you closer to success. We're not just about working out—we're about building a winning mindset.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🔥</span>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Mind Over Matter</h3>
                  <p className="text-white/80">Fitness isn't just physical; it's mental. Push past limits and redefine your strength.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-3xl">🎯</span>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Progress Over Perfection</h3>
                  <p className="text-white/80">Every journey starts somewhere. Take the first step and grow with us.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-3xl">💡</span>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Community & Support</h3>
                  <p className="text-white/80">We rise together. Surround yourself with like-minded individuals who uplift and inspire.</p>
                </div>
              </div>
            </div>
            <p className="text-white/80 mt-8 text-lg font-semibold">
              Are you ready to create your own fortune? Let's get started today.
            </p>
          </div>

          {/* How It Works Section */}
          <div>
            <h2 className="text-4xl font-bold mb-8 text-white">
              How It Works
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="text-3xl">1️⃣</span>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Set Your Goals</h3>
                  <p className="text-white/80">Whether it's getting stronger, leaner, or more confident, we tailor a plan for you.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-3xl">2️⃣</span>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Train with Us</h3>
                  <p className="text-white/80">Personalized coaching and programs that fit your lifestyle.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-3xl">3️⃣</span>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Elevate Your Style</h3>
                  <p className="text-white/80">Fitness meets fashion with our exclusive apparel.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
