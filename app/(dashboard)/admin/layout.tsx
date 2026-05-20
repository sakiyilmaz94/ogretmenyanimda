import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";

const adminNav = [
  { href: "/admin", label: "Genel Bakış", icon: "📊" },
  { href: "/admin/educators", label: "Öğretmenler", icon: "👨‍🏫" },
  { href: "/admin/ders-programlari", label: "Ders Programları", icon: "📚" },
  { href: "/admin/ders-onaylari", label: "Ders Onayları", icon: "✅" },
  { href: "/admin/bookings", label: "Rezervasyonlar", icon: "📅" },
  { href: "/admin/payments", label: "Ödemeler", icon: "💰" },
  { href: "/admin/students", label: "Öğrenciler", icon: "🎒" },
  { href: "/admin/raporlar", label: "Raporlar", icon: "📈" },
  { href: "/admin/fiyatlandirma", label: "Fiyatlandırma", icon: "🏷️" },
  { href: "/admin/settings", label: "Ayarlar", icon: "⚙️" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  return (
    <DashboardLayout navItems={adminNav} title="Admin Paneli">
      {children}
    </DashboardLayout>
  );
}
