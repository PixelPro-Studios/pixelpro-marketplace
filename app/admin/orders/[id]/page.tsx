import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderEditForm } from "@/components/admin/order-edit-form";
import { OrderEditActions } from "@/components/admin/order-edit-actions";

async function getOrder(id: string) {
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select(`
      *,
      lead:leads(*),
      order_items:order_items(
        *,
        service:services(*)
      )
    `)
    .eq("id", id)
    .single();

  return order;
}

async function getServices() {
  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("name");

  return services || [];
}

export default async function OrderEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  const services = await getServices();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Edit Order</h1>
          <p className="text-brand-platinum">
            Reference: <span className="font-mono font-semibold">{order.reference_number}</span>
          </p>
        </div>
        <OrderEditActions orderId={order.id} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Edit Form */}
        <div className="lg:col-span-2">
          <OrderEditForm order={order} services={services} showButtons={false} />
        </div>

        {/* Customer Information */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-brand-platinum mb-1">Full Name</p>
                <p className="font-medium">{order.lead.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-brand-platinum mb-1">Email</p>
                <p className="font-medium">{order.lead.email}</p>
              </div>
              <div>
                <p className="text-sm text-brand-platinum mb-1">Phone</p>
                <p className="font-medium">{order.lead.phone}</p>
              </div>
              <div>
                <p className="text-sm text-brand-platinum mb-1">Event Date</p>
                <p className="font-medium">
                  {new Date(order.lead.event_date).toLocaleDateString()}
                </p>
              </div>
              {order.lead.additional_notes && (
                <div>
                  <p className="text-sm text-brand-platinum mb-1">Notes</p>
                  <p className="text-sm">{order.lead.additional_notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-brand-platinum mb-1">Created</p>
                <p className="font-medium">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-brand-platinum mb-1">Last Updated</p>
                <p className="font-medium">
                  {new Date(order.updated_at).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
