"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, X, Camera } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";

export function QRScanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && !scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false
      );

      scanner.render(
        (decodedText) => {
          // QR code contains the reference number
          console.log("QR Code detected:", decodedText);

          // Extract reference number from URL or direct reference
          let referenceNumber = decodedText;

          // If it's a URL, extract the reference number
          if (decodedText.includes("/booking/confirmation/")) {
            const parts = decodedText.split("/");
            referenceNumber = parts[parts.length - 1];
          }

          // Fetch order by reference number and redirect to edit page
          fetchOrderByReference(referenceNumber);
        },
        (errorMessage) => {
          // Scanning errors are normal, don't show them
          console.debug("QR scan error:", errorMessage);
        }
      );

      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, [isOpen]);

  const fetchOrderByReference = async (referenceNumber: string) => {
    try {
      const response = await fetch(`/api/orders/by-reference/${referenceNumber}`);
      const data = await response.json();

      if (data.success && data.order) {
        // Redirect to edit page
        router.push(`/admin/orders/${data.order.id}`);
        setIsOpen(false);
      } else {
        setError("Order not found");
      }
    } catch (err) {
      setError("Failed to fetch order");
      console.error(err);
    }
  };

  const handleClose = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
      scannerRef.current = null;
    }
    setIsOpen(false);
    setError(null);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="gap-2"
        size="lg"
      >
        <QrCode className="w-5 h-5" />
        Scan QR Code
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Scan Order QR Code
            </CardTitle>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div id="qr-reader" className="w-full"></div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500 rounded-lg">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            <div className="text-sm text-brand-platinum text-center">
              <p>Point your camera at the order confirmation QR code</p>
              <p className="mt-1 text-xs">The order will open automatically when detected</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
