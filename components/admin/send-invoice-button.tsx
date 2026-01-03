"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { sendInvoice } from "@/lib/actions/invoices";

interface SendInvoiceButtonProps {
  orderId: string;
  referenceNumber: string;
}

export function SendInvoiceButton({ orderId, referenceNumber }: SendInvoiceButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSendInvoice = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await sendInvoice(orderId);

      if (result.success) {
        setMessage({ type: "success", text: result.message || "Invoice sent successfully" });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: "error", text: result.error || "Failed to send invoice" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="secondary"
        size="sm"
        onClick={handleSendInvoice}
        disabled={isLoading}
        className="text-sm"
      >
        {isLoading ? (
          <>
            <Mail className="w-4 h-4 mr-1 animate-pulse" />
            Sending...
          </>
        ) : (
          <>
            <Mail className="w-4 h-4 mr-1" />
            Send Invoice
          </>
        )}
      </Button>

      {message && (
        <div
          className={`absolute top-full mt-2 left-0 z-10 px-3 py-1 rounded text-xs whitespace-nowrap ${
            message.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
