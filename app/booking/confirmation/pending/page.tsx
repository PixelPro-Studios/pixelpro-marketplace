"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { createOrder } from "@/lib/actions/orders";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PendingOrderPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"processing" | "error">("processing");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processOrder = async () => {
      try {
        // Get pending order data from session
        const pendingOrderData = sessionStorage.getItem("pendingOrder");

        if (!pendingOrderData) {
          console.error("No pending order found");
          setError("No order data found. Please try again.");
          setStatus("error");
          return;
        }

        const orderData = JSON.parse(pendingOrderData);
        console.log("Processing order:", orderData);

        // Create the order
        const result = await createOrder(orderData);
        console.log("Order creation result:", result);

        if (result.success && result.data) {
          const referenceNumber = result.data.reference_number;
          console.log("Order created successfully:", referenceNumber);

          // Clear pending order and lead ID
          sessionStorage.removeItem("pendingOrder");
          sessionStorage.removeItem("leadId");

          // Redirect to actual confirmation page
          window.location.href = `/booking/confirmation/${referenceNumber}`;
        } else {
          console.error("Order creation failed:", result.error);
          setError(result.error || "Failed to create order");
          setStatus("error");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred");
        setStatus("error");
      }
    };

    processOrder();
  }, []);

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-4">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h1 className="font-display text-2xl font-bold mb-2">Order Failed</h1>
              <p className="text-brand-platinum mb-6">{error}</p>
              <div className="space-y-3">
                <Button
                  onClick={() => window.location.href = "/booking/cart"}
                  className="w-full"
                >
                  Return to Cart
                </Button>
                <Button
                  onClick={() => window.location.href = "/booking/contact"}
                  variant="secondary"
                  className="w-full"
                >
                  Start Over
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6">
              <Loader2 className="w-16 h-16 text-brand-off-white animate-spin" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-2">Processing Your Order</h1>
            <p className="text-brand-platinum mb-4">
              Please wait while we confirm your booking...
            </p>
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-brand-off-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-2 h-2 bg-brand-off-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="w-2 h-2 bg-brand-off-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
