"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/stores/cart";
import { createOrder } from "@/lib/actions/orders";
import { Trash2, Plus, Minus } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const {
    items,
    updateQuantity,
    removeItem,
    getTotalOriginalPrice,
    getTotalBowsPrice,
    getTotalSavings,
    clearCart,
  } = useCartStore();

  useEffect(() => {
    // Don't redirect if user is checking out
    if (isCheckingOut) return;

    // Check if user completed contact form
    const leadId = sessionStorage.getItem("leadId");
    if (!leadId) {
      router.push("/booking/contact");
      return;
    }

    if (items.length === 0) {
      router.push("/booking/services");
    }
  }, [items.length, router, isCheckingOut]);

  const handleCheckout = async () => {
    // Set flag to prevent useEffect from redirecting
    setIsCheckingOut(true);

    // Validate before proceeding
    const leadId = sessionStorage.getItem("leadId");
    if (!leadId) {
      router.push("/booking/contact");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty");
      setIsCheckingOut(false);
      return;
    }

    // Store order data in session for the confirmation page to process
    const orderData = {
      leadId,
      items: items.map((item) => ({
        serviceId: item.service.id,
        quantity: item.quantity,
      })),
      requestBundle: false,
    };

    sessionStorage.setItem("pendingOrder", JSON.stringify(orderData));

    // Clear cart immediately
    clearCart();

    // Redirect immediately to confirmation
    window.location.href = "/booking/confirmation/pending";
  };

  const totalOriginal = getTotalOriginalPrice();
  const totalBows = getTotalBowsPrice();
  const totalSavings = getTotalSavings();
  const depositPercentage = 30; // Default 30%
  const depositAmount = totalBows * (depositPercentage / 100);

  return (
    <>
      <Progress currentStep={3} totalSteps={3} steps={["Contact", "Services", "Reserve"]} />

      {/* Top Banner */}
      <div className="mb-6 p-4 bg-blue-600/10 border border-blue-600 rounded-lg text-center">
        <p className="text-blue-400 font-medium">
          Wedding date not confirmed yet? Reserve now and choose later.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Cart</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.service.id}
                  className="pb-4 border-b border-brand-graphite last:border-0"
                >
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-brand-graphite">
                      <Image
                        src={item.service.image_url}
                        alt={item.service.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="font-semibold text-sm sm:text-base">{item.service.name}</h3>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeItem(item.service.id)}
                          className="flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs sm:text-sm text-brand-platinum mb-2">
                        ${item.service.bows_price.toFixed(2)} each
                      </p>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => updateQuantity(item.service.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => updateQuantity(item.service.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-brand-silver line-through text-xs sm:text-sm">
                            ${(item.service.original_price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-green-500 font-bold text-base sm:text-lg">
                            ${(item.service.bows_price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-brand-platinum mb-4">Your cart is empty</p>
                  <Button onClick={() => router.push("/booking/services")}>
                    Browse Services
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-brand-platinum text-sm">
                  <span>Event Date:</span>
                  <span className="italic">TBD (to be confirmed)</span>
                </div>
                <div className="flex justify-between text-brand-platinum">
                  <span>Original Price:</span>
                  <span className="line-through">${totalOriginal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-500 font-semibold">
                  <span>BOWS Savings:</span>
                  <span>-${totalSavings.toFixed(2)}</span>
                </div>
                <div className="border-t border-brand-graphite pt-2 flex justify-between font-display text-xl font-bold">
                  <span>Total:</span>
                  <span>${totalBows.toFixed(2)}</span>
                </div>
                <div className="border-t border-brand-graphite pt-2">
                  <div className="flex justify-between text-blue-400 font-semibold">
                    <span>Pay only ${depositAmount.toFixed(2)} today</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500 rounded-lg">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}

              <Button
                onClick={handleCheckout}
                size="lg"
                className="w-full"
                disabled={isSubmitting || items.length === 0}
              >
                {isSubmitting ? "Processing..." : "Lock in BOWS deal"}
              </Button>

              <p className="text-xs text-brand-silver text-center">
                Reserve your order to proceed to cashier payment
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
