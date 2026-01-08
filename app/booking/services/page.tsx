"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getActiveServices } from "@/lib/actions/services";
import { useCartStore } from "@/lib/stores/cart";
import { ServiceModal } from "@/components/booking/service-modal";
import type { Service, ServiceCategory } from "@/types";
import { ShoppingCart, Plus, Minus, ChevronDown } from "lucide-react";

const categories: { value: ServiceCategory | "all"; label: string }[] = [
  { value: "all", label: "All Services" },
  { value: "sound", label: "Sound System" },
  { value: "led-walls", label: "LED Walls" },
  { value: "dj", label: "Wedding DJ" },
  { value: "seasoned-band", label: "Seasoned Wedding Band" },
  { value: "chinese-ensemble", label: "Chinese Ensemble" },
  { value: "emcee", label: "Wedding Emcee" },
  { value: "stage-lighting", label: "Stage Lighting" },
  { value: "photobooth", label: "Photobooth" },
  { value: "photography", label: "Photography" },
];

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | "all">("all");
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
      // Filter out add-ons and emerging-band category when showing all services
      setFilteredServices(services.filter((s) => !s.is_addon && s.category !== "emerging-band"));
    } else {
      // Filter by category and exclude add-ons
      setFilteredServices(services.filter((s) => s.category === selectedCategory && !s.is_addon));
    }
  }, [selectedCategory, services]);

  const loadServices = async () => {
    setLoading(true);
    const result = await getActiveServices();
    if (result.success && result.data) {
      setServices(result.data);
      setFilteredServices(result.data.filter((s) => !s.is_addon && s.category !== "emerging-band"));
    }
    setLoading(false);
  };

  const getItemQuantity = (serviceId: string) => {
    const item = items.find((i) => i.service.id === serviceId);
    return item?.quantity || 0;
  };

  const getServiceAddons = (service: Service) => {
    return services.filter((s) => s.is_addon && s.category === service.category);
  };

  const handleServiceClick = (service: Service) => {
    const addons = getServiceAddons(service);
    if (addons.length > 0) {
      setSelectedService(service);
    } else {
      addItem(service, 1);
    }
  };

  const handleAddToCartWithAddons = (service: Service, addons: { service: Service; quantity: number }[]) => {
    addItem(service, 1);
    addons.forEach(({ service: addon, quantity }) => {
      if (quantity > 0) {
        addItem(addon, quantity);
      }
    });
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

  const selectedCategoryLabel = categories.find((c) => c.value === selectedCategory)?.label || "All Services";

  const getCategoryLabel = (category: ServiceCategory) => {
    return categories.find((c) => c.value === category)?.label || category;
  };

  return (
    <>
      <Progress currentStep={2} totalSteps={3} steps={["Contact", "Services", "Review"]} />

      {/* Category Dropdown */}
      <div className="mb-6 relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full md:w-64 px-4 py-3 bg-brand-charcoal border border-brand-graphite rounded-lg flex items-center justify-between hover:bg-brand-graphite transition-colors"
        >
          <span className="font-medium">{selectedCategoryLabel}</span>
          <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {dropdownOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setDropdownOpen(false)}
            />

            {/* Dropdown Menu */}
            <div className="absolute top-full left-0 mt-2 w-full md:w-64 bg-brand-charcoal border border-brand-graphite rounded-lg shadow-xl z-20 max-h-96 overflow-y-auto">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setSelectedCategory(cat.value);
                    setDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-brand-graphite transition-colors ${
                    selectedCategory === cat.value
                      ? "bg-brand-graphite text-brand-off-white font-semibold"
                      : "text-brand-platinum"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
        {filteredServices.map((service) => {
          const quantity = getItemQuantity(service.id);
          const savings = service.original_price - service.bows_price;
          const savingsPercent = Math.round((savings / service.original_price) * 100);
          const hasAddons = getServiceAddons(service).length > 0;

          return (
            <Card key={service.id} className="overflow-hidden">
              <div className="relative aspect-square bg-brand-graphite rounded-t-lg overflow-hidden">
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
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-semibold">{service.name}</h3>
                    <span className="inline-block mt-1 text-xs text-brand-silver">
                      {getCategoryLabel(service.category)}
                    </span>
                  </div>
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded flex-shrink-0">
                    Save {savingsPercent}%
                  </span>
                </div>
                <p className="text-brand-platinum text-sm mb-4 line-clamp-2">
                  {service.description.split('\n')[0]}
                </p>
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

                <div className="flex gap-2">
                  <Button
                    onClick={() => setSelectedService(service)}
                    variant="secondary"
                    className="flex-1"
                  >
                    View Details
                  </Button>
                  {quantity === 0 ? (
                    <Button
                      onClick={() => handleServiceClick(service)}
                      className="flex-1"
                    >
                      Add to Cart
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 flex-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleQuantityChange(service.id, -1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="flex-1 text-center font-semibold text-sm">{quantity}</span>
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
              </div>
            </Card>
          );
        })}
      </div>

      {/* Service Modal */}
      {selectedService && (
        <ServiceModal
          service={selectedService}
          addons={getServiceAddons(selectedService)}
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          onAddToCart={handleAddToCartWithAddons}
        />
      )}

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
