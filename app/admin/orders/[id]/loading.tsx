import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function OrderEditLoading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Edit Order</h1>
          <div className="h-5 w-48 bg-brand-graphite animate-pulse rounded" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-brand-graphite animate-pulse rounded" />
          <div className="h-10 w-32 bg-brand-graphite animate-pulse rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Edit Form Skeleton */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="h-6 w-32 bg-brand-graphite animate-pulse rounded" />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Items Skeleton */}
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 bg-brand-graphite/30 rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="h-5 w-48 bg-brand-graphite animate-pulse rounded" />
                        <div className="h-4 w-32 bg-brand-graphite animate-pulse rounded" />
                      </div>
                      <div className="h-8 w-8 bg-brand-graphite animate-pulse rounded" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-20 bg-brand-graphite animate-pulse rounded" />
                      <div className="h-5 w-12 bg-brand-graphite animate-pulse rounded" />
                      <div className="h-9 w-20 bg-brand-graphite animate-pulse rounded" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Fields Skeleton */}
              <div className="space-y-4 pt-4 border-t border-brand-graphite">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-24 bg-brand-graphite animate-pulse rounded" />
                    <div className="h-10 w-full bg-brand-graphite animate-pulse rounded" />
                  </div>
                ))}
              </div>

              {/* Totals Skeleton */}
              <div className="space-y-3 pt-4 border-t border-brand-graphite">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-5 w-32 bg-brand-graphite animate-pulse rounded" />
                    <div className="h-5 w-24 bg-brand-graphite animate-pulse rounded" />
                  </div>
                ))}
              </div>

              {/* Buttons Skeleton */}
              <div className="flex gap-3 pt-4">
                <div className="h-10 flex-1 bg-brand-graphite animate-pulse rounded" />
                <div className="h-10 flex-1 bg-brand-graphite animate-pulse rounded" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Information Skeleton */}
        <div>
          <Card>
            <CardHeader>
              <div className="h-6 w-40 bg-brand-graphite animate-pulse rounded" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-20 bg-brand-graphite animate-pulse rounded" />
                  <div className="h-5 w-full bg-brand-graphite animate-pulse rounded" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <div className="h-6 w-32 bg-brand-graphite animate-pulse rounded" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-24 bg-brand-graphite animate-pulse rounded" />
                  <div className="h-5 w-full bg-brand-graphite animate-pulse rounded" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
