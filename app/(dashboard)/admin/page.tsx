import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { getCommissionRate } from "@/lib/finance";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [
    totalEducators,
    pendingEducators,
    totalParents,
    totalStudents,
    totalBookings,
    recentPayments,
  ] = await Promise.all([
    db.educator.count(),
    db.educator.count({ where: { status: "PENDING" } }),
    db.parent.count(),
    db.student.count(),
    db.booking.count(),
    db.payment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        booking: {
          include: {
            student: true,
            educator: { include: { user: true } },
          },
        },
      },
    }),
  ]);

  const totalRevenue = await db.payment.aggregate({
    where: { status: "PAID" },
    _sum: { amount: true },
  });
  const gross = totalRevenue._sum.amount?.toNumber() ?? 0;
  const rate = await getCommissionRate();
  const commission = Math.round(gross * (rate / 100) * 100) / 100; // platform geliri

  const stats = [
    {
      label: "Toplam Öğretmen",
      value: totalEducators,
      icon: (
        <svg className="w-5 h-5 text-on-primary-fixed-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: "Onay Bekleyen",
      value: pendingEducators,
      icon: (
        <svg className="w-5 h-5 text-on-primary-fixed-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Toplam Veli",
      value: totalParents,
      icon: (
        <svg className="w-5 h-5 text-on-primary-fixed-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: "Toplam Öğrenci",
      value: totalStudents,
      icon: (
        <svg className="w-5 h-5 text-on-primary-fixed-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ),
    },
    {
      label: "Toplam Rezervasyon",
      value: totalBookings,
      icon: (
        <svg className="w-5 h-5 text-on-primary-fixed-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "Toplam Tahsilat (brüt)",
      value: formatCurrency(gross),
      icon: (
        <svg className="w-5 h-5 text-on-primary-fixed-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: `Platform Geliri (komisyon %${rate})`,
      value: formatCurrency(commission),
      icon: (
        <svg className="w-5 h-5 text-on-primary-fixed-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="font-display text-headline-md text-on-background">Admin Paneli</h1>
        <p className="text-label-md text-on-surface-variant mt-0.5">Platforma genel bakış</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface-container-lowest rounded-md p-5 soft-card-static border border-outline-variant/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary-fixed rounded-xl p-2.5 w-10 h-10 flex items-center justify-center">
                {stat.icon}
              </div>
              <span className="text-label-md text-on-surface-variant">{stat.label}</span>
            </div>
            <p className="text-headline-md font-display text-on-background">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-md soft-card-static overflow-hidden border border-outline-variant/20">
        <div className="px-5 py-4 border-b border-outline-variant/20">
          <h2 className="font-display text-headline-md text-on-background">Son Ödemeler</h2>
        </div>
        {recentPayments.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-label-md text-on-surface-variant">Henüz ödeme bulunmuyor.</p>
          </div>
        ) : (
          <table className="w-full text-body-md">
            <thead className="bg-surface-container">
              <tr>
                <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Öğrenci</th>
                <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Öğretmen</th>
                <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Tutar</th>
                <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {recentPayments.map((p) => (
                <tr key={p.id} className="hover:bg-surface-container-low transition">
                  <td className="px-5 py-3.5 text-on-background font-medium">{p.booking.student.name}</td>
                  <td className="px-5 py-3.5 text-on-surface-variant">{p.booking.educator.user.name}</td>
                  <td className="px-5 py-3.5 text-on-background font-semibold">{formatCurrency(p.amount.toNumber())}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-3 py-1 rounded-full text-caption font-semibold ${
                      p.status === "PAID"
                        ? "bg-secondary-container text-on-secondary-container"
                        : "bg-tertiary-fixed text-on-tertiary-fixed"
                    }`}>
                      {p.status === "PAID" ? "Ödendi" : "Beklemede"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
