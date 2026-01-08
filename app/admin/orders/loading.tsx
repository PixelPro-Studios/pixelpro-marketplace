import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function OrdersLoading() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Orders</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="h-6 w-24 bg-brand-graphite animate-pulse rounded" />
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
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-brand-graphite">
                    <td className="py-3 px-4">
                      <div className="h-5 w-32 bg-brand-graphite animate-pulse rounded" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-brand-graphite animate-pulse rounded" />
                        <div className="h-3 w-40 bg-brand-graphite animate-pulse rounded" />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 w-24 bg-brand-graphite animate-pulse rounded" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-5 w-20 bg-brand-graphite animate-pulse rounded" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-6 w-24 bg-brand-graphite animate-pulse rounded" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 w-28 bg-brand-graphite animate-pulse rounded" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-3">
                        <div className="h-4 w-4 bg-brand-graphite animate-pulse rounded" />
                        <div className="h-4 w-4 bg-brand-graphite animate-pulse rounded" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
