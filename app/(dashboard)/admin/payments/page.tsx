import { db } from "@/lib/db";
import { getCommissionRate } from "@/lib/finance";
import AdminPaymentsView, { type AdminPaymentItem } from "@/components/dashboard/AdminPaymentsView";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const [payments, commissionRate] = await Promise.all([
    db.payment.findMany({
      orderBy: { createdAt: "desc" },
      include: { booking: { include: { student: true, educator: { include: { user: true } } } } },
    }),
    getCommissionRate(),
  ]);

  const items: AdminPaymentItem[] = payments.map((p) => ({
    id: p.id,
    studentName: p.booking.student.name,
    educatorName: p.booking.educator.user.name ?? "—",
    amount: p.amount.toNumber(),
    status: p.status as AdminPaymentItem["status"],
    createdAt: p.createdAt.toISOString(),
  }));

  return <AdminPaymentsView payments={items} commissionRate={commissionRate} />;
}
