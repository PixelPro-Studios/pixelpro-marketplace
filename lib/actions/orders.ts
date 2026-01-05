"use server";

import { createClient } from "@/lib/supabase/server";
import type { CreateOrderData } from "@/types";
import { getSingaporeTime } from "@/lib/utils/timezone";

function generateReferenceNumber(): string {
  const date = getSingaporeTime();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  return `BOWS-${year}${month}${day}-${random}`;
}

export async function createOrder(data: CreateOrderData) {
  try {
    console.log("Creating order with data:", data);
    const supabase = await createClient();

    // Fetch service details to calculate totals
    const serviceIds = data.items.map((item) => item.serviceId);
    console.log("Fetching services:", serviceIds);

    const { data: services, error: servicesError } = await supabase
      .from("services")
      .select("*")
      .in("id", serviceIds);

    if (servicesError || !services) {
      console.error("Error fetching services:", servicesError);
      return { success: false, error: "Failed to fetch services" };
    }

    console.log("Services fetched:", services.length);

    // Calculate totals
    let totalOriginalPrice = 0;
    let totalBowsPrice = 0;

    const orderItemsData = data.items.map((item) => {
      const service = services.find((s) => s.id === item.serviceId);
      if (!service) {
        throw new Error(`Service not found: ${item.serviceId}`);
      }

      const originalPrice = service.original_price * item.quantity;
      const bowsPrice = service.bows_price * item.quantity;

      totalOriginalPrice += Number(originalPrice);
      totalBowsPrice += Number(bowsPrice);

      return {
        service_id: item.serviceId,
        quantity: item.quantity,
        original_price: service.original_price,
        bows_price: service.bows_price,
      };
    });

    const totalSavings = totalOriginalPrice - totalBowsPrice;
    const referenceNumber = generateReferenceNumber();

    // Calculate deposit (default 30%)
    const depositPercentage = 30.00;
    const depositAmount = totalBowsPrice * (depositPercentage / 100);
    const amountPaid = 0.00;
    const balanceDue = totalBowsPrice;

    console.log("Creating order with totals:", {
      totalOriginalPrice,
      totalBowsPrice,
      totalSavings,
      depositPercentage,
      depositAmount,
      referenceNumber,
    });

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        lead_id: data.leadId,
        reference_number: referenceNumber,
        total_original_price: totalOriginalPrice,
        total_bows_price: totalBowsPrice,
        total_savings: totalSavings,
        deposit_percentage: depositPercentage,
        deposit_amount: depositAmount,
        amount_paid: amountPaid,
        balance_due: balanceDue,
        status: data.requestBundle ? "bundle_requested" : "pending_payment",
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Error creating order:", orderError);
      return { success: false, error: "Failed to create order" };
    }

    console.log("Order created successfully:", order.id, order.reference_number);

    // Create order items
    const orderItemsWithOrderId = orderItemsData.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsWithOrderId);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      return { success: false, error: "Failed to create order items" };
    }

    console.log("Order items created successfully");
    console.log("Returning order data:", order);

    return { success: true, data: order };
  } catch (error) {
    console.error("Unexpected error creating order:", error);
    return { success: false, error: "Failed to create order" };
  }
}

export async function getOrderByReference(referenceNumber: string) {
  try {
    const supabase = await createClient();

    const { data: order, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        lead:leads(*),
        order_items(
          *,
          service:services(*)
        )
      `
      )
      .eq("reference_number", referenceNumber)
      .single();

    if (error) {
      console.error("Error fetching order:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: order };
  } catch (error) {
    console.error("Unexpected error fetching order:", error);
    return { success: false, error: "Failed to fetch order" };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      console.error("Error updating order status:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error updating order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}

interface UpdateOrderData {
  status: string;
  salesperson: string | null;
  items: Array<{
    id?: string;
    service_id: string;
    quantity: number;
  }>;
  total_original_price: number;
  total_bows_price: number;
  total_savings: number;
  deposit_percentage: number;
  amount_paid: number;
  remarks?: string;
}

export async function updateOrder(orderId: string, data: UpdateOrderData) {
  try {
    console.log("Updating order:", orderId, data);
    const supabase = await createClient();

    // Calculate deposit and balance
    const depositAmount = data.total_bows_price * (data.deposit_percentage / 100);
    const balanceDue = data.total_bows_price - data.amount_paid;

    // Update order totals and status
    const { error: orderError } = await supabase
      .from("orders")
      .update({
        status: data.status,
        salesperson: data.salesperson,
        total_original_price: data.total_original_price,
        total_bows_price: data.total_bows_price,
        total_savings: data.total_savings,
        deposit_percentage: data.deposit_percentage,
        deposit_amount: depositAmount,
        amount_paid: data.amount_paid,
        balance_due: balanceDue,
        remarks: data.remarks,
        updated_at: getSingaporeTime().toISOString(),
      })
      .eq("id", orderId);

    if (orderError) {
      console.error("Error updating order:", orderError);
      return { success: false, error: "Failed to update order" };
    }

    // Get existing order items
    const { data: existingItems } = await supabase
      .from("order_items")
      .select("id")
      .eq("order_id", orderId);

    const existingItemIds = existingItems?.map((item) => item.id) || [];

    // Separate new items from existing items
    const itemsToUpdate = data.items.filter((item) => item.id && !item.id.startsWith("temp-"));
    const itemsToInsert = data.items.filter((item) => !item.id || item.id.startsWith("temp-"));
    const itemIdsToKeep = itemsToUpdate.map((item) => item.id);

    // Delete items that are no longer in the order
    const itemsToDelete = existingItemIds.filter((id) => !itemIdsToKeep.includes(id));
    if (itemsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from("order_items")
        .delete()
        .in("id", itemsToDelete);

      if (deleteError) {
        console.error("Error deleting order items:", deleteError);
        return { success: false, error: "Failed to delete order items" };
      }
    }

    // Update existing items
    for (const item of itemsToUpdate) {
      // Fetch service details for pricing
      const { data: service } = await supabase
        .from("services")
        .select("original_price, bows_price")
        .eq("id", item.service_id)
        .single();

      const { error: updateError } = await supabase
        .from("order_items")
        .update({
          quantity: item.quantity,
          original_price: service?.original_price,
          bows_price: service?.bows_price,
        })
        .eq("id", item.id);

      if (updateError) {
        console.error("Error updating order item:", updateError);
        return { success: false, error: "Failed to update order items" };
      }
    }

    // Insert new items
    if (itemsToInsert.length > 0) {
      const newItems = await Promise.all(
        itemsToInsert.map(async (item) => {
          const { data: service } = await supabase
            .from("services")
            .select("original_price, bows_price")
            .eq("id", item.service_id)
            .single();

          return {
            order_id: orderId,
            service_id: item.service_id,
            quantity: item.quantity,
            original_price: service?.original_price,
            bows_price: service?.bows_price,
          };
        })
      );

      const { error: insertError } = await supabase
        .from("order_items")
        .insert(newItems);

      if (insertError) {
        console.error("Error inserting order items:", insertError);
        return { success: false, error: "Failed to insert order items" };
      }
    }

    console.log("Order updated successfully");
    return { success: true };
  } catch (error) {
    console.error("Unexpected error updating order:", error);
    return { success: false, error: "Failed to update order" };
  }
}
