import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";

interface CartIconProps {
  className?: string;
}

const CartIcon: React.FC<CartIconProps> = ({ className }) => {
  const { itemCount } = useCart();
  const navigate = useNavigate();
  
  return (
    <button 
      className={`relative ${className || ""}`}
      onClick={() => navigate("/cart")}
      aria-label={`Cart with ${itemCount} items`}
    >
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <Badge className="absolute -top-2 -right-2 bg-mint text-forest w-5 h-5 p-0 flex items-center justify-center rounded-full text-xs font-bold">
          {itemCount > 99 ? '99+' : itemCount}
        </Badge>
      )}
    </button>
  );
};

export default CartIcon;
