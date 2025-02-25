
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-20 px-4 border-t border-mint/10">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-5 gap-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">4ortune Fitness</h3>
            <p className="text-white/60 max-w-xs">
              Empowering individuals to achieve their fitness goals through personalized training and expert guidance.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-white/60 hover:text-mint transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="text-white/60 hover:text-mint transition-colors">Pricing</Link></li>
              <li><Link to="/enterprise" className="text-white/60 hover:text-mint transition-colors">Enterprise</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-white/60 hover:text-mint transition-colors">Help</Link></li>
              <li><Link to="/size-guide" className="text-white/60 hover:text-mint transition-colors">Size Guide</Link></li>
              <li><Link to="/shipping" className="text-white/60 hover:text-mint transition-colors">Shipping</Link></li>
              <li><Link to="/returns" className="text-white/60 hover:text-mint transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/order-tracker" className="text-white/60 hover:text-mint transition-colors">Order Tracker</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-white/60 hover:text-mint transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="text-white/60 hover:text-mint transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="text-white/60 hover:text-mint transition-colors">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-mint transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-mint transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-mint transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-mint transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-mint transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-mint/10 mt-16 pt-8 text-center text-white/60">
          <p>&copy; {new Date().getFullYear()} 4ortune Fitness. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
