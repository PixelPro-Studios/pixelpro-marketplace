import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Users, DollarSign, TrendingUp } from "lucide-react";
import { SalespersonLeaderboard } from "@/components/admin/salesperson-leaderboard";
import { HourlySalesChart } from "@/components/admin/hourly-sales-chart";
import { toSingaporeTime } from "@/lib/utils/timezone";

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

  // Get all orders for calculations
  const { data: allOrders } = await supabase
    .from("orders")
    .select("total_bows_price, deposit_amount, salesperson, created_at, status");

  // Calculate total deposit collected (from all orders)
  const totalDepositCollected = allOrders?.reduce((sum, order) => sum + Number(order.deposit_amount || 0), 0) || 0;

  // Calculate total estimated revenue (total_bows_price from all non-cancelled orders)
  const totalEstimatedRevenue = allOrders?.reduce((sum, order) => {
    if (order.status !== 'cancelled') {
      return sum + Number(order.total_bows_price);
    }
    return sum;
  }, 0) || 0;

  // Get paid orders for charts
  const paidOrders = allOrders?.filter(order => order.status === "paid") || [];

  // Calculate sales by salesperson
  const salesBySalesperson: Record<string, { sales: number; revenue: number }> = {};

  paidOrders?.forEach((order) => {
    const salesperson = order.salesperson || "Unassigned";
    if (!salesBySalesperson[salesperson]) {
      salesBySalesperson[salesperson] = { sales: 0, revenue: 0 };
    }
    salesBySalesperson[salesperson].sales += 1;
    salesBySalesperson[salesperson].revenue += Number(order.total_bows_price);
  });

  const salespersonData = Object.entries(salesBySalesperson).map(([name, data]) => ({
    name,
    value: data.revenue,
    sales: data.sales,
  }));

  // Calculate sales by hour (Singapore time)
  const salesByHour: Record<string, { sales: number; revenue: number }> = {};

  paidOrders?.forEach((order) => {
    const sgTime = toSingaporeTime(order.created_at);
    const hour = sgTime.getHours();
    const hourLabel = `${hour.toString().padStart(2, '0')}:00`;
    if (!salesByHour[hourLabel]) {
      salesByHour[hourLabel] = { sales: 0, revenue: 0 };
    }
    salesByHour[hourLabel].sales += 1;
    salesByHour[hourLabel].revenue += Number(order.total_bows_price);
  });

  // Create array for all 24 hours
  const hourlyData = Array.from({ length: 24 }, (_, i) => {
    const hourLabel = `${i.toString().padStart(2, '0')}:00`;
    return {
      hour: hourLabel,
      sales: salesByHour[hourLabel]?.revenue || 0,
      orders: salesByHour[hourLabel]?.sales || 0,
    };
  });

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
    totalDepositCollected,
    totalEstimatedRevenue,
    recentOrders: recentOrders || [],
    salespersonData,
    hourlyData,
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
              Total Deposit Collected
            </CardTitle>
            <DollarSign className="w-4 h-4 text-brand-platinum" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalDepositCollected.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-brand-platinum">
              Total Estimated Revenue
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-brand-platinum" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalEstimatedRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Sales Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <SalespersonLeaderboard data={stats.salespersonData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <HourlySalesChart data={stats.hourlyData} />
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

