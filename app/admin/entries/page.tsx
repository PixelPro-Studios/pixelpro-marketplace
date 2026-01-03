import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EntriesPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">All Entries</h1>
      <Card>
        <CardHeader>
          <CardTitle>Unified View</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-brand-platinum">
            This page will display all entries (orders, leads, services) with advanced filtering.
            Implementation coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
