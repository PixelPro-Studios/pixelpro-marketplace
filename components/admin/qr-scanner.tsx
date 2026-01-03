"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, X, Camera } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

export function QRScanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const router = useRouter();

  useEffect(() => {
    let isActive = true;
    let html5QrCode: Html5Qrcode | null = null;

    if (isOpen) {
      const startScanner = async () => {
        try {
          const scanner = new Html5Qrcode("qr-reader");
          html5QrCode = scanner;
          scannerRef.current = scanner;

          await scanner.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              aspectRatio: 1.0,
            },
            (decodedText: string) => {
              console.log("QR Code detected:", decodedText);
              let referenceNumber = decodedText;
              if (decodedText.includes("/booking/confirmation/")) {
                const parts = decodedText.split("/");
                referenceNumber = parts[parts.length - 1];
              }
              fetchOrderByReference(referenceNumber);
            },
            (errorMessage: string) => {
              // Scanning errors are normal
              console.debug("QR scan error:", errorMessage);
            }
          );

          if (!isActive) {
            await scanner.stop();
            scanner.clear();
          }
        } catch (err: any) {
          if (isActive) {
            console.error("Failed to start scanner:", err);
            setError("Failed to access camera. Please check permissions.");
          }
        }
      };

      startScanner();
    }

    return () => {
      isActive = false;
      if (html5QrCode) {
        html5QrCode
          .stop()
          .then(() => {
            html5QrCode?.clear();
          })
          .catch((err) => {
            // Scanner might not have been running, which is fine
            console.debug("Scanner stop error on cleanup:", err);
            html5QrCode?.clear();
          });
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
    } catch (err: any) {
      setError("Failed to fetch order");
      console.error(err);
    }
  };

  const handleClose = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        // Scanner might not have been running
        console.debug("Scanner stop error on close:", err);
      }
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
