
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const MobilePreview = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-white">Train Hard. Look Bold.</h2>
          <p className="text-white/80 max-w-md">
            Your fitness journey isn't complete without the right gear. 4ortune Fitness apparel is designed for performance, comfort, and style—because when you look good, you feel good.
          </p>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🔥</span>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">High-Performance Activewear</h3>
                <p className="text-white/80">Sweat-wicking, durable, and stylish.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-3xl">🏋️</span>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Designed for Movement</h3>
                <p className="text-white/80">Apparel that supports your toughest workouts.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-3xl">🛒</span>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Limited Edition Drops</h3>
                <p className="text-white/80">Don't miss out on exclusive collections!</p>
              </div>
            </div>
          </div>
          <Link to="/shop">
            <Button className="bg-mint hover:bg-mint/90 text-forest font-medium">
              Shop Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
            alt="4ortune Fitness Apparel"
            className="rounded-2xl shadow-2xl mx-auto max-w-sm object-cover aspect-[3/4]"
          />
        </div>
      </div>
    </section>
  );
};

export default MobilePreview;
