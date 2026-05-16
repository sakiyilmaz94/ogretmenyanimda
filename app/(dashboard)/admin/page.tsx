import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

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

  const stats = [
    { label: "Toplam Eğitmen", value: totalEducators, icon: "👨‍🏫", color: "bg-blue-50 text-blue-700" },
    { label: "Onay Bekleyen", value: pendingEducators, icon: "⏳", color: "bg-yellow-50 text-yellow-700" },
    { label: "Toplam Veli", value: totalParents, icon: "👨‍👩‍👧", color: "bg-green-50 text-green-700" },
    { label: "Toplam Öğrenci", value: totalStudents, icon: "🎒", color: "bg-purple-50 text-purple-700" },
    { label: "Toplam Rezervasyon", value: totalBookings, icon: "📅", color: "bg-indigo-50 text-indigo-700" },
    {
      label: "Toplam Gelir",
      value: formatCurrency(totalRevenue._sum.amount?.toNumber() ?? 0),
      icon: "💰",
      color: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Paneli</h1>
        <p className="text-gray-500">Platforma genel bakış</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${stat.color} mb-3`}>
              <span className="text-xl">{stat.icon}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Son Ödemeler</h2>
        {recentPayments.length === 0 ? (
          <p className="text-gray-500 text-sm">Henüz ödeme bulunmuyor.</p>
        ) : (
          <div className="space-y-3">
            {recentPayments.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium">{p.booking.student.name}</p>
                  <p className="text-xs text-gray-500">{p.booking.educator.user.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCurrency(p.amount.toNumber())}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    p.status === "PAID" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {p.status === "PAID" ? "Ödendi" : "Beklemede"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
