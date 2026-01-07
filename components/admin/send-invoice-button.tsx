"use client";

import { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";
import { sendInvoice } from "@/lib/actions/invoices";

interface SendInvoiceButtonProps {
  orderId: string;
  referenceNumber: string;
  invoiceSentAt?: string | null;
}

export function SendInvoiceButton({ orderId, referenceNumber, invoiceSentAt }: SendInvoiceButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [hasSent, setHasSent] = useState(!!invoiceSentAt);

  const handleSendInvoice = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await sendInvoice(orderId);

      if (result.success) {
        setHasSent(true);
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
      <button
        onClick={handleSendInvoice}
        disabled={isLoading}
        className={`transition-colors disabled:opacity-50 ${
          hasSent
            ? "text-green-500 hover:text-green-400"
            : "text-blue-500 hover:text-blue-400"
        }`}
        title={hasSent ? "Resend invoice email" : "Send invoice email"}
      >
        {hasSent ? (
          <CheckCircle className={`w-4 h-4 ${isLoading ? 'animate-pulse' : ''}`} />
        ) : (
          <Mail className={`w-4 h-4 ${isLoading ? 'animate-pulse' : ''}`} />
        )}
      </button>

      {message && (
        <div
          className={`absolute top-full mt-2 right-0 z-10 px-3 py-1 rounded text-xs whitespace-nowrap ${
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
