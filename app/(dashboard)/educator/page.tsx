import { auth } from "@/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import ReapplyForm from "@/components/dashboard/ReapplyForm";
import NavIcon from "@/components/layout/NavIcon";

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
        <h1 className="font-display text-headline-xl text-on-background">
          Hoş geldiniz, {session?.user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-body-md text-on-surface-variant">Öğretmen panelinize genel bakış</p>
      </div>

      {/* Komisyon bilgi kartı — tüm onaylı öğretmenlere göster */}
      {!isPending && !isRejected && (
        <div className="bg-primary-fixed border border-outline-variant/20 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
            <span className="text-on-primary font-bold text-sm">%</span>
          </div>
          <div>
            <p className="text-on-primary-fixed font-semibold text-body-md">Platform Komisyonu: %20</p>
            <p className="text-on-primary-fixed/80 text-body-md mt-0.5">
              Her ders ücretinin %20&apos;si platform komisyonu olarak kesilir; kalan %80&apos;i size ödenir.
              Örnek: 500 ₺ ders → 400 ₺ net kazanç.
            </p>
          </div>
        </div>
      )}

      {isPending && (
        <div className="bg-tertiary-fixed border border-outline-variant/20 rounded-2xl p-4">
          <p className="text-on-tertiary-fixed font-semibold text-body-md">Hesabınız onay bekliyor</p>
          <p className="text-on-tertiary-fixed/80 text-body-md mt-0.5">Admin onayladıktan sonra derslerinizi yayınlayabilirsiniz.</p>
        </div>
      )}

      {isRejected && (
        <ReapplyForm rejectionNote={educator.rejectionNote} />
      )}

      {pendingBookings > 0 && (
        <Link href="/educator/bookings" className="flex items-center gap-3 bg-tertiary-fixed border border-outline-variant/20 rounded-2xl p-4 hover:opacity-90 transition">
          <span className="text-2xl">🔔</span>
          <div>
            <p className="font-semibold text-on-tertiary-fixed text-body-md">{pendingBookings} onay bekleyen ders talebi var</p>
            <p className="text-on-tertiary-fixed/70 text-caption">Rezervasyonlar sayfasına git →</p>
          </div>
        </Link>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Toplam Rezervasyon", value: totalBookings.toString(), cls: "bg-primary-fixed text-on-primary-fixed" },
          { label: "Onay Bekleyen", value: pendingBookings.toString(), cls: "bg-tertiary-fixed text-on-tertiary-fixed" },
          { label: "Aktif Ders", value: confirmedBookings.toString(), cls: "bg-secondary-container text-on-secondary-container" },
          { label: "Toplam Kazanç", value: formatCurrency(totalEarnings._sum.totalPrice?.toNumber() ?? 0), cls: "bg-surface-container text-on-background" },
        ].map((s) => (
          <div key={s.label} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-5 soft-card-static">
            <p className="text-caption text-on-surface-variant mb-1 uppercase tracking-wide">{s.label}</p>
            <p className={`text-headline-lg font-bold ${s.cls} rounded-xl px-2 py-0.5 inline-block`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/educator/derslerim", icon: "lessons" as const, title: "Derslerim", desc: `${educator.educatorLessons.length} onaylı ders` },
          { href: "/educator/availability", icon: "availability" as const, title: "Uygunluk Takvimi", desc: `${availableSlots} boş slot` },
          { href: "/educator/profile", icon: "profile" as const, title: "Profilim", desc: educator.isProfilePublic ? "Profil yayında" : "Profil gizli" },
        ].map((item) => (
          <Link key={item.href} href={item.href}
            className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-5 soft-card hover:border-primary/30 transition group">
            <div className="w-12 h-12 rounded-full bg-primary-fixed text-primary flex items-center justify-center mb-3">
              <NavIcon name={item.icon} className="w-6 h-6" />
            </div>
            <h3 className="font-display text-headline-md text-on-background">{item.title}</h3>
            <p className="text-body-md text-on-surface-variant mt-0.5">{item.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent bookings */}
      {educator.bookings.length > 0 && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6 soft-card-static">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-headline-md text-on-background">Son Rezervasyonlar</h2>
            <Link href="/educator/bookings" className="text-body-md text-primary hover:underline">Tümünü Gör</Link>
          </div>
          <div className="space-y-3">
            {educator.bookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between py-2.5 border-b border-outline-variant/20 last:border-0">
                <div>
                  <p className="text-body-md font-medium text-on-background">{b.student.name}</p>
                  <p className="text-caption text-on-surface-variant">
                    {new Date(b.slot.date).toLocaleDateString("tr-TR")} · {b.slot.startTime}
                  </p>
                </div>
                <span className={`text-caption px-3 py-1 rounded-full font-semibold ${
                  b.status === "CONFIRMED" ? "bg-secondary-container text-on-secondary-container" :
                  b.status === "PENDING" ? "bg-tertiary-fixed text-on-tertiary-fixed" :
                  b.status === "CANCELLED" ? "bg-error-container text-on-error-container" :
                  "bg-primary-fixed text-on-primary-fixed"
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
