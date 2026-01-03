import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminServicesPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">Services Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Manage Services</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-brand-platinum">
            Service CRUD interface coming soon. You can manage services directly in Supabase for now.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
