
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
      <div className="grid md:grid-cols-3 gap-8 text-center container mx-auto py-20 px-4">
        <div className="space-y-2">
          <p className="text-4xl font-bold text-white">95%</p>
          <p className="text-white/80">Placement Rate</p>
        </div>
        <div className="space-y-2">
          <p className="text-4xl font-bold text-white">48hrs</p>
          <p className="text-white/80">Average Response Time</p>
        </div>
        <div className="space-y-2">
          <p className="text-4xl font-bold text-white">10k+</p>
          <p className="text-white/80">Companies Trust Us</p>
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
