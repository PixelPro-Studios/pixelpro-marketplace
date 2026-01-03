import Link from "next/link";
import { logout } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, ShoppingCart, Users, List, LogOut } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "All Entries", href: "/admin/entries", icon: List },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Services", href: "/admin/services", icon: Package },
  { name: "Leads", href: "/admin/leads", icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-charcoal border-r border-brand-graphite">
        <div className="p-6">
          <h1 className="font-display text-xl font-bold mb-1">PixelPro Admin</h1>
          <p className="text-sm text-brand-platinum">BOWS Event Management</p>
        </div>
        <nav className="px-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-brand-platinum hover:bg-brand-graphite hover:text-brand-off-white transition-colors"
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-3">
          <form action={logout}>
            <Button variant="secondary" className="w-full justify-start" type="submit">
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
