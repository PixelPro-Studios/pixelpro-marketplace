"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Save, X } from "lucide-react";
import { updateOrder } from "@/lib/actions/orders";

interface OrderItem {
  id: string;
  service_id: string;
  quantity: number;
  service: {
    id: string;
    name: string;
    original_price: number;
    bows_price: number;
  };
}

interface Order {
  id: string;
  reference_number: string;
  status: string;
  salesperson: string | null;
  total_original_price: number;
  total_bows_price: number;
  total_savings: number;
  order_items: OrderItem[];
}

interface Service {
  id: string;
  name: string;
  original_price: number;
  bows_price: number;
}

interface OrderEditFormProps {
  order: Order;
  services: Service[];
  showButtons?: boolean;
}

const SALESPEOPLE = [
  'Caleb',
  'Deanna',
  'Jia Ni',
  'Jia Yao',
  'Karen',
  'Jovin',
  'Zi Qi',
  'Lukas'
];

export function OrderEditForm({ order, services, showButtons = true }: OrderEditFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [salesperson, setSalesperson] = useState(order.salesperson || '');
  const [items, setItems] = useState(order.order_items);
  const [customBowsPrice, setCustomBowsPrice] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Listen for submit event from external button
  useEffect(() => {
    const handleExternalSubmit = () => {
      handleSubmit();
    };

    window.addEventListener("orderEditSubmit", handleExternalSubmit);
    return () => {
      window.removeEventListener("orderEditSubmit", handleExternalSubmit);
    };
  }, [status, salesperson, items, customBowsPrice]); // Re-create listener when form data changes

  // Calculate totals
  const calculateTotals = (orderItems: OrderItem[]) => {
    let totalOriginal = 0;
    let totalBows = 0;

    orderItems.forEach((item) => {
      totalOriginal += item.service.original_price * item.quantity;
      totalBows += item.service.bows_price * item.quantity;
    });

    return {
      totalOriginal,
      totalBows,
      totalSavings: totalOriginal - totalBows,
    };
  };

  const calculatedTotals = calculateTotals(items);
  const finalBowsPrice = customBowsPrice !== null ? customBowsPrice : calculatedTotals.totalBows;
  const totals = {
    ...calculatedTotals,
    totalBows: finalBowsPrice,
    totalSavings: calculatedTotals.totalOriginal - finalBowsPrice,
  };

  // Update quantity
  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item
  const removeItem = (itemId: string) => {
    if (items.length === 1) {
      setError("Order must have at least one item");
      return;
    }
    setItems(items.filter((item) => item.id !== itemId));
  };

  // Add new service
  const addService = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    if (!service) return;

    // Check if service already exists in order
    const existingItem = items.find((item) => item.service_id === serviceId);
    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + 1);
      return;
    }

    // Add new item with temporary ID
    const newItem: OrderItem = {
      id: `temp-${Date.now()}`,
      service_id: service.id,
      quantity: 1,
      service: {
        id: service.id,
        name: service.name,
        original_price: service.original_price,
        bows_price: service.bows_price,
      },
    };

    setItems([...items, newItem]);
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await updateOrder(order.id, {
        status,
        salesperson: salesperson || null,
        items: items.map((item) => ({
          id: item.id.startsWith("temp-") ? undefined : item.id,
          service_id: item.service_id,
          quantity: item.quantity,
        })),
        total_original_price: totals.totalOriginal,
        total_bows_price: totals.totalBows,
        total_savings: totals.totalSavings,
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/orders");
          router.refresh();
        }, 1500);
      } else {
        setError(result.error || "Failed to update order");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Status */}
      <Card>
        <CardHeader>
          <CardTitle>Order Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 bg-brand-charcoal border border-brand-graphite rounded-lg focus:outline-none focus:border-brand-off-white"
              >
                <option value="pending_payment">Pending Payment</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Salesperson</label>
              <select
                value={salesperson}
                onChange={(e) => setSalesperson(e.target.value)}
                className="w-full px-4 py-2 bg-brand-charcoal border border-brand-graphite rounded-lg focus:outline-none focus:border-brand-off-white"
              >
                <option value="">Select salesperson...</option>
                {SALESPEOPLE.map((person) => (
                  <option key={person} value={person}>
                    {person}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Order Items</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 pb-4 border-b border-brand-graphite last:border-0"
            >
              <div className="flex-1">
                <h4 className="font-semibold mb-1">{item.service.name}</h4>
                <p className="text-sm text-brand-platinum">
                  ${item.service.bows_price.toFixed(2)} each
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </Button>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.id, parseInt(e.target.value) || 1)
                  }
                  className="w-16 text-center"
                  min="1"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </Button>
              </div>
              <div className="text-right w-24">
                <p className="text-brand-silver line-through text-sm">
                  ${(item.service.original_price * item.quantity).toFixed(2)}
                </p>
                <p className="text-green-500 font-bold">
                  ${(item.service.bows_price * item.quantity).toFixed(2)}
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeItem(item.id)}
                disabled={items.length === 1}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          {/* Add Service Dropdown */}
          <div className="pt-4 border-t border-brand-graphite">
            <label className="block text-sm font-medium mb-2">
              Add Service
            </label>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  addService(e.target.value);
                  e.target.value = "";
                }
              }}
              className="w-full px-4 py-2 bg-brand-charcoal border border-brand-graphite rounded-lg focus:outline-none focus:border-brand-off-white"
              defaultValue=""
            >
              <option value="" disabled>
                Select a service to add...
              </option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - ${service.bows_price.toFixed(2)}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Order Totals */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-brand-platinum">
                <span>Original Total:</span>
                <span className="line-through">
                  ${totals.totalOriginal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-brand-platinum">
                <span>Calculated BOWS Price:</span>
                <span>${calculatedTotals.totalBows.toFixed(2)}</span>
              </div>
            </div>

            {/* Custom Price Editor */}
            <div className="pt-3 border-t border-brand-graphite">
              <label className="block text-sm font-medium mb-2">
                Final BOWS Price (Optional Override)
              </label>
              <div className="flex gap-2 items-center">
                <span className="text-brand-platinum">$</span>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={customBowsPrice !== null ? customBowsPrice : ""}
                  onChange={(e) =>
                    setCustomBowsPrice(
                      e.target.value ? parseFloat(e.target.value) : null
                    )
                  }
                  placeholder={calculatedTotals.totalBows.toFixed(2)}
                  className="flex-1"
                />
                {customBowsPrice !== null && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCustomBowsPrice(null)}
                  >
                    Reset
                  </Button>
                )}
              </div>
              <p className="text-xs text-brand-platinum mt-1">
                Leave empty to use calculated price, or enter custom amount for discounts/adjustments
              </p>
            </div>

            <div className="pt-3 border-t border-brand-graphite space-y-2">
              <div className="flex justify-between text-green-500 font-bold text-lg">
                <span>Final BOWS Price:</span>
                <span>${totals.totalBows.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Savings:</span>
                <span className="text-green-500 font-semibold">
                  ${totals.totalSavings.toFixed(2)}
                </span>
              </div>
              {customBowsPrice !== null && (
                <div className="p-2 bg-yellow-600/10 border border-yellow-600 rounded text-xs text-yellow-500">
                  Custom price applied: ${(calculatedTotals.totalBows - customBowsPrice).toFixed(2)} adjustment
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error/Success Messages */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-600/10 border border-green-600 rounded-lg">
          <p className="text-green-500">Order updated successfully! Redirecting...</p>
        </div>
      )}

      {/* Action Buttons */}
      {showButtons && (
        <div className="flex gap-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1"
            size="lg"
          >
            {isSubmitting ? (
              "Saving..."
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push("/admin/orders")}
            disabled={isSubmitting}
            size="lg"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
