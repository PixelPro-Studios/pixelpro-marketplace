"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, CheckCircle, XCircle, SwitchCamera } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

export default function ScanPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const router = useRouter();

  useEffect(() => {
    let isActive = true;
    let scanner: Html5Qrcode | null = null;

    const initScanner = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (!isActive) return;

        if (devices && devices.length > 0) {
          setCameras(devices);

          const newScanner = new Html5Qrcode("qr-reader");
          scanner = newScanner;
          scannerRef.current = newScanner;

          await startScanning(newScanner, devices[0].id);
          
          if (!isActive) {
            await newScanner.stop();
            newScanner.clear();
          }
        } else {
          setError("No cameras found on this device");
        }
      } catch (err) {
        if (isActive) {
          console.error("Error initializing scanner:", err);
          setError("Failed to access camera");
        }
      }
    };

    initScanner();

    return () => {
      isActive = false;
      if (scanner) {
        scanner.stop()
          .then(() => scanner?.clear())
          .catch((err) => console.debug("Scanner cleanup error:", err));
      }
    };
  }, []);

  const startScanning = async (scanner: Html5Qrcode, cameraId: string) => {
    try {
      await scanner.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0, // Added aspectRatio
        },
        (decodedText: string) => { // Added type annotation
          console.log("QR Code detected:", decodedText);

          // Extract reference number from URL or direct reference
          let referenceNumber = decodedText;

          if (decodedText.includes("/booking/confirmation/")) {
            const parts = decodedText.split("/");
            referenceNumber = parts[parts.length - 1];
          }

          // Show success message
          setSuccess(`Order ${referenceNumber} found! Redirecting...`);
          setError(null);

          // Stop scanning
          scanner.stop().catch(console.error);
          setIsScanning(false);

          // Fetch order by reference number and redirect to edit page
          fetchOrderByReference(referenceNumber);
        },
        (errorMessage: string) => { // Added type annotation
          // Scanning errors are normal, don't show them
          console.debug("QR scan error:", errorMessage);
        }
      );
      setIsScanning(true);
    } catch (err) {
      console.error("Error starting scanner:", err);
      setError("Failed to start camera");
    }
  };

  const switchCamera = async () => {
    if (!scannerRef.current || cameras.length <= 1) return;

    try {
      // Stop current scanning
      if (isScanning) {
        await scannerRef.current.stop();
        setIsScanning(false);
      }

      // Switch to next camera
      const nextIndex = (currentCameraIndex + 1) % cameras.length;
      setCurrentCameraIndex(nextIndex);

      // Start scanning with new camera
      await startScanning(scannerRef.current, cameras[nextIndex].id);
    } catch (err) {
      console.error("Error switching camera:", err);
      setError("Failed to switch camera");
    }
  };

  const fetchOrderByReference = async (referenceNumber: string) => {
    try {
      const response = await fetch(`/api/orders/by-reference/${referenceNumber}`);
      const data = await response.json();

      if (data.success && data.order) {
        setTimeout(() => {
          router.push(`/admin/orders/${data.order.id}`);
        }, 1000);
      } else {
        setError("Order not found");
        setSuccess(null);
      }
    } catch (err) {
      setError("Failed to fetch order");
      setSuccess(null);
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Scan QR Code</h1>
        <p className="text-brand-platinum">
          Scan an order confirmation QR code to quickly access and edit the order
        </p>
      </div>

      <div className="grid gap-6">
        {/* Scanner Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Camera Scanner
            </CardTitle>
            {cameras.length > 1 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={switchCamera}
                disabled={!isScanning}
                className="flex items-center gap-2"
              >
                <SwitchCamera className="w-4 h-4" />
                Switch Camera
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div id="qr-reader" className="w-full"></div>

              <div className="text-sm text-brand-platinum text-center space-y-2">
                <p className="font-medium">How to use:</p>
                <ol className="text-left space-y-1 max-w-md mx-auto">
                  <li>1. Camera will start automatically</li>
                  <li>2. Point your camera at the order QR code</li>
                  <li>3. Wait for automatic detection</li>
                  <li>4. You'll be redirected to the order edit page</li>
                  {cameras.length > 1 && (
                    <li>5. Use "Switch Camera" button to change cameras</li>
                  )}
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Messages */}
        {success && (
          <Card className="border-green-600 bg-green-600/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <p className="text-green-500 font-medium">{success}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-red-600 bg-red-600/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                <p className="text-red-500 font-medium">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="bg-blue-600/10 border-blue-600">
          <CardContent className="pt-6">
            <div className="space-y-2 text-sm">
              <p className="font-medium text-blue-400">💡 Tip</p>
              <p className="text-brand-platinum">
                This scanner works with QR codes from order confirmation pages.
                Customers can show their QR code at the cashier for quick order lookup and payment processing.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
