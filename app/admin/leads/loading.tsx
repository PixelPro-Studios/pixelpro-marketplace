import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LeadsLoading() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">Leads</h1>
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
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-brand-platinum">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-brand-platinum">
                    Phone
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-brand-platinum">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...Array(10)].map((_, i) => (
                  <tr key={i} className="border-b border-brand-graphite">
                    <td className="py-3 px-4">
                      <div className="h-5 w-32 bg-brand-graphite animate-pulse rounded" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 w-40 bg-brand-graphite animate-pulse rounded" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 w-24 bg-brand-graphite animate-pulse rounded" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 w-28 bg-brand-graphite animate-pulse rounded" />
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
