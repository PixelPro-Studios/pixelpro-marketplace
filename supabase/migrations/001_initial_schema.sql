-- Create enum types
CREATE TYPE service_category AS ENUM ('photobooth', 'videography', 'addon');
CREATE TYPE order_status AS ENUM ('pending_payment', 'paid', 'bundle_requested', 'cancelled');
CREATE TYPE admin_role AS ENUM ('admin', 'staff');

-- Create services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category service_category NOT NULL,
  original_price DECIMAL(10, 2) NOT NULL,
  bows_price DECIMAL(10, 2) NOT NULL,
  image_url TEXT NOT NULL,
  video_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  event_type TEXT,
  event_date DATE,
  source TEXT NOT NULL DEFAULT 'bows_qr',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  reference_number TEXT NOT NULL UNIQUE,
  total_original_price DECIMAL(10, 2) NOT NULL,
  total_bows_price DECIMAL(10, 2) NOT NULL,
  total_savings DECIMAL(10, 2) NOT NULL,
  status order_status NOT NULL DEFAULT 'pending_payment',
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL DEFAULT 1,
  original_price DECIMAL(10, 2) NOT NULL,
  bows_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role admin_role NOT NULL DEFAULT 'staff',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_is_active ON services(is_active);
CREATE INDEX idx_services_display_order ON services(display_order);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_orders_lead_id ON orders(lead_id);
CREATE INDEX idx_orders_reference_number ON orders(reference_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_service_id ON order_items(service_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for services (public read-only for active services)
CREATE POLICY "Public can view active services"
  ON services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin full access to services"
  ON services FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- RLS Policies for leads (public insert, admin read/update)
CREATE POLICY "Public can insert leads"
  ON leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin full access to leads"
  ON leads FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- RLS Policies for orders (public insert, admin full access)
CREATE POLICY "Public can insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can view their own orders"
  ON orders FOR SELECT
  USING (true);

CREATE POLICY "Admin full access to orders"
  ON orders FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- RLS Policies for order_items (public insert, admin full access)
CREATE POLICY "Public can insert order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can view order items"
  ON order_items FOR SELECT
  USING (true);

CREATE POLICY "Admin full access to order items"
  ON order_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- RLS Policies for admin_users (only admins can manage)
CREATE POLICY "Admin can view admin users"
  ON admin_users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admin can manage admin users"
  ON admin_users FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- Insert sample services (optional - for testing)
INSERT INTO services (name, description, category, original_price, bows_price, image_url, display_order) VALUES
('Classic Photobooth', 'Traditional photobooth with unlimited prints for 3 hours', 'photobooth', 499.00, 399.00, '/placeholder-photobooth.jpg', 1),
('Premium Photobooth', 'Premium photobooth with props, backdrop, and digital copies', 'photobooth', 699.00, 549.00, '/placeholder-photobooth.jpg', 2),
('Deluxe Photobooth', 'Deluxe photobooth with custom backdrop, props, and album', 'photobooth', 899.00, 699.00, '/placeholder-photobooth.jpg', 3),
('Event Videography', 'Professional videography coverage for 4 hours', 'videography', 999.00, 799.00, '/placeholder-video.jpg', 4),
('Full Day Videography', 'Full day videography with cinematic editing', 'videography', 1499.00, 1199.00, '/placeholder-video.jpg', 5),
('Highlight Reel', 'Short highlight reel of your event (2-3 minutes)', 'addon', 299.00, 249.00, '/placeholder-video.jpg', 6),
('Extra Props Pack', 'Additional themed props for photobooth', 'addon', 99.00, 79.00, '/placeholder-props.jpg', 7),
('Custom Backdrop', 'Personalized backdrop design for photobooth', 'addon', 199.00, 149.00, '/placeholder-backdrop.jpg', 8);
