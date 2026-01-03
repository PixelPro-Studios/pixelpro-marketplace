import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Users, Package, TrendingUp } from "lucide-react";

async function getDashboardStats() {
  const supabase = await createClient();

  // Get total orders
  const { count: totalOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  // Get total leads
  const { count: totalLeads } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true });

  // Get active services
  const { count: activeServices } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  // Get total revenue (from paid orders)
  const { data: paidOrders } = await supabase
    .from("orders")
    .select("total_bows_price")
    .eq("status", "paid");

  const totalRevenue = paidOrders?.reduce((sum, order) => sum + Number(order.total_bows_price), 0) || 0;

  // Get recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select(`
      *,
      lead:leads(full_name, email)
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  return {
    totalOrders: totalOrders || 0,
    totalLeads: totalLeads || 0,
    activeServices: activeServices || 0,
    totalRevenue,
    recentOrders: recentOrders || [],
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-brand-platinum">
              Total Orders
            </CardTitle>
            <ShoppingCart className="w-4 h-4 text-brand-platinum" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-brand-platinum">
              Total Leads
            </CardTitle>
            <Users className="w-4 h-4 text-brand-platinum" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-brand-platinum">
              Active Services
            </CardTitle>
            <Package className="w-4 h-4 text-brand-platinum" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeServices}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-brand-platinum">
              Revenue (Paid)
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-brand-platinum" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentOrders.length === 0 ? (
              <p className="text-brand-platinum text-center py-8">No orders yet</p>
            ) : (
              stats.recentOrders.map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-3 border-b border-brand-graphite last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-semibold">{order.reference_number}</p>
                    <p className="text-sm text-brand-platinum">
                      {order.lead?.full_name || "Unknown"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${Number(order.total_bows_price).toFixed(2)}</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded ${
                        order.status === "paid"
                          ? "bg-green-600 text-white"
                          : order.status === "bundle_requested"
                          ? "bg-blue-600 text-white"
                          : "bg-yellow-600 text-white"
                      }`}
                    >
                      {order.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
