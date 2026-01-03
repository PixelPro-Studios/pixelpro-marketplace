"use server";

import { createClient } from "@/lib/supabase/server";
import type { ContactFormData } from "@/types";

export async function createLead(data: ContactFormData) {
  try {
    const supabase = await createClient();

    const { data: lead, error } = await supabase
      .from("leads")
      .insert({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        event_type: data.eventType || null,
        event_date: data.eventDate || null,
        source: "bows_qr",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating lead:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: lead };
  } catch (error) {
    console.error("Unexpected error creating lead:", error);
    return { success: false, error: "Failed to create lead" };
  }
}
