import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";

const parentNav = [
  { href: "/parent", label: "Genel Bakış", icon: "overview" as const },
  { href: "/parent/students", label: "Öğrencilerim", icon: "students" as const },
  { href: "/parent/book", label: "Ders Rezervasyonu", icon: "availability" as const },
  { href: "/parent/bookings", label: "Rezervasyonlarım", icon: "bookings" as const },
  { href: "/parent/payments", label: "Ödemelerim", icon: "payments" as const },
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
