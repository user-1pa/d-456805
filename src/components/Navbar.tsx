
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const Navbar = () => {
  const [showNav, setShowNav] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNav(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

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
          <Link to="/events" className="text-white/90 hover:text-white transition-colors">
            Events
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
        <div className="flex items-center gap-2">
          <Sun className="h-5 w-5 text-white" />
          <Switch checked={isDark} onCheckedChange={toggleTheme} />
          <Moon className="h-5 w-5 text-white" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
