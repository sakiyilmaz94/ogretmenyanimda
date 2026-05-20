import { auth } from "@/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { formatCurrency, SUBJECT_LABELS } from "@/lib/utils";
import ReapplyForm from "@/components/dashboard/ReapplyForm";

export default async function EducatorDashboard() {
  const session = await auth();
  const educator = await db.educator.findUnique({
    where: { userId: session!.user.id },
    include: {
      bookings: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { student: true, slot: true },
      },
      educatorLessons: { where: { status: "APPROVED" } },
    },
  });

  if (!educator) return null;

  const [totalBookings, pendingBookings, confirmedBookings, totalEarnings, availableSlots] = await Promise.all([
    db.booking.count({ where: { educatorId: educator.id } }),
    db.booking.count({ where: { educatorId: educator.id, status: "PENDING" } }),
    db.booking.count({ where: { educatorId: educator.id, status: "CONFIRMED" } }),
    db.booking.aggregate({ where: { educatorId: educator.id, status: { in: ["CONFIRMED", "COMPLETED"] } }, _sum: { totalPrice: true } }),
    db.availabilitySlot.count({ where: { educatorId: educator.id, isBooked: false } }),
  ]);

  const isPending = educator.status === "PENDING";
  const isRejected = educator.status === "REJECTED";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl text-navy-900">
          Hoş geldiniz, {session?.user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-slate-500 text-sm">Öğretmen panelinize genel bakış</p>
      </div>

      {/* Komisyon bilgi kartı — tüm onaylı öğretmenlere göster */}
      {!isPending && !isRejected && (
        <div className="bg-navy-50 border border-navy-200 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-gold-400 font-bold text-sm">%</span>
          </div>
          <div>
            <p className="text-navy-900 font-semibold text-sm">Platform Komisyonu: %20</p>
            <p className="text-navy-600 text-sm mt-0.5">
              Her ders ücretinin %20&apos;si platform komisyonu olarak kesilir; kalan %80&apos;i size ödenir.
              Örnek: 500 ₺ ders → 400 ₺ net kazanç.
            </p>
          </div>
        </div>
      )}

      {isPending && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-amber-800 font-semibold text-sm">Hesabınız onay bekliyor</p>
          <p className="text-amber-700 text-sm mt-0.5">Admin onayladıktan sonra derslerinizi yayınlayabilirsiniz.</p>
        </div>
      )}

      {isRejected && (
        <ReapplyForm rejectionNote={educator.rejectionNote} />
      )}

      {pendingBookings > 0 && (
        <Link href="/educator/bookings" className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 hover:bg-amber-100 transition">
          <span className="text-2xl">🔔</span>
          <div>
            <p className="font-semibold text-amber-800 text-sm">{pendingBookings} onay bekleyen ders talebi var</p>
            <p className="text-amber-600 text-xs">Rezervasyonlar sayfasına git →</p>
          </div>
        </Link>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Toplam Rezervasyon", value: totalBookings.toString(), color: "bg-navy-50 text-navy-700" },
          { label: "Onay Bekleyen", value: pendingBookings.toString(), color: "bg-amber-50 text-amber-700" },
          { label: "Aktif Ders", value: confirmedBookings.toString(), color: "bg-green-50 text-green-700" },
          { label: "Toplam Kazanç", value: formatCurrency(totalEarnings._sum.totalPrice?.toNumber() ?? 0), color: "bg-gold-50 text-gold-700" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
            <p className="text-xs text-slate-400 mb-1 uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl font-bold text-navy-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/educator/derslerim", icon: "📚", title: "Derslerim", desc: `${educator.educatorLessons.length} onaylı ders`, badge: educator.educatorLessons.length },
          { href: "/educator/availability", icon: "📅", title: "Uygunluk Takvimi", desc: `${availableSlots} boş slot`, badge: null },
          { href: "/educator/profile", icon: "👤", title: "Profilim", desc: educator.isProfilePublic ? "Profil yayında" : "Profil gizli", badge: null },
        ].map((item) => (
          <Link key={item.href} href={item.href}
            className="bg-white rounded-2xl border border-slate-100 p-5 hover:border-gold-300 hover:shadow-sm transition group">
            <div className="text-2xl mb-3">{item.icon}</div>
            <h3 className="font-semibold text-navy-900">{item.title}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{item.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent bookings */}
      {educator.bookings.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-navy-900">Son Rezervasyonlar</h2>
            <Link href="/educator/bookings" className="text-sm text-gold-600 hover:underline">Tümünü Gör</Link>
          </div>
          <div className="space-y-3">
            {educator.bookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-navy-900">{b.student.name}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(b.slot.date).toLocaleDateString("tr-TR")} · {b.slot.startTime}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  b.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                  b.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                  b.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                  "bg-slate-100 text-slate-600"
                }`}>
                  {b.status === "CONFIRMED" ? "Onaylı" : b.status === "PENDING" ? "Beklemede" : b.status === "CANCELLED" ? "İptal" : "Tamamlandı"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
