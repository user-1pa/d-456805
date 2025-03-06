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
            
            {/* Order Summary */}
            {!orderComplete && (
              <div className="bg-brand-accent p-6 rounded-lg h-fit sticky top-8">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-2 mb-6">
                  {cart.items.map((item, index) => {
                    // Calculate item price (accounting for discounts)
                    const itemPrice = item.product.discount
                      ? item.product.price * (1 - item.product.discount / 100)
                      : item.product.price;
                      
                    return (
                      <div 
                        key={`${item.product.id}-${item.size}-${item.color}-${index}`}
                        className="flex justify-between items-center"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img 
                              src={item.product.images[0]} 
                              alt={item.product.name} 
                              className="w-12 h-12 object-cover rounded"
                            />
                            <span className="absolute -top-2 -right-2 bg-mint text-forest w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="line-clamp-1 text-sm">
                            {item.product.name}
                          </div>
                        </div>
                        <div className="font-medium">
                          ${(itemPrice * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="border-t border-brand pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${cart.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    {formData.shippingMethod === "express" ? (
                      <span>$15.99</span>
                    ) : (
                      cart.shipping === 0 ? (
                        <span className="text-mint">Free</span>
                      ) : (
                        <span>${cart.shipping.toFixed(2)}</span>
                      )
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${cart.tax.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="border-t border-brand mt-4 pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${(
                      cart.subtotal + 
                      (formData.shippingMethod === "express" ? 15.99 : cart.shipping) + 
                      cart.tax
                    ).toFixed(2)}</span>
                  </div>
                </div>
                
                {currentStep === "payment" && (
                  <div className="mt-6 p-4 bg-brand rounded-lg border border-mint/30">
                    <div className="flex items-center text-mint mb-2">
                      <ShieldCheck className="h-5 w-5 mr-2" />
                      <span className="font-medium">Secure Checkout</span>
                    </div>
                    <p className="text-sm text-text-muted">
                      Your payment information is encrypted and secure. We never store your full card details.
                    </p>
                  </div>
                )}
              </div>
            )}
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
                        <Label htmlFor="country">Country *</Label>
                        <Input
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleReturnToCart}
                        className="border-text-muted text-text-muted hover:text-white hover:border-white"
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Return to cart
                      </Button>
                      <Button type="submit" className="bg-mint hover:bg-mint/90 text-forest font-medium">
                        Continue to shipping
                      </Button>
                    </div>
                  </form>
                </div>
              )}
              
              {currentStep === "shipping" && (
                <div className="bg-brand-accent p-6 rounded-lg">
                  <h2 className="text-xl font-bold mb-4">Shipping Method</h2>
                  <form onSubmit={handleContinue}>
                    <div className="space-y-4 mb-6">
                      <RadioGroup 
                        value={formData.shippingMethod} 
                        onValueChange={(value) => handleShippingMethodChange(value as any)}
                        className="space-y-4"
                      >
                        <div className="flex items-center space-x-2 border border-text-muted rounded-lg p-4 cursor-pointer hover:border-white transition-colors">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label 
                            htmlFor="standard"
                            className="flex flex-1 justify-between cursor-pointer"
                          >
                            <div>
                              <div className="font-medium">Standard Shipping</div>
                              <div className="text-sm text-text-muted">Delivery in 3-5 business days</div>
                            </div>
                            <div className="font-medium">
                              {cart.subtotal > 50 ? "Free" : `${cart.shipping.toFixed(2)}`}
                            </div>
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2 border border-text-muted rounded-lg p-4 cursor-pointer hover:border-white transition-colors">
                          <RadioGroupItem value="express" id="express" />
                          <Label 
                            htmlFor="express"
                            className="flex flex-1 justify-between cursor-pointer"
                          >
                            <div>
                              <div className="font-medium">Express Shipping</div>
                              <div className="text-sm text-text-muted">Delivery in 1-2 business days</div>
                            </div>
                            <div className="font-medium">$15.99</div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => goToStep("information")}
                        className="border-text-muted text-text-muted hover:text-white hover:border-white"
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Return to information
                      </Button>
                      <Button type="submit" className="bg-mint hover:bg-mint/90 text-forest font-medium">
                        Continue to payment
                      </Button>
                    </div>
                  </form>
                </div>
              )}
              
              {currentStep === "payment" && (
                <div className="bg-brand-accent p-6 rounded-lg">
                  <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                  <form onSubmit={handleContinue}>
                    <div className="space-y-4 mb-6">
                      <Tabs 
                        value={formData.paymentMethod} 
                        onValueChange={(value) => handlePaymentMethodChange(value as any)}
                        className="w-full"
                      >
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                          <TabsTrigger value="credit_card" className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Credit Card
                          </TabsTrigger>
                          <TabsTrigger value="paypal" className="flex items-center gap-2">
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9.2 7.61v5.46H7.6c-.11 0-.2-.09-.2-.2V7.61c0-.11.09-.2.2-.2h1.4c.11 0 .2.09.2.2zm5-1.05c-.77-.4-1.9-.79-3.2-.79H6c-.33 0-.6.28-.6.6v8.23c0 .32.27.6.6.6h1.65l-.17.86c-.03.17.1.33.28.33h1.87c.2 0 .38-.15.41-.34l.17-.85h.9l-.17.85c-.04.19.1.34.28.34h1.87c.2 0 .38-.15.41-.34l.17-.85H15c.32 0 .6-.28.6-.6V9.01c0-1.01-.8-1.97-1.4-2.45zm-4.34 7.13H8.39c-.11 0-.2-.09-.2-.2V7.61c0-.11.09-.2.2-.2h1.47c1.22 0 2.14.48 2.14 1.74 0 1.26-.92 2.54-2.14 2.54z"/>
                              <path d="M19.14 5.25c-.77-.4-1.9-.79-3.2-.79h-5c-.33 0-.6.28-.6.6v8.23c0 .32.27.6.6.6h1.65l-.17.86c-.03.17.1.33.28.33h1.87c.2 0 .38-.15.41-.34l.17-.85h.9l-.17.85c-.04.19.1.34.28.34h1.87c.2 0 .38-.15.41-.34l.17-.85H21c.32 0 .6-.28.6-.6V6.65c0-1.01-.8-1.81-2.46-1.4zm-1.49 4.11c0 1.26-.92 2.54-2.14 2.54H14.04c-.11 0-.2-.09-.2-.2V5.25c0-.11.09-.2.2-.2h1.47c1.22 0 2.14.48 2.14 1.74v2.57z"/>
                            </svg>
                            PayPal
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="credit_card" className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardName">Name on card *</Label>
                            <Input
                              id="cardName"
                              name="cardName"
                              value={formData.cardName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber">Card number *</Label>
                            <div className="relative">
                              <Input
                                id="cardNumber"
                                name="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                value={formData.cardNumber}
                                onChange={handleInputChange}
                                required
                              />
                              <CreditCardIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="cardExpiry">Expiry date *</Label>
                              <Input
                                id="cardExpiry"
                                name="cardExpiry"
                                placeholder="MM/YY"
                                value={formData.cardExpiry}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cardCvc">CVC *</Label>
                              <Input
                                id="cardCvc"
                                name="cardCvc"
                                placeholder="123"
                                value={formData.cardCvc}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center mt-4 text-sm text-text-muted">
                            <ShieldCheck className="h-4 w-4 mr-2" />
                            Your payment information is encrypted and secure.
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="paypal" className="space-y-4">
                          <div className="p-6 text-center rounded-lg border border-dashed border-text-muted">
                            <p className="text-text-muted mb-4">You'll be redirected to PayPal to complete your purchase securely.</p>
                            <div className="flex justify-center mb-4">
                              <svg className="h-10 w-auto" viewBox="0 0 124 33" fill="currentColor">
                                <path d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.97-1.142-2.694-1.746-4.985-1.746zM47 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.469 1.044.332 1.906zM66.654 13.075h-3.275a.57.57 0 0 0-.563.481l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.561-.658zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317zM84.096 13.075h-3.291a.954.954 0 0 0-.787.417l-4.539 6.686-1.924-6.425a.953.953 0 0 0-.912-.678h-3.234a.57.57 0 0 0-.541.754l3.625 10.638-3.408 4.811a.57.57 0 0 0 .465.9h3.287a.949.949 0 0 0 .781-.408l10.946-15.8a.57.57 0 0 0-.468-.895z" fill="#253B80"/>
                                <path d="M94.992 6.749h-6.84a.95.95 0 0 0-.938.802l-2.766 17.537a.569.569 0 0 0 .562.658h3.51a.665.665 0 0 0 .656-.562l.785-4.971a.95.95 0 0 1 .938-.803h2.164c4.506 0 7.105-2.18 7.785-6.5.307-1.89.012-3.375-.873-4.415-.971-1.142-2.694-1.746-4.983-1.746zm.789 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.725-4.583a.568.568 0 0 1 .562-.481h.473c1.234 0 2.4 0 3.002.704.359.42.468 1.044.331 1.906zM115.434 13.075h-3.273a.567.567 0 0 0-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.031 1 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .564.66h2.949a.95.95 0 0 0 .938-.803l1.771-11.209a.571.571 0 0 0-.565-.658zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.391-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.501.589.699 1.411.554 2.317zM119.295 7.23l-2.807 17.858a.569.569 0 0 0 .562.658h2.822c.469 0 .867-.34.939-.803l2.768-17.536a.57.57 0 0 0-.562-.659h-3.16a.571.571 0 0 0-.562.482z" fill="#179BD7"/>
                                <path d="M7.266 29.154l.523-3.322-1.165-.027H1.061L4.927 1.292a.316.316 0 0 1 .314-.268h9.38c3.114 0 5.263.648 6.385 1.927.526.6.861 1.227 1.023 1.917.17.724.173 1.589.007 2.644l-.012.077v.676l.526.298a3.69 3.69 0 0 1 1.065.812c.45.513.741 1.165.864 1.938.127.795.085 1.741-.123 2.812-.24 1.232-.628 2.305-1.152 3.183a6.547 6.547 0 0 1-1.825 2c-.696.494-1.523.869-2.458 1.109-.906.236-1.939.355-3.072.355h-.73c-.522 0-1.029.188-1.427.525a2.21 2.21 0 0 0-.744 1.328l-.055.299-.924 5.855-.042.215c-.011.068-.03.102-.058.125a.155.155 0 0 1-.096.035z" fill="#253B80"/>
                                <path d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.326c-.661 0-1.218.48-1.321 1.132L6.596 26.83l-.399 2.533a.704.704 0 0 0 .695.814h4.881c.578 0 1.069-.42 1.16-.99l.048-.248.919-5.832.059-.32c.09-.572.582-.992 1.16-.992h.73c4.729 0 8.431-1.92 9.513-7.476.452-2.321.218-4.259-.978-5.622a4.667 4.667 0 0 0-1.336-1.03z" fill="#179BD7"/>
                                <path d="M21.754 7.151a9.757 9.757 0 0 0-1.203-.267 15.284 15.284 0 0 0-2.426-.177h-7.352a1.172 1.172 0 0 0-1.159.992L8.05 17.605l-.045.289a1.336 1.336 0 0 1 1.321-1.132h2.752c5.405 0 9.637-2.195 10.874-8.545.037-.188.068-.371.096-.55a6.594 6.594 0 0 0-1.017-.429 9.045 9.045 0 0 0-.277-.087z" fill="#222D65"/>
                                <path d="M9.614 7.699a1.169 1.169 0 0 1 1.159-.991h7.352c.871 0 1.684.057 2.426.177a9.757 9.757 0 0 1 1.481.353c.365.121.704.264 1.017.429.368-2.347-.003-3.945-1.272-5.392C20.378.682 17.853 0 14.622 0h-9.38c-.66 0-1.223.48-1.325 1.133L.01 25.898a.806.806 0 0 0 .795.932h5.791l1.454-9.225 1.564-9.906z" fill="#253B80"/>
                              </svg>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => goToStep("shipping")}
                        className="border-text-muted text-text-muted hover:text-white hover:border-white"
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Return to shipping
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-mint hover:bg-mint/90 text-forest font-medium"
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Complete order"}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
              
              {currentStep === "confirmation" && orderComplete && (
                <div className="bg-brand-accent p-6 rounded-lg text-center">
                  <div className="flex justify-center mb-6">
                    <div className="bg-mint/20 p-4 rounded-full">
                      <CheckCircle2 className="h-16 w-16 text-mint" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Thank you for your order!</h2>
                  <p className="text-text-muted mb-6">Your order has been placed and is being processed. You will receive an email confirmation shortly.</p>
                  <p className="font-medium mb-8">Order #: {Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}</p>
                  <Button 
                    onClick={handleContinueShopping}
                    className="bg-mint hover:bg-mint/90 text-forest font-medium px-8"
                  >
                    Continue Shopping
                  </Button>
                </div>
              )}
            </div>
                        <Label htmlFor="address">Address *</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                        <Input
                          id="apartment"
                          name="apartment"
                          value={formData.apartment}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State/Province *</Label>
                          <Input
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">ZIP Code *</Label>
                          <Input
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      
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
