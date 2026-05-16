import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";

const parentNav = [
  { href: "/parent", label: "Genel Bakış", icon: "📊" },
  { href: "/parent/students", label: "Öğrencilerim", icon: "🎒" },
  { href: "/parent/book", label: "Ders Rezervasyonu", icon: "📅" },
  { href: "/parent/bookings", label: "Rezervasyonlarım", icon: "📋" },
  { href: "/parent/payments", label: "Ödemelerim", icon: "💳" },
];

export default async function ParentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== "PARENT") redirect("/login");

  return (
    <DashboardLayout navItems={parentNav} title="Veli Paneli">
      {children}
    </DashboardLayout>
  );
}
