import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { touchLastSeen } from "@/lib/last-seen";
import DashboardLayout from "@/components/layout/DashboardLayout";

export const dynamic = "force-dynamic";

export default async function ParentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== "PARENT") redirect("/login");
  await touchLastSeen(session.user.id);

  // Ödeme bekleyen ders sayısı: onaylandı ama ödenmedi
  const pendingPayments = await db.booking.count({
    where: {
      student: { parent: { userId: session.user.id } },
      status: "CONFIRMED",
      OR: [{ payment: null }, { payment: { status: { not: "PAID" } } }],
    },
  });

  const parentNav = [
    { href: "/parent", label: "Ana Sayfa", icon: "home" as const },
    { href: "/parent/students", label: "Çocuklarım", icon: "students" as const },
    { href: "/parent/book", label: "Ders Al", icon: "calendarPlus" as const },
    { href: "/parent/bookings", label: "Derslerim", icon: "list" as const, badge: pendingPayments },
    { href: "/parent/payments", label: "Ödemelerim", icon: "payments" as const },
    { href: "/parent/egitim", label: "Gelişim Takibi", icon: "egitim" as const },
    { href: "/kaynaklar", label: "Kaynaklar & Oyunlar", icon: "resources" as const },
    { href: "/parent/account", label: "Hesabım", icon: "account" as const },
  ];

  return (
    <DashboardLayout navItems={parentNav} title="Veli Paneli">
      {children}
    </DashboardLayout>
  );
}
