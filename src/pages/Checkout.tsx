import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  CreditCard, 
  ShieldCheck,
  ChevronLeft, 
  CreditCardIcon,
  CheckCircle2
} from "lucide-react";

// Define checkout step type
type CheckoutStep = "information" | "shipping" | "payment" | "confirmation";

// Define form data structure
interface CheckoutFormData {
  // Contact Information
  email: string;
  phone: string;
  
  // Shipping Information
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  
  // Shipping Method
  shippingMethod: "standard" | "express";
  
  // Payment Information
  paymentMethod: "credit_card" | "paypal";
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("information");
  const [isLoading, setIsLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  
  // Initialize form data
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    shippingMethod: "standard",
    paymentMethod: "credit_card",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: ""
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  // Handle shipping method change
  const handleShippingMethodChange = (value: "standard" | "express") => {
    setFormData(prevData => ({
      ...prevData,
      shippingMethod: value
    }));
  };
  
  // Handle payment method change
  const handlePaymentMethodChange = (value: "credit_card" | "paypal") => {
    setFormData(prevData => ({
      ...prevData,
      paymentMethod: value
    }));
  };
  
  // Navigate between steps
  const goToStep = (step: CheckoutStep) => {
    setCurrentStep(step);
  };
  
  // Handle form submission for each step
  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate current step
    if (currentStep === "information") {
      // Information validation
      if (!formData.email || !formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.state || !formData.zipCode) {
        // Show error message
        alert("Please fill in all required fields");
        return;
      }
      
      goToStep("shipping");
    } else if (currentStep === "shipping") {
      goToStep("payment");
    } else if (currentStep === "payment") {
      // Payment validation
      if (formData.paymentMethod === "credit_card") {
        if (!formData.cardName || !formData.cardNumber || !formData.cardExpiry || !formData.cardCvc) {
          // Show error message
          alert("Please fill in all card details");
          return;
        }
      }
      
      // Process payment
      processOrder();
    }
  };
  
  // Process order
  const processOrder = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setOrderComplete(true);
      goToStep("confirmation");
      clearCart();
    }, 2000);
  };
  
  // Return to cart
  const handleReturnToCart = () => {
    navigate("/cart");
  };
  
  // Continue shopping
  const handleContinueShopping = () => {
    navigate("/shop");
  };
  
  // If cart is empty and not on confirmation step, redirect to cart
  if (cart.items.length === 0 && currentStep !== "confirmation") {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow px-4 py-8">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          
          {/* Checkout Steps */}
          {!orderComplete && (
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <div 
                  className={`flex items-center ${currentStep === "information" ? "text-mint" : "text-text-muted"}`}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-current mr-2">
                    1
                  </div>
                  <span className="hidden sm:inline">Information</span>
                </div>
                <div className="flex-1 border-t border-text-muted mx-2"></div>
                <div 
                  className={`flex items-center ${currentStep === "shipping" ? "text-mint" : "text-text-muted"}`}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-current mr-2">
                    2
                  </div>
                  <span className="hidden sm:inline">Shipping</span>
                </div>
                <div className="flex-1 border-t border-text-muted mx-2"></div>
                <div 
                  className={`flex items-center ${currentStep === "payment" || currentStep === "confirmation" ? "text-mint" : "text-text-muted"}`}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-current mr-2">
                    3
                  </div>
                  <span className="hidden sm:inline">Payment</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              {currentStep === "information" && (
                <div className="bg-brand-accent p-6 rounded-lg">
                  <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                  <form onSubmit={handleContinue}>
                    <div className="space-y-4 mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email address *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                    <div className="space-y-4 mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First name *</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last name *</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
