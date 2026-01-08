"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types";

interface ServiceModalProps {
  service: Service;
  addons: Service[];
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (service: Service, addons: { service: Service; quantity: number }[]) => void;
}

export function ServiceModal({ service, addons, isOpen, onClose, onAddToCart }: ServiceModalProps) {
  const [selectedAddons, setSelectedAddons] = useState<Record<string, number>>({});

  if (!isOpen) return null;

  // Filter add-ons based on service type for photography
  const filteredAddons = addons.filter((addon) => {
    if (service.category !== 'photography') return true;

    const serviceName = service.name;
    const addonName = addon.name;

    // ROM packages - only show ROM Additional Hours
    if (serviceName.includes('ROM')) {
      return addonName.includes('ROM Photography Additional');
    }

    // Pre-Wedding packages - only show Pre-Wedding Additional Hours
    if (serviceName.includes('Pre-Wedding')) {
      return addonName.includes('Pre-Wedding Photography Additional');
    }

    // Actual Day packages (Essential/Signature/Premium Day Coverage) - only show Actual Day addons
    if (serviceName.includes('Day Coverage')) {
      return addonName.includes('Actual Day Photography Additional');
    }

    return false;
  });

  const handleAddonQuantityChange = (addonId: string, delta: number) => {
    setSelectedAddons((prev) => {
      const current = prev[addonId] || 0;
      const newQty = Math.max(0, current + delta);
      if (newQty === 0) {
        const { [addonId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [addonId]: newQty };
    });
  };

  const handleAddToCart = () => {
    const addonsList = Object.entries(selectedAddons).map(([addonId, quantity]) => ({
      service: addons.find((a) => a.id === addonId)!,
      quantity,
    }));
    onAddToCart(service, addonsList);
    setSelectedAddons({});
    onClose();
  };

  const totalPrice = service.bows_price +
    Object.entries(selectedAddons).reduce((sum, [addonId, qty]) => {
      const addon = addons.find((a) => a.id === addonId);
      return sum + (addon?.bows_price || 0) * qty;
    }, 0);

  const savings = service.original_price - service.bows_price;
  const savingsPercent = Math.round((savings / service.original_price) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-brand-charcoal rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-brand-graphite">
        {/* Header */}
        <div className="sticky top-0 bg-brand-charcoal border-b border-brand-graphite p-4 flex items-center justify-between z-10">
          <h2 className="font-display text-2xl font-bold">{service.name}</h2>
          <button
            onClick={onClose}
            className="text-brand-platinum hover:text-brand-off-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image */}
          <div className="relative aspect-square bg-brand-graphite rounded-lg overflow-hidden mb-6">
            <Image
              src={service.image_url}
              alt={service.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Pricing */}
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-brand-silver line-through text-sm">
                ${service.original_price.toFixed(2)}
              </p>
              <p className="text-green-500 text-3xl font-bold">
                ${service.bows_price.toFixed(2)}
              </p>
            </div>
            <span className="bg-green-600 text-white text-sm px-3 py-1 rounded">
              Save {savingsPercent}%
            </span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Package Details</h3>
            <p className="text-brand-platinum whitespace-pre-line">{service.description}</p>
          </div>

          {/* Add-ons */}
          {filteredAddons.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4">Add-Ons</h3>
              <div className="space-y-3">
                {filteredAddons.map((addon) => (
                  <div
                    key={addon.id}
                    className="flex items-center justify-between p-4 bg-brand-graphite rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{addon.name}</h4>
                      <p className="text-sm text-brand-platinum">{addon.description}</p>
                      <p className="text-green-500 font-semibold mt-1">
                        ${addon.bows_price.toFixed(2)}
                        {addon.addon_price_per_unit && ' per unit'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleAddonQuantityChange(addon.id, -1)}
                        disabled={!selectedAddons[addon.id]}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-semibold">
                        {selectedAddons[addon.id] || 0}
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleAddonQuantityChange(addon.id, 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total */}
          {Object.keys(selectedAddons).length > 0 && (
            <div className="border-t border-brand-graphite pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-green-500">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleAddToCart} className="flex-1">
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
