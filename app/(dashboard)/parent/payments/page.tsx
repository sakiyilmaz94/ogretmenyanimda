import { auth } from "@/auth";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import ParentPaymentsView, { type ParentPaymentItem } from "@/components/dashboard/ParentPaymentsView";

export const dynamic = "force-dynamic";

export default async function ParentPaymentsPage() {
  const session = await auth();

  const parent = await db.parent.findUnique({ where: { userId: session!.user.id } });
  if (!parent) return null;

  const payments = await db.payment.findMany({
    where: { booking: { student: { parentId: parent.id } } },
    orderBy: { createdAt: "desc" },
    include: {
      booking: { include: { student: true, educator: { include: { user: true } }, slot: true } },
    },
  });

  const items: ParentPaymentItem[] = payments.map((p) => ({
    id: p.id,
    studentName: p.booking.student.name,
    educatorName: p.booking.educator.user.name ?? "—",
    subject: p.booking.subject,
    amount: p.amount.toNumber(),
    installment: p.installment,
    status: p.status,
    createdAt: p.createdAt.toISOString(),
  }));

  const totalPaid = items.filter((p) => p.status === "PAID").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-headline-lg text-on-background">Ödemelerim</h1>
          <p className="text-body-md text-on-surface-variant">Tüm ödeme geçmişiniz</p>
        </div>
        <div className="bg-secondary-container text-on-secondary-container px-5 py-2.5 rounded-full text-label-md font-semibold">
          Toplam: {formatCurrency(totalPaid)}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-surface-container rounded-md p-10 text-center soft-card-static">
          <p className="text-3xl mb-3">💳</p>
          <p className="text-body-md text-on-surface-variant">Henüz ödeme geçmişiniz bulunmuyor.</p>
        </div>
      ) : (
        <ParentPaymentsView payments={items} />
      )}
    </div>
  );
}
