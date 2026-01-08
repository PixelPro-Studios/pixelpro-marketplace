import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function ConfirmationLoading() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6">
          <Loader2 className="w-16 h-16 text-brand-off-white animate-spin" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-2">
          Loading Order Details...
        </h1>
        <p className="text-brand-platinum text-lg">
          Please wait while we retrieve your confirmation
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="h-6 w-32 bg-brand-graphite animate-pulse rounded" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Reference Number Skeleton */}
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between p-6 bg-brand-black rounded-lg">
            <div className="flex-1 space-y-3">
              <div className="h-4 w-32 bg-brand-graphite animate-pulse rounded" />
              <div className="h-8 w-48 bg-brand-graphite animate-pulse rounded" />
              <div className="h-4 w-full bg-brand-graphite animate-pulse rounded" />
            </div>
            <div className="w-[152px] h-[152px] bg-brand-graphite animate-pulse rounded-lg" />
          </div>

          {/* Order Items Skeleton */}
          <div>
            <div className="h-5 w-24 bg-brand-graphite animate-pulse rounded mb-3" />
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-2 border-b border-brand-graphite"
                >
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-48 bg-brand-graphite animate-pulse rounded" />
                    <div className="h-4 w-32 bg-brand-graphite animate-pulse rounded" />
                  </div>
                  <div className="h-5 w-20 bg-brand-graphite animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary Skeleton */}
          <div className="space-y-3 pt-4 border-t border-brand-graphite">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-5 w-32 bg-brand-graphite animate-pulse rounded" />
                <div className="h-5 w-24 bg-brand-graphite animate-pulse rounded" />
              </div>
            ))}
          </div>

          {/* Contact Info Skeleton */}
          <div className="pt-4 border-t border-brand-graphite space-y-3">
            <div className="h-4 w-40 bg-brand-graphite animate-pulse rounded" />
            <div className="h-5 w-full bg-brand-graphite animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>

      {/* Next Steps Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-24 bg-brand-graphite animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-8 h-8 bg-brand-graphite animate-pulse rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-full bg-brand-graphite animate-pulse rounded" />
                  <div className="h-4 w-3/4 bg-brand-graphite animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
