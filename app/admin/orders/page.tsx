import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { SendInvoiceButton } from "@/components/admin/send-invoice-button";
import { Pencil } from "lucide-react";

async function getOrders() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      lead:leads(full_name, email, phone)
    `)
    .order("created_at", { ascending: false });

  return orders || [];
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Orders</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-graphite">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-brand-platinum">
                    Reference
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-brand-platinum">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-brand-platinum">
                    Salesperson
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-brand-platinum">
                    Total
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-brand-platinum">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-brand-platinum">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-brand-platinum">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-brand-platinum">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order: any) => (
                    <tr key={order.id} className="border-b border-brand-graphite last:border-0">
                      <td className="py-3 px-4">
                        <span className="font-mono font-semibold">{order.reference_number}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{order.lead?.full_name}</p>
                          <p className="text-sm text-brand-platinum">{order.lead?.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm">
                          {order.salesperson || <span className="text-brand-platinum italic">Not assigned</span>}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        ${Number(order.total_bows_price).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded ${
                            order.status === "paid"
                              ? "bg-green-600 text-white"
                              : order.status === "cancelled"
                              ? "bg-red-600 text-white"
                              : "bg-yellow-600 text-white"
                          }`}
                        >
                          {order.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-brand-platinum">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-3 items-center">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-blue-500 hover:text-blue-400 transition-colors"
                            title="Edit order"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <SendInvoiceButton
                            orderId={order.id}
                            referenceNumber={order.reference_number}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
