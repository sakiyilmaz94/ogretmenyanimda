import { db } from "@/lib/db";
import { formatCurrency, SUBJECT_LABELS } from "@/lib/utils";
import { getCommissionRate } from "@/lib/finance";

export const dynamic = "force-dynamic";

export default async function RaporlarPage() {
  const [
    totalBookings,
    confirmedBookings,
    totalPayments,
    totalEducators,
    totalStudents,
    recentPayments,
    bookingsBySubject,
    topEducators,
  ] = await Promise.all([
    db.booking.count(),
    db.booking.count({ where: { status: "CONFIRMED" } }),
    db.payment.aggregate({ where: { status: "PAID" }, _sum: { amount: true }, _count: true }),
    db.educator.count({ where: { status: "APPROVED" } }),
    db.student.count(),
    db.payment.findMany({
      where: { status: "PAID" },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { booking: { include: { student: true, educator: { include: { user: true } } } } },
    }),
    db.booking.groupBy({ by: ["subject"], _count: { id: true }, orderBy: { _count: { id: "desc" } } }),
    db.booking.groupBy({
      by: ["educatorId"],
      where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
      _count: { id: true },
      _sum: { totalPrice: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    }),
  ]);

  const educatorDetails = await db.educator.findMany({
    where: { id: { in: topEducators.map((e) => e.educatorId) } },
    include: { user: true },
  });
  const educatorMap = Object.fromEntries(educatorDetails.map((e) => [e.id, e]));

  const commissionRate = await getCommissionRate();
  const grossPaid = totalPayments._sum.amount?.toNumber() ?? 0;
  const ourIncome = Math.round(grossPaid * (commissionRate / 100) * 100) / 100;
  const teacherPayout = Math.round((grossPaid - ourIncome) * 100) / 100;

  const operational = [
    { label: "Toplam Rezervasyon", value: totalBookings.toString(), sub: `${confirmedBookings} onaylı` },
    { label: "Aktif Öğretmen", value: totalEducators.toString(), sub: "onaylı" },
    { label: "Toplam Öğrenci", value: totalStudents.toString(), sub: "kayıtlı" },
    { label: "Tamamlanan Ödeme", value: totalPayments._count.toString(), sub: "adet" },
  ];

  return (
    <div className="space-y-8">
      <div className="mb-2">
        <h1 className="font-display text-headline-md text-on-background">Finansal Raporlar</h1>
        <p className="text-label-md text-on-surface-variant mt-0.5">Platform geneli gelir ve performans özeti</p>
      </div>

      {/* Finansal özet — bizim gelirimiz vurgulu */}
      <div>
        <h2 className="text-label-md font-semibold text-on-surface-variant uppercase tracking-wide mb-3">Finansal Özet (ödenen dersler)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-5 soft-card-static">
            <p className="text-caption text-on-surface-variant mb-1">Toplam Tahsilat (brüt)</p>
            <p className="font-display text-headline-lg font-bold text-on-background">{formatCurrency(grossPaid)}</p>
            <p className="text-caption text-on-surface-variant mt-1">Velilerden tahsil edilen toplam</p>
          </div>
          <div className="bg-primary-fixed/50 rounded-2xl border border-primary/30 p-5 soft-card-static">
            <p className="text-caption text-on-surface-variant mb-1">Bizim Gelirimiz (komisyon %{commissionRate})</p>
            <p className="font-display text-headline-lg font-bold text-primary">{formatCurrency(ourIncome)}</p>
            <p className="text-caption text-on-surface-variant mt-1">Platformun net kazancı</p>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-5 soft-card-static">
            <p className="text-caption text-on-surface-variant mb-1">Öğretmene Ödenecek</p>
            <p className="font-display text-headline-lg font-bold text-on-secondary-container">{formatCurrency(teacherPayout)}</p>
            <p className="text-caption text-on-surface-variant mt-1">Öğretmen payoutları toplamı</p>
          </div>
        </div>
      </div>

      {/* Operasyonel sayımlar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {operational.map((s) => (
          <div key={s.label} className="bg-surface-container-lowest rounded-md border border-outline-variant/20 p-5 soft-card-static">
            <p className="text-caption text-on-surface-variant font-medium uppercase tracking-wide mb-1">{s.label}</p>
            <p className="font-display text-headline-md text-on-background">{s.value}</p>
            <span className="text-caption mt-1 font-semibold px-2 py-0.5 rounded-full inline-block bg-primary-fixed text-on-primary-fixed-variant">{s.sub}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Educators */}
        <div className="bg-surface-container-lowest rounded-md border border-outline-variant/20 p-6 soft-card-static">
          <h2 className="font-display text-headline-md text-on-background mb-4">En Çok Ders Veren Öğretmenler</h2>
          {topEducators.length === 0 ? (
            <p className="text-label-md text-on-surface-variant">Henüz veri yok.</p>
          ) : (
            <div className="space-y-3">
              {topEducators.map((e, i) => {
                const edu = educatorMap[e.educatorId];
                return (
                  <div key={e.educatorId} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-on-primary text-caption font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-md font-medium text-on-background truncate">{edu?.user.name ?? "—"}</p>
                      <p className="text-caption text-on-surface-variant">{e._count.id} ders</p>
                    </div>
                    <p className="text-body-md font-bold text-primary shrink-0">
                      {formatCurrency(e._sum.totalPrice?.toNumber() ?? 0)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bookings by Subject */}
        <div className="bg-surface-container-lowest rounded-md border border-outline-variant/20 p-6 soft-card-static">
          <h2 className="font-display text-headline-md text-on-background mb-4">Derslere Göre Rezervasyon</h2>
          {bookingsBySubject.length === 0 ? (
            <p className="text-label-md text-on-surface-variant">Henüz veri yok.</p>
          ) : (
            <div className="space-y-3">
              {bookingsBySubject.map((b) => {
                const pct = totalBookings > 0 ? Math.round((b._count.id / totalBookings) * 100) : 0;
                return (
                  <div key={b.subject}>
                    <div className="flex justify-between text-body-md mb-1">
                      <span className="text-on-surface-variant">{SUBJECT_LABELS[b.subject] ?? b.subject}</span>
                      <span className="font-medium text-on-background">{b._count.id} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-surface-container-lowest rounded-md soft-card-static overflow-hidden border border-outline-variant/20">
        <div className="px-5 py-4 border-b border-outline-variant/20">
          <h2 className="font-display text-headline-md text-on-background">Son Ödemeler</h2>
        </div>
        {recentPayments.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-label-md text-on-surface-variant">Henüz ödeme yok.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-body-md">
              <thead className="bg-surface-container">
                <tr>
                  <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Öğrenci</th>
                  <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Öğretmen</th>
                  <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Tutar</th>
                  <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {recentPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-container-low transition">
                    <td className="px-5 py-3.5 font-medium text-on-background">{p.booking.student.name}</td>
                    <td className="px-5 py-3.5 text-on-surface-variant">{p.booking.educator.user.name}</td>
                    <td className="px-5 py-3.5 font-bold text-primary">{formatCurrency(p.amount.toNumber())}</td>
                    <td className="px-5 py-3.5 text-on-surface-variant text-caption">{new Date(p.createdAt).toLocaleDateString("tr-TR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
