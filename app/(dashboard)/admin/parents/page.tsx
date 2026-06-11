import { db } from "@/lib/db";
import AdminParentsList, { type AdminParentRow } from "@/components/dashboard/AdminParentsList";

export const dynamic = "force-dynamic";

export default async function AdminParentsPage() {
  const parents = await db.parent.findMany({
    include: {
      user: true,
      students: { include: { bookings: { include: { payment: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  const rows: AdminParentRow[] = parents.map((p) => {
    const totalSpent = p.students.reduce(
      (sum, s) => sum + s.bookings.reduce((bs, b) => bs + (b.payment?.status === "PAID" ? b.payment.amount.toNumber() : 0), 0),
      0
    );
    return {
      id: p.id,
      name: p.user.name ?? "—",
      email: p.user.email,
      phone: p.phone ?? "",
      childCount: p.students.length,
      totalSpent,
      createdAt: p.createdAt.toISOString(),
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-headline-md text-on-background">Veli Yönetimi</h1>
        <p className="text-label-md text-on-surface-variant mt-0.5">
          Tüm velileri arayın, filtreleyin; detayında çocuklarını, rezervasyonlarını ve ödemelerini görün.
        </p>
      </div>
      <AdminParentsList parents={rows} />
    </div>
  );
}
