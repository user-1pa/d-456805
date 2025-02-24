
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Features from "@/components/Features";
import MobilePreview from "@/components/MobilePreview";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <div className="container mx-auto py-20 px-4">
        <h2 className="text-4xl font-bold mb-8 text-white text-center">
          Why 4ortune Fitness?
        </h2>
        <p className="text-white/80 mb-12 text-center max-w-3xl mx-auto">
          We're a rising fitness brand built on passion, dedication, and results. Here's why people are joining us:
        </p>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="space-y-4">
            <span className="text-3xl block">💪</span>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Committed to Your Growth</h3>
              <p className="text-white/80">We're here to support you every step of the way.</p>
            </div>
          </div>
          <div className="space-y-4">
            <span className="text-3xl block">⏳</span>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Personalized Training & Apparel</h3>
              <p className="text-white/80">Designed for those ready to push their limits.</p>
            </div>
          </div>
          <div className="space-y-4">
            <span className="text-3xl block">🚀</span>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">A Growing Community</h3>
              <p className="text-white/80">Be part of something bigger—your journey starts here.</p>
            </div>
          </div>
        </div>
      </div>
      <Features />
      <MobilePreview />
      <Testimonials />
      <Footer />
    </main>
  );
};

export default Index;
