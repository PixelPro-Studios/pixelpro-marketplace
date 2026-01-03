"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getActiveServices } from "@/lib/actions/services";
import { useCartStore } from "@/lib/stores/cart";
import type { Service, ServiceCategory } from "@/types";
import { ShoppingCart, Plus, Minus } from "lucide-react";

const categories: { value: ServiceCategory | "all"; label: string }[] = [
  { value: "all", label: "All Services" },
  { value: "photobooth", label: "Photobooth" },
  { value: "videography", label: "Videography" },
  { value: "addon", label: "Add-ons" },
];

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | "all">("all");
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);

  const { items, addItem, updateQuantity, getTotalBowsPrice } = useCartStore();

  useEffect(() => {
    // Check if user completed contact form
    const leadId = sessionStorage.getItem("leadId");
    if (!leadId) {
      router.push("/booking/contact");
      return;
    }

    loadServices();
  }, [router]);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredServices(services);
    } else {
      setFilteredServices(services.filter((s) => s.category === selectedCategory));
    }
  }, [selectedCategory, services]);

  const loadServices = async () => {
    setLoading(true);
    const result = await getActiveServices();
    if (result.success && result.data) {
      setServices(result.data);
      setFilteredServices(result.data);
    }
    setLoading(false);
  };

  const getItemQuantity = (serviceId: string) => {
    const item = items.find((i) => i.service.id === serviceId);
    return item?.quantity || 0;
  };

  const handleAddToCart = (service: Service) => {
    addItem(service, 1);
  };

  const handleQuantityChange = (serviceId: string, delta: number) => {
    const currentQty = getItemQuantity(serviceId);
    updateQuantity(serviceId, currentQty + delta);
  };

  const handleContinue = () => {
    if (items.length === 0) {
      alert("Please add at least one service to your cart");
      return;
    }
    router.push("/booking/cart");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-shimmer">Loading services...</div>
      </div>
    );
  }

  return (
    <>
      <Progress currentStep={2} totalSteps={3} steps={["Contact", "Services", "Review"]} />

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.value
                ? "bg-brand-off-white text-brand-black"
                : "bg-brand-charcoal text-brand-platinum hover:bg-brand-graphite"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
        {filteredServices.map((service) => {
          const quantity = getItemQuantity(service.id);
          const savings = service.original_price - service.bows_price;
          const savingsPercent = Math.round((savings / service.original_price) * 100);

          return (
            <Card key={service.id} className="overflow-hidden">
              <div className="relative h-48 bg-brand-graphite">
                <Image
                  src={service.image_url}
                  alt={service.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display text-xl font-semibold">{service.name}</h3>
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                    Save {savingsPercent}%
                  </span>
                </div>
                <p className="text-brand-platinum text-sm mb-4">{service.description}</p>
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-brand-silver line-through text-sm">
                      ${service.original_price.toFixed(2)}
                    </p>
                    <p className="text-green-500 text-2xl font-bold">
                      ${service.bows_price.toFixed(2)}
                    </p>
                  </div>
                </div>

                {quantity === 0 ? (
                  <Button onClick={() => handleAddToCart(service)} className="w-full">
                    Add to Cart
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleQuantityChange(service.id, -1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="flex-1 text-center font-semibold">{quantity} in cart</span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleQuantityChange(service.id, 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Floating Cart Widget */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-brand-charcoal border-t border-brand-graphite p-4 z-50">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6" />
              <div>
                <p className="text-sm text-brand-platinum">{items.length} items</p>
                <p className="font-display text-xl font-bold">
                  ${getTotalBowsPrice().toFixed(2)}
                </p>
              </div>
            </div>
            <Button onClick={handleContinue} size="lg">
              Continue to Cart
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
