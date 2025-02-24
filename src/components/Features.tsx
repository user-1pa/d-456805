
import React from "react";
import { Star, Award, ShieldCheck } from "lucide-react";

const Features = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Why 4ortune Fitness Section */}
          <div>
            <h2 className="text-4xl font-bold mb-8 text-white">
              Why 4ortune Fitness?
            </h2>
            <p className="text-white/80 mb-8">
              We're a rising fitness brand built on passion, dedication, and results. Here's why people are joining us:
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="text-3xl">💪</span>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Committed to Your Growth</h3>
                  <p className="text-white/80">We're here to support you every step of the way.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-3xl">⏳</span>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Personalized Training & Apparel</h3>
                  <p className="text-white/80">Designed for those ready to push their limits.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-3xl">🚀</span>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">A Growing Community</h3>
                  <p className="text-white/80">Be part of something bigger—your journey starts here.</p>
                </div>
              </div>
            </div>
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
