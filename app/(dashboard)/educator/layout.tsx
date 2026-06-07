import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";

const educatorNav = [
  { href: "/educator", label: "Genel Bakış", icon: "overview" as const },
  { href: "/educator/profile", label: "Profilim", icon: "profile" as const },
  { href: "/educator/derslerim", label: "Derslerim", icon: "lessons" as const },
  { href: "/educator/availability", label: "Uygunluk Takvimi", icon: "availability" as const },
  { href: "/educator/bookings", label: "Rezervasyonlar", icon: "bookings" as const },
  { href: "/educator/kaynaklar", label: "Kaynaklarım", icon: "resources" as const },
];

export default async function EducatorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== "EDUCATOR") redirect("/login");

  return (
    <DashboardLayout navItems={educatorNav} title="Öğretmen Paneli">
      {children}
    </DashboardLayout>
  );
}
