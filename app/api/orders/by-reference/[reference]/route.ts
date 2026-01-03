import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reference: string }> }
) {
  try {
    const { reference } = await params;
    const supabase = await createClient();

    const { data: order, error } = await supabase
      .from("orders")
      .select("id, reference_number")
      .eq("reference_number", reference)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
