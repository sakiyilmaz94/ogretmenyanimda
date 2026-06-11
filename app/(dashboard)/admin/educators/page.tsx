import { db } from "@/lib/db";
import AdminEducatorsList, { type AdminEducatorRow } from "@/components/dashboard/AdminEducatorsList";
import PrintButton from "@/components/dashboard/PrintButton";

export const dynamic = "force-dynamic";

export default async function AdminEducatorsPage() {
  const raw = await db.educator.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  const educators: AdminEducatorRow[] = raw.map((e) => ({
    id: e.id,
    name: e.user.name ?? "—",
    email: e.user.email,
    subjects: e.subjects,
    hourlyRate: e.hourlyRate.toNumber(),
    status: e.status as AdminEducatorRow["status"],
    createdAt: e.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-headline-md text-on-background">Öğretmen Yönetimi</h1>
          <p className="text-label-md text-on-surface-variant mt-0.5">
            Tüm öğretmenleri arayın, filtreleyin; detayına girip ders saat ücreti dahil her şeyi düzenleyin.
          </p>
        </div>
        <PrintButton type="ogretmenler" label="Öğretmen Listesi PDF" />
      </div>
      <AdminEducatorsList educators={educators} />
    </div>
  );
}
