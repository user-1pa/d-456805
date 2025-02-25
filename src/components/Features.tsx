
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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

            {/* Call to Action Section */}
            <div className="mt-12 space-y-6">
              <h2 className="text-3xl font-bold text-white">Take the First Step Today</h2>
              <p className="text-white/80">
                💪 Ready to transform your fitness journey? Whether you're starting fresh or leveling up, we're here to help.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🔹</span>
                  <p className="text-white/80">Get a Free Consultation – Personalized advice from our expert trainers.</p>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🔹</span>
                  <p className="text-white/80">Shop Our Apparel – Gear up with high-performance activewear.</p>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🔹</span>
                  <p className="text-white/80">Join the Community – Connect with like-minded individuals.</p>
                </div>
              </div>
              <Link to="/contact">
                <Button className="bg-mint hover:bg-mint/90 text-forest font-medium">
                  Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
