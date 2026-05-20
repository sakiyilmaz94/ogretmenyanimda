import { db } from "@/lib/db";
import { formatCurrency, SUBJECT_LABELS } from "@/lib/utils";

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

  const stats = [
    { label: "Toplam Rezervasyon", value: totalBookings.toString(), sub: `${confirmedBookings} onaylı`, color: "bg-navy-50 text-navy-700" },
    { label: "Toplam Gelir", value: formatCurrency(totalPayments._sum.amount?.toNumber() ?? 0), sub: `${totalPayments._count} ödeme`, color: "bg-gold-50 text-gold-700" },
    { label: "Aktif Öğretmen", value: totalEducators.toString(), sub: "onaylı öğretmen", color: "bg-green-50 text-green-700" },
    { label: "Toplam Öğrenci", value: totalStudents.toString(), sub: "kayıtlı öğrenci", color: "bg-blue-50 text-blue-700" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Finansal Raporlar</h1>
        <p className="text-slate-500 text-sm mt-0.5">Platform geneli istatistikler ve performans verileri</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-navy-900">{s.value}</p>
            <p className={`text-xs mt-1 font-medium px-2 py-0.5 rounded-full inline-block ${s.color}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Educators */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="font-semibold text-navy-900 mb-4">En Çok Ders Veren Öğretmenler</h2>
          {topEducators.length === 0 ? (
            <p className="text-slate-400 text-sm">Henüz veri yok.</p>
          ) : (
            <div className="space-y-3">
              {topEducators.map((e, i) => {
                const edu = educatorMap[e.educatorId];
                return (
                  <div key={e.educatorId} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-navy-900 text-gold-400 text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy-900 truncate">{edu?.user.name ?? "—"}</p>
                      <p className="text-xs text-slate-400">{e._count.id} ders</p>
                    </div>
                    <p className="text-sm font-bold text-gold-600 shrink-0">
                      {formatCurrency(e._sum.totalPrice?.toNumber() ?? 0)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bookings by Subject */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="font-semibold text-navy-900 mb-4">Konulara Göre Rezervasyon</h2>
          {bookingsBySubject.length === 0 ? (
            <p className="text-slate-400 text-sm">Henüz veri yok.</p>
          ) : (
            <div className="space-y-3">
              {bookingsBySubject.map((b) => {
                const pct = totalBookings > 0 ? Math.round((b._count.id / totalBookings) * 100) : 0;
                return (
                  <div key={b.subject}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">{SUBJECT_LABELS[b.subject] ?? b.subject}</span>
                      <span className="font-medium text-navy-900">{b._count.id} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gold-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-semibold text-navy-900 mb-4">Son Ödemeler</h2>
        {recentPayments.length === 0 ? (
          <p className="text-slate-400 text-sm">Henüz ödeme yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="text-left py-2 pr-4 font-medium">Öğrenci</th>
                  <th className="text-left py-2 pr-4 font-medium">Öğretmen</th>
                  <th className="text-left py-2 pr-4 font-medium">Tutar</th>
                  <th className="text-left py-2 font-medium">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-2.5 pr-4 font-medium text-navy-900">{p.booking.student.name}</td>
                    <td className="py-2.5 pr-4 text-slate-600">{p.booking.educator.user.name}</td>
                    <td className="py-2.5 pr-4 font-bold text-gold-600">{formatCurrency(p.amount.toNumber())}</td>
                    <td className="py-2.5 text-slate-400 text-xs">{new Date(p.createdAt).toLocaleDateString("tr-TR")}</td>
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
