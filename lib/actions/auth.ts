"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(email: string, password: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Check if user is an admin
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (!adminUser) {
      await supabase.auth.signOut();
      return { success: false, error: "Unauthorized: Admin access only" };
    }

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Failed to login" };
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
