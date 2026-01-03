import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrderByReference } from "@/lib/actions/orders";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const result = await getOrderByReference(reference);

  if (!result.success || !result.data) {
    notFound();
  }

  const order = result.data;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-brand-platinum text-lg">
          Please proceed to the cashier to complete your payment
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Reference Number with QR */}
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between p-6 bg-brand-black rounded-lg">
            <div className="flex-1">
              <p className="text-brand-silver text-sm mb-1">Reference Number</p>
              <p className="font-mono text-2xl font-bold">{order.reference_number}</p>
              <p className="text-brand-platinum text-sm mt-2">
                Show this QR code or reference number at the cashier
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG value={order.reference_number} size={120} />
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-3">Services</h3>
            <div className="space-y-2">
              {order.order_items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2 border-b border-brand-graphite last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.service.name}</p>
                    <p className="text-sm text-brand-platinum">
                      ${item.bows_price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ${(item.bows_price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="space-y-2 pt-4 border-t border-brand-graphite">
            <div className="flex justify-between text-brand-platinum">
              <span>Original Price:</span>
              <span className="line-through">${order.total_original_price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-500 font-semibold">
              <span>BOWS Savings:</span>
              <span>-${order.total_savings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-display text-2xl font-bold pt-2">
              <span>Total:</span>
              <span>${order.total_bows_price.toFixed(2)}</span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="pt-4 border-t border-brand-graphite">
            <p className="text-sm text-brand-platinum mb-1">Contact Information</p>
            <p className="font-medium">{order.lead.full_name}</p>
            <p className="text-brand-platinum">{order.lead.email}</p>
            <p className="text-brand-platinum">{order.lead.phone}</p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-4">
        <div className="bg-green-600/10 border-2 border-green-600 rounded-lg p-6 text-center">
          <p className="text-green-500 font-semibold text-lg mb-4">
            Ready to Pay at Cashier
          </p>
          <p className="text-brand-platinum mb-4">
            Show your QR code or reference number <span className="font-mono font-bold text-brand-off-white">{order.reference_number}</span> to complete payment
          </p>
          <p className="text-2xl font-bold text-brand-off-white mb-2">
            Amount Due: ${order.total_bows_price.toFixed(2)}
          </p>
          <p className="text-sm text-green-500">
            You saved ${order.total_savings.toFixed(2)} with BOWS pricing!
          </p>
        </div>

        <div className="text-center">
          <Link href="/" className="text-brand-platinum hover:text-brand-off-white text-sm">
            Return to Home
          </Link>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 p-4 bg-brand-charcoal rounded-lg">
        <p className="text-sm text-brand-platinum text-center">
          Questions? Contact PixelPro Studios staff at the event booth
          <br />
          Reference: <span className="font-mono font-semibold">{order.reference_number}</span>
        </p>
      </div>
    </div>
  );
}
