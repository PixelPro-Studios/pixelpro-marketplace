import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="font-display text-5xl font-bold mb-6">
          PixelPro Studios
        </h1>
        <p className="text-xl text-brand-platinum mb-8">
          Welcome to the BOWS Event Booking System
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/booking/contact"
            className="px-6 py-3 bg-brand-off-white text-brand-black font-semibold rounded-lg hover:bg-brand-platinum transition-colors"
          >
            Start Booking
          </Link>
          <Link
            href="/admin/login"
            className="px-6 py-3 border border-brand-off-white text-brand-off-white font-semibold rounded-lg hover:bg-brand-charcoal transition-colors"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
