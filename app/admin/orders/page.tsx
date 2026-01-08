"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SendInvoiceButton } from "@/components/admin/send-invoice-button";
import { Pencil, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { formatSingaporeDate } from "@/lib/utils/timezone";
import { createClient } from "@/lib/supabase/client";

const ITEMS_PER_PAGE = 10;

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchQuery, orders]);

  const loadOrders = async () => {
    setLoading(true);
    const supabase = createClient();

    const { data } = await supabase
      .from("orders")
      .select(`
        *,
        lead:leads(full_name, email, phone)
      `)
      .order("created_at", { ascending: false });

    setOrders(data || []);
    setFilteredOrders(data || []);
    setLoading(false);
  };

  const filterOrders = () => {
    if (!searchQuery.trim()) {
      setFilteredOrders(orders);
      setCurrentPage(1);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = orders.filter((order) => {
      return (
        order.reference_number?.toLowerCase().includes(query) ||
        order.lead?.full_name?.toLowerCase().includes(query) ||
        order.lead?.email?.toLowerCase().includes(query) ||
        order.lead?.phone?.toLowerCase().includes(query) ||
        order.salesperson?.toLowerCase().includes(query)
      );
    });

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">Orders</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-brand-graphite border-t-brand-off-white rounded-full animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Orders</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>All Orders</CardTitle>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-platinum" />
              <Input
                type="text"
                placeholder="Search by reference, name, email, phone, or salesperson..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
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
                {currentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-brand-platinum">
                      {searchQuery ? "No orders found matching your search" : "No orders found"}
                    </td>
                  </tr>
                ) : (
                  currentOrders.map((order: any) => (
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
                        {formatSingaporeDate(order.created_at)}
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
                            invoiceSentAt={order.invoice_sent_at}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-brand-graphite">
              <div className="text-sm text-brand-platinum">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredOrders.length)} of{" "}
                {filteredOrders.length} orders
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "secondary"}
                          size="sm"
                          onClick={() => goToPage(page)}
                          className="min-w-[40px]"
                        >
                          {page}
                        </Button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="px-2 text-brand-platinum">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
