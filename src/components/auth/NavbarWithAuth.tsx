import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart, User, SunMoon, Search, LogOut, Heart, Package } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NavbarWithAuth = () => {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { user, profile, isAuthenticated, signOut } = useAuth();
  const [showNav, setShowNav] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNav(true);
    }, 1000); // Reduced wait time for better UX

    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/');
    }
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!profile || !profile.full_name) return "U";
    
    const nameParts = profile.full_name.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <>
      {/* Initial Logo Animation */}
      {!showNav && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="text-4xl font-bold text-white animate-logo-reveal">
            4ortune Fitness
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      {showNav && (
        <nav className="fixed top-0 left-0 right-0 z-50 animate-header-reveal">
          <div className="glass-nav">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={toggleMenu}
                  className="p-2 rounded-lg border border-blue-500"
                  aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6 text-white" />
                  ) : (
                    <Menu className="h-6 w-6 text-white" />
                  )}
                </button>
                <button
                  onClick={toggleSearch}
                  className="p-2 rounded-lg border border-blue-500"
                  aria-label="Search"
                >
                  <Search className="h-6 w-6 text-white" />
                </button>
              </div>

              <Link to="/" className="text-2xl font-bold text-white absolute left-1/2 -translate-x-1/2">
                4ortune Fitness
              </Link>

              <div className="flex items-center gap-4">
                <Link to="/cart" className="relative">
                  <ShoppingCart className="h-6 w-6 text-white" />
                  {itemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-mint text-forest w-5 h-5 p-0 flex items-center justify-center rounded-full text-xs font-bold">
                      {itemCount > 99 ? '99+' : itemCount}
                    </Badge>
                  )}
                </Link>

                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="focus:outline-none" aria-label="User menu">
                        <Avatar className="h-8 w-8 border border-mint">
                          <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "User"} />
                          <AvatarFallback className="bg-mint text-forest">
                            {getInitials()}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        {profile?.full_name ? profile.full_name : 'My Account'}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/orders')}>
                        <Package className="mr-2 h-4 w-4" />
                        <span>Orders</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/wishlist')}>
                        <Heart className="mr-2 h-4 w-4" />
                        <span>Wishlist</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link to="/login">
                    <User className="h-6 w-6 text-white" />
                  </Link>
                )}
              </div>
            </div>

            {/* Search Bar */}
            {isSearchOpen && (
              <div className="container mx-auto px-4 py-4 border-t border-blue-500">
                <input
                  type="search"
                  placeholder="Search products..."
                  className="w-full p-2 rounded-lg bg-brand text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
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
                
                {isAuthenticated ? (
                  <>
                    <div className="pt-4 border-t border-gray-700">
                      <div className="text-xl text-white opacity-70 mb-4">My Account</div>
                      <Link to="/profile" className="block text-xl text-white pl-4 py-2">
                        Profile
                      </Link>
                      <Link to="/orders" className="block text-xl text-white pl-4 py-2">
                        Orders
                      </Link>
                      <Link to="/wishlist" className="block text-xl text-white pl-4 py-2">
                        Wishlist
                      </Link>
                      <button 
                        onClick={handleSignOut}
                        className="block text-xl text-white pl-4 py-2 w-full text-left"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block text-2xl text-white">
                      Sign In
                    </Link>
                    <Link to="/register" className="block text-2xl text-white">
                      Create Account
                    </Link>
                  </>
                )}
                
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
      )}
    </>
  );
};

export default NavbarWithAuth;
