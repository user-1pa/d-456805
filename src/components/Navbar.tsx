
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart, User, SunMoon } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const Navbar = () => {
  const [showNav, setShowNav] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (!showNav) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-nav">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={toggleMenu}
            className="p-2 rounded-lg border border-blue-500"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>

          <Link to="/" className="text-2xl font-bold text-white absolute left-1/2 -translate-x-1/2">
            4ortune Fitness
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/cart">
              <ShoppingCart className="h-6 w-6 text-white" />
            </Link>
            <Link to="/profile">
              <User className="h-6 w-6 text-white" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="glass-nav min-h-screen px-4 py-8">
          <div className="space-y-8">
            <Link to="/shop" className="block text-2xl text-white">
              Shop
            </Link>
            <Link to="/services" className="block text-2xl text-white">
              Services
            </Link>
            <Link to="/events" className="block text-2xl text-white">
              Events
            </Link>
            <Link to="/media" className="block text-2xl text-white">
              Media
            </Link>
            <Link to="/testimonials" className="block text-2xl text-white">
              Testimonials
            </Link>
            <Link to="/about" className="block text-2xl text-white">
              About Us
            </Link>
            <Link to="/contact" className="block text-2xl text-white">
              Contact
            </Link>
            <div className="flex items-center gap-4 text-2xl text-white">
              Theme
              <div className="flex items-center gap-2">
                <SunMoon className={`h-5 w-5 text-white transition-transform ${isDark ? 'rotate-180' : 'rotate-0'}`} />
                <Switch checked={isDark} onCheckedChange={toggleTheme} />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
