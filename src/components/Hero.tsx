
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
    mantra: "Welcome to 4ortune Fitness – Where Strength Meets Fortune",
    description: "At 4ortune Fitness, we believe that success isn't just about luck—it's about dedication, perseverance, and the right mindset. Whether you're looking to transform your body, elevate your performance, or simply embrace a healthier lifestyle, we're here to guide you every step of the way.",
    cta: "Start Your Journey"
  },
  {
    image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2",
    mantra: "Our Mission",
    description: "Our mission is simple: to empower you to unlock your full potential through expert personal training and high-quality athletic apparel. Join our community and start your journey toward strength, confidence, and success today.",
    cta: "Join Our Community"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLogo, setShowLogo] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogo(false);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  if (showLogo) {
    return (
      <div className="h-screen flex items-center justify-center bg-brand">
        <img
          src="/lovable-uploads/565b831e-8931-419e-b170-4a3757842754.png"
          alt="Brand Logo"
          className="w-96 animate-logo-reveal"
        />
      </div>
    );
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-black/50 z-10" />
          <img
            src={slide.image}
            alt={slide.mantra}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white max-w-4xl">
              {slide.mantra}
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-4xl">
              {slide.description}
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link to="/shop">
                <Button className="bg-brand-accent hover:bg-brand-accent/90 text-white font-medium px-8 py-6 text-lg">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/services">
                <Button className="bg-brand-accent hover:bg-brand-accent/90 text-white font-medium px-8 py-6 text-lg">
                  Book a Training Session <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/events">
                <Button className="bg-brand-accent hover:bg-brand-accent/90 text-white font-medium px-8 py-6 text-lg">
                  Register for an Event <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Hero;
