"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createLead } from "@/lib/actions/leads";
import type { ContactFormData } from "@/types";

const contactSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number must be 8 digits"),
  eventDate: z.string().optional(),
});

export default function ContactPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createLead(data);

      if (result.success && result.data) {
        // Store lead ID in session storage
        sessionStorage.setItem("leadId", result.data.id);
        router.push("/booking/services");
      } else {
        setError(result.error || "Failed to save contact information");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Progress currentStep={1} totalSteps={3} steps={["Contact", "Services", "Review"]} />

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Let us know how to reach you. We'll use this to send your quote and booking details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              id="fullName"
              label="Full Name *"
              placeholder="John Doe"
              error={errors.fullName?.message}
              {...register("fullName")}
            />

            <Input
              id="email"
              label="Email Address *"
              type="email"
              placeholder="john@example.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              id="phone"
              label="Phone Number *"
              type="tel"
              placeholder="9123 4567"
              error={errors.phone?.message}
              {...register("phone")}
            />

            <Input
              id="eventDate"
              label="Event Date (Optional)"
              type="date"
              error={errors.eventDate?.message}
              {...register("eventDate")}
            />

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Continue to Services"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
