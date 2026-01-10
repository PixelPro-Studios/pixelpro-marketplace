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
  original_price: number;
  bows_price: number;
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
  deposit_percentage: number;
  deposit_amount: number;
  amount_paid: number;
  balance_due: number;
  remarks?: string;
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
  'Darrvin',
  'Deanna',
  'Jia Ni',
  'Jia Yao',
  'Jovin',
  'Karen',
  'Lukas',
  'Nicole',
  'Zi Qi'
];

export function OrderEditForm({ order, services, showButtons = true }: OrderEditFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [salesperson, setSalesperson] = useState(order.salesperson || '');
  const [items, setItems] = useState(order.order_items);

  // Check if order is paid - paid orders cannot be edited (except remarks and status)
  const isPaid = status === 'paid';

  // Check if only remarks or status have changed (allowed even when paid)
  const hasOnlyAllowedFieldsChanged = () => {
    if (!isPaid) return false;
    const remarksChanged = remarks !== (order.remarks || '');
    const statusChanged = status !== order.status;
    return remarksChanged || statusChanged;
  };

  // Check if prices have been overridden by comparing stored prices with current service prices
  const detectPriceOverride = () => {
    let totalCalculatedBows = 0;
    let hasPriceOverride = false;

    order.order_items.forEach((item) => {
      totalCalculatedBows += item.bows_price * item.quantity;

      // Check if the stored price differs from the current service price
      if (item.bows_price !== item.service.bows_price) {
        hasPriceOverride = true;
      }
    });

    // If prices were overridden or if the order total doesn't match calculated total, use the order's stored total
    if (hasPriceOverride || order.total_bows_price !== totalCalculatedBows) {
      return order.total_bows_price;
    }

    return null;
  };

  const [customBowsPrice, setCustomBowsPrice] = useState<number | null>(detectPriceOverride());
  const [depositPercentage, setDepositPercentage] = useState(order.deposit_percentage || 30);
  const [remarks, setRemarks] = useState(order.remarks || '');
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
  }, [status, salesperson, items, customBowsPrice, depositPercentage, remarks]); // Re-create listener when form data changes

  // Calculate totals using the order_items prices (which may have been overridden)
  const calculateTotals = (orderItems: OrderItem[]) => {
    let totalOriginal = 0;
    let totalBows = 0;

    orderItems.forEach((item) => {
      // Use the stored prices from order_items, not the service prices
      totalOriginal += item.original_price * item.quantity;
      totalBows += item.bows_price * item.quantity;
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

  // Calculate adjusted item prices when custom price is set
  const getAdjustedItemPrice = (item: OrderItem) => {
    if (customBowsPrice === null) {
      return item.bows_price;
    }
    // Proportionally adjust the item price based on the custom total
    const proportion = customBowsPrice / calculatedTotals.totalBows;
    return item.bows_price * proportion;
  };

  // Calculate deposit amount based on percentage
  const depositAmount = (totals.totalBows * depositPercentage) / 100;

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
      original_price: service.original_price,
      bows_price: service.bows_price,
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
          original_price: item.original_price,
          bows_price: getAdjustedItemPrice(item),
        })),
        total_original_price: totals.totalOriginal,
        total_bows_price: totals.totalBows,
        total_savings: totals.totalSavings,
        deposit_percentage: depositPercentage,
        amount_paid: depositAmount,
        remarks: remarks,
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
    <div className="space-y-6 relative">
      {/* Paid Order Notice */}
      {isPaid && (
        <div className="p-4 bg-green-600/10 border border-green-600 rounded-lg">
          <p className="text-green-500 font-semibold">
            ✓ This order has been marked as paid. Only status and remarks can be edited.
          </p>
        </div>
      )}

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-brand-charcoal p-8 rounded-xl border border-brand-graphite">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-brand-graphite border-t-brand-off-white rounded-full animate-spin" />
              <p className="text-lg font-medium">Updating order...</p>
            </div>
          </div>
        </div>
      )}

      {/* Order Status */}
      <Card>
        <CardHeader>
          <CardTitle>Order Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
                  disabled={isPaid}
                  className="w-full px-4 py-2 bg-brand-charcoal border border-brand-graphite rounded-lg focus:outline-none focus:border-brand-off-white disabled:opacity-50 disabled:cursor-not-allowed"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Deposit Percentage (%)
                </label>
                <Input
                  type="number"
                  value={depositPercentage}
                  onChange={(e) => setDepositPercentage(Number(e.target.value))}
                  min={0}
                  max={100}
                  step={1}
                  disabled={isPaid}
                  className="w-full"
                />
                <p className="text-xs text-brand-platinum mt-1">
                  Deposit: ${((totals.totalBows * depositPercentage) / 100).toFixed(2)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Amount Paid ($)
                </label>
                <div className="w-full px-4 py-2 bg-brand-graphite border border-brand-graphite rounded-lg text-brand-platinum">
                  ${depositAmount.toFixed(2)}
                </div>
                <p className="text-xs text-brand-platinum mt-1">
                  Balance: ${(totals.totalBows - depositAmount).toFixed(2)}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Remarks</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
                placeholder="Internal notes for this order..."
                className="w-full px-4 py-2 bg-brand-charcoal border border-brand-graphite rounded-lg focus:outline-none focus:border-brand-off-white resize-none"
              />
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
                  ${getAdjustedItemPrice(item).toFixed(2)} each
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1 || isPaid}
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
                  disabled={isPaid}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={isPaid}
                >
                  +
                </Button>
              </div>
              <div className="text-right w-24">
                <p className="text-brand-silver line-through text-sm">
                  ${(item.original_price * item.quantity).toFixed(2)}
                </p>
                <p className="text-green-500 font-bold">
                  ${(getAdjustedItemPrice(item) * item.quantity).toFixed(2)}
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeItem(item.id)}
                disabled={items.length === 1 || isPaid}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          {/* Add Service Dropdown */}
          {!isPaid && (
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
          )}
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
                  disabled={isPaid}
                />
                {customBowsPrice !== null && !isPaid && (
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
                {isPaid
                  ? "Order is paid and cannot be modified"
                  : "Leave empty to use calculated price, or enter custom amount for discounts/adjustments"
                }
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
            disabled={isSubmitting || (isPaid && !hasOnlyAllowedFieldsChanged())}
            className="flex-1"
            size="lg"
          >
            {isSubmitting ? (
              "Saving..."
            ) : isPaid && !hasOnlyAllowedFieldsChanged() ? (
              "Order Paid - Cannot Edit"
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
            {isPaid ? "Close" : "Cancel"}
          </Button>
        </div>
      )}
    </div>
  );
}
