// Database Types
export type ServiceCategory =
  | "sound"
  | "led-walls"
  | "dj"
  | "emerging-band"
  | "seasoned-band"
  | "chinese-ensemble"
  | "emcee"
  | "stage-lighting"
  | "photobooth"
  | "photography";
export type OrderStatus = "pending_payment" | "paid" | "bundle_requested" | "cancelled";

export interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  original_price: number;
  bows_price: number;
  image_url: string;
  video_url?: string;
  is_active: boolean;
  display_order: number;
  is_addon?: boolean;
  parent_service_id?: string | null;
  addon_price_per_unit?: number | null;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  event_date?: string;
  source: string;
  created_at: string;
}

export interface Order {
  id: string;
  lead_id: string;
  reference_number: string;
  salesperson?: string | null;
  total_original_price: number;
  total_bows_price: number;
  total_savings: number;
  deposit_percentage: number;
  deposit_amount: number;
  amount_paid: number;
  balance_due: number;
  status: OrderStatus;
  payment_method?: string;
  notes?: string;
  remarks?: string;
  invoice_sent_at?: string | null;
  invoice_sent_count?: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  service_id: string;
  quantity: number;
  original_price: number;
  bows_price: number;
  created_at: string;
}

export interface OrderWithDetails extends Order {
  lead: Lead;
  order_items: (OrderItem & { service: Service })[];
}

// Cart Types
export interface CartItem {
  service: Service;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (service: Service, quantity?: number) => void;
  removeItem: (serviceId: string) => void;
  updateQuantity: (serviceId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalOriginalPrice: () => number;
  getTotalBowsPrice: () => number;
  getTotalSavings: () => number;
}

// Form Types
export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  eventDate?: string;
}

export interface CreateOrderData {
  leadId: string;
  items: Array<{ serviceId: string; quantity: number }>;
  requestBundle: boolean;
}
