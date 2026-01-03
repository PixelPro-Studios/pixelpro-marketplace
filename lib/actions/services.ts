"use server";

import { createClient } from "@/lib/supabase/server";

export async function getActiveServices() {
  try {
    const supabase = await createClient();

    const { data: services, error } = await supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching services:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: services };
  } catch (error) {
    console.error("Unexpected error fetching services:", error);
    return { success: false, error: "Failed to fetch services" };
  }
}

export async function getServiceById(id: string) {
  try {
    const supabase = await createClient();

    const { data: service, error } = await supabase
      .from("services")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching service:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: service };
  } catch (error) {
    console.error("Unexpected error fetching service:", error);
    return { success: false, error: "Failed to fetch service" };
  }
}
