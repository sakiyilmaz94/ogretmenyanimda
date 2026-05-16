import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";

const educatorNav = [
  { href: "/educator", label: "Genel Bakış", icon: "📊" },
  { href: "/educator/availability", label: "Uygunluk Takvimi", icon: "📅" },
  { href: "/educator/bookings", label: "Rezervasyonlarım", icon: "📋" },
  { href: "/educator/profile", label: "Profilim", icon: "👤" },
];

export default async function EducatorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== "EDUCATOR") redirect("/login");

  return (
    <DashboardLayout navItems={educatorNav} title="Eğitmen Paneli">
      {children}
    </DashboardLayout>
  );
}
