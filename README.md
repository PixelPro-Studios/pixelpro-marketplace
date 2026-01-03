# PixelPro Studios - BOWS Event Booking System

A modern, mobile-first web application for browsing and booking photobooth and videography services at BOWS events.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS with custom brand colors
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **State Management**: Zustand (for shopping cart)
- **Form Handling**: React Hook Form + Zod validation
- **UI Components**: Custom components with Lucide icons
- **Deployment**: Vercel (recommended)

## Features

### Customer Booking Flow
1. **Contact Capture** - Collect customer information (name, email, phone, event details)
2. **Service Catalog** - Browse services by category with BOWS special pricing
3. **Shopping Cart** - Add/remove services, adjust quantities
4. **Confirmation** - Generate quote with QR code and reference number

### Admin Dashboard
- **Dashboard Overview** - Key metrics and recent orders
- **Orders Management** - View and manage all orders
- **Leads Management** - Access customer contact information
- **Services Management** - Placeholder for CRUD operations
- **All Entries** - Unified view (placeholder)

## Project Structure

```
pixelpro-marketplace/
├── app/
│   ├── booking/          # Customer booking flow
│   │   ├── contact/      # Step 1: Contact form
│   │   ├── services/     # Step 2: Service catalog
│   │   ├── cart/         # Step 3: Cart review
│   │   └── confirmation/ # Step 4: Order confirmation
│   ├── admin/            # Admin dashboard
│   │   ├── login/        # Admin authentication
│   │   ├── orders/       # Orders management
│   │   ├── leads/        # Leads management
│   │   ├── services/     # Services management
│   │   └── entries/      # All entries view
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   └── ui/               # Reusable UI components
├── lib/
│   ├── actions/          # Server actions
│   ├── stores/           # Zustand stores
│   ├── supabase/         # Supabase clients
│   └── utils/            # Utility functions
├── supabase/
│   └── migrations/       # Database schema
└── types/                # TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### 1. Clone and Install

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your credentials
3. Run the database migration:
   - Go to SQL Editor in Supabase Dashboard
   - Copy the contents of `supabase/migrations/001_initial_schema.sql`
   - Run the migration

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Create Admin User

After running the database migration:

1. Go to Authentication > Users in Supabase Dashboard
2. Create a new user with email/password
3. Copy the user's UUID
4. Run this SQL in the SQL Editor:

```sql
INSERT INTO admin_users (id, email, role)
VALUES ('your-user-uuid', 'admin@pixelpro.com', 'admin');
```

### 5. Add Noise Texture

Create or add a `noise.svg` file in the `public/` directory for the background texture effect.

### 6. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Database Schema

### Tables

- **services** - Service catalog (photobooth, videography, add-ons)
- **leads** - Customer contact information
- **orders** - Order records with reference numbers
- **order_items** - Line items for each order
- **admin_users** - Admin authentication

### Sample Data

The migration includes 8 sample services. You'll need to:
1. Upload actual images to Supabase Storage
2. Update the `image_url` fields to point to your images

## Key Features Implementation

### Shopping Cart (Zustand)
- Persists to localStorage
- Add/remove/update quantities
- Calculate totals and savings

### Form Validation (Zod + React Hook Form)
- Client-side validation
- Type-safe forms
- Real-time error messages

### Server Actions
- Type-safe data mutations
- Error handling
- Reference number generation

### Authentication & Authorization
- Supabase Auth for admin users
- Middleware protection for admin routes
- Row Level Security (RLS) policies

## Customization

### Brand Colors
Edit `tailwind.config.ts` and `app/globals.css`:
- Brand Black: `#0A0A0A`
- Brand Charcoal: `#1A1A1A`
- Brand Graphite: `#3D3D3D`
- Brand Silver: `#C0C0C0`
- Brand Platinum: `#E5E5E5`
- Brand Off-White: `#FAFDFF`

### Typography
- Display Font: Montserrat (headings)
- Body Font: Inter (body text)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

Vercel will automatically:
- Install dependencies
- Build the Next.js app
- Set up preview and production deployments

### Environment Variables in Vercel

Add all variables from `.env.local` to your Vercel project settings.

## TODO / Future Enhancements

- [ ] Implement full All Entries view with filtering
- [ ] Add Services CRUD interface in admin
- [ ] Email notifications with PDF quotes
- [ ] Real-time admin notifications
- [ ] Image upload for services
- [ ] Payment integration (Stripe)
- [ ] Analytics and reporting
- [ ] Export orders to CSV
- [ ] Bulk order status updates

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Support

For issues or questions about this implementation, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

Private project for PixelPro Studios
