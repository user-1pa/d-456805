
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNav(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!showNav) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav animate-header-reveal">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-white">
          4ortune Fitness
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/shop" className="text-white/90 hover:text-white transition-colors">
            Shop
          </Link>
          <Link to="/services" className="text-white/90 hover:text-white transition-colors">
            Services
          </Link>
          <Link to="/media" className="text-white/90 hover:text-white transition-colors">
            Media
          </Link>
          <Link to="/testimonials" className="text-white/90 hover:text-white transition-colors">
            Testimonials
          </Link>
          <Link to="/about" className="text-white/90 hover:text-white transition-colors">
            About Us
          </Link>
          <Link to="/contact" className="text-white/90 hover:text-white transition-colors">
            Contact Us
          </Link>
        </div>
        <Button className="bg-mint hover:bg-mint-light text-forest font-medium">
          Get started
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
