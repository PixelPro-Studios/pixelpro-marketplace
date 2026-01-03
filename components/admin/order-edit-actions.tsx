"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

interface OrderEditActionsProps {
  orderId: string;
}

export function OrderEditActions({ orderId }: OrderEditActionsProps) {
  const router = useRouter();

  const handleSave = () => {
    // Trigger form submission by dispatching a custom event
    const event = new CustomEvent("orderEditSubmit");
    window.dispatchEvent(event);
  };

  const handleCancel = () => {
    router.push("/admin/orders");
  };

  return (
    <div className="flex gap-3">
      <Button variant="secondary" onClick={handleCancel} size="lg">

        Cancel
      </Button>
      <Button onClick={handleSave} size="lg">
        Save Changes
      </Button>
    </div>
  );
}
