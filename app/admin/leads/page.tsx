import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getLeads() {
  const supabase = await createClient();

  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  return leads || [];
}

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">Leads</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Leads</CardTitle>
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
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-brand-platinum">
                      No leads found
                    </td>
                  </tr>
                ) : (
                  leads.map((lead: any) => (
                    <tr key={lead.id} className="border-b border-brand-graphite last:border-0">
                      <td className="py-3 px-4 font-medium">{lead.full_name}</td>
                      <td className="py-3 px-4">{lead.email}</td>
                      <td className="py-3 px-4">{lead.phone}</td>
                      <td className="py-3 px-4 text-sm text-brand-platinum">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
