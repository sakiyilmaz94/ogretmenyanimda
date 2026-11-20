import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { touchLastSeen } from "@/lib/last-seen";
import DashboardLayout from "@/components/layout/DashboardLayout";

const adminNav = [
  { href: "/admin", label: "Genel Bakış", icon: "overview" as const },
  { href: "/admin/educators", label: "Öğretmenler", icon: "teachers" as const },
  { href: "/admin/ders-programlari", label: "Ders Programları", icon: "lessons" as const },
  { href: "/admin/ders-onaylari", label: "Ders Onayları", icon: "approvals" as const },
  { href: "/admin/bookings", label: "Rezervasyonlar", icon: "bookings" as const },
  { href: "/admin/payments", label: "Ödemeler", icon: "payments" as const },
  { href: "/admin/students", label: "Öğrenciler", icon: "students" as const },
  { href: "/admin/parents", label: "Veliler", icon: "account" as const },
  { href: "/admin/kaynaklar", label: "Kaynaklar", icon: "lessons" as const },
  { href: "/admin/aktivite", label: "Kullanıcı Aktivitesi", icon: "reports" as const },
  { href: "/admin/raporlar", label: "Raporlar", icon: "reports" as const },
  { href: "/admin/fiyatlandirma", label: "Fiyatlandırma", icon: "pricing" as const },
  { href: "/admin/settings", label: "Ayarlar", icon: "settings" as const },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");
  await touchLastSeen(session.user.id);

  return (
    <DashboardLayout navItems={adminNav} title="Admin Paneli">
      {children}
    </DashboardLayout>
  );
}
