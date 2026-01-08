import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminDashboardLoading() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 w-24 bg-brand-graphite animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-20 bg-brand-graphite animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-32 bg-brand-graphite animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-brand-graphite animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-brand-graphite animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-brand-graphite last:border-0"
              >
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-32 bg-brand-graphite animate-pulse rounded" />
                  <div className="h-4 w-24 bg-brand-graphite animate-pulse rounded" />
                </div>
                <div className="text-right space-y-2">
                  <div className="h-5 w-20 bg-brand-graphite animate-pulse rounded ml-auto" />
                  <div className="h-6 w-24 bg-brand-graphite animate-pulse rounded ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
