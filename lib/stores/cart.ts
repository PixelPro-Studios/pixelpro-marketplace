import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartState, Service } from "@/types";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (service: Service, quantity: number = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.service.id === service.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.service.id === service.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { service, quantity }],
          };
        });
      },

      removeItem: (serviceId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.service.id !== serviceId),
        }));
      },

      updateQuantity: (serviceId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(serviceId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.service.id === serviceId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalOriginalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.service.original_price * item.quantity,
          0
        );
      },

      getTotalBowsPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.service.bows_price * item.quantity,
          0
        );
      },

      getTotalSavings: () => {
        return get().getTotalOriginalPrice() - get().getTotalBowsPrice();
      },
    }),
    {
      name: "pixelpro-cart-storage",
    }
  )
);
