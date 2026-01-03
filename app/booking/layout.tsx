export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">PixelPro Studios</h1>
          <p className="text-brand-platinum">BOWS Event Booking</p>
        </div>
        {children}
      </div>
    </div>
  );
}
