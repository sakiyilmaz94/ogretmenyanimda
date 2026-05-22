import { auth } from "@/auth";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default async function ParentDashboard() {
  const session = await auth();
  const parent = await db.parent.findUnique({
    where: { userId: session!.user.id },
    include: {
      students: {
        include: {
          bookings: {
            take: 3,
            orderBy: { createdAt: "desc" },
            include: {
              educator: { include: { user: true } },
              slot: true,
              payment: true,
            },
          },
        },
      },
    },
  });

  if (!parent) return null;

  const totalSpent = await db.payment.aggregate({
    where: {
      status: "PAID",
      booking: { student: { parentId: parent.id } },
    },
    _sum: { amount: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-headline-lg text-on-background">
          Hoş geldiniz, {session?.user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-body-md text-on-surface-variant">Veli panelinize genel bakış</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Kayıtlı Öğrenci", value: parent.students.length, icon: "🎒" },
          {
            label: "Toplam Ders",
            value: parent.students.reduce((sum, s) => sum + s.bookings.length, 0),
            icon: "📋",
          },
          {
            label: "Toplam Harcama",
            value: formatCurrency(totalSpent._sum.amount?.toNumber() ?? 0),
            icon: "💳",
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-container-lowest rounded-md p-6 soft-card-static border border-outline-variant/20">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="font-display text-headline-md text-on-background">{stat.value}</div>
            <div className="text-body-md text-on-surface-variant">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Ana akış: Öğretmen bul */}
      <div className="bg-inverse-surface rounded-md p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-12 h-12 bg-primary rounded-md flex items-center justify-center shrink-0">
          <svg className="w-6 h-6 text-on-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-on-primary font-display font-semibold text-body-lg">Öğretmen Ara & Randevu Al</p>
          <p className="text-on-primary/70 text-body-md mt-0.5">Onaylı öğretmenleri inceleyin, profillerini görün ve doğrudan randevu alın.</p>
        </div>
        <Link
          href="/egitmenlerimiz"
          className="rounded-full squishy-btn bg-primary text-on-primary px-6 py-3 text-label-md font-semibold shrink-0"
        >
          Öğretmenleri Gör →
        </Link>
      </div>

      {parent.students.length === 0 ? (
        <div className="bg-tertiary-fixed border border-outline-variant/20 rounded-md p-8 text-center soft-card-static">
          <div className="w-12 h-12 bg-primary-fixed rounded-md flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-on-primary-fixed" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="font-display font-semibold text-on-tertiary-fixed mb-2">Henüz öğrenci eklemediniz</h3>
          <p className="text-on-tertiary-fixed/70 text-body-md mb-4">Randevu alabilmek için önce çocuğunuzu sisteme ekleyin.</p>
          <Link href="/parent/students"
            className="inline-block rounded-full squishy-btn bg-primary text-on-primary px-6 py-3 text-label-md font-semibold">
            Öğrenci Ekle
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {parent.students.map((student) => (
            <div key={student.id} className="bg-surface-container-lowest rounded-md border border-outline-variant/20 p-5 soft-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center">
                    <span className="text-on-primary font-display font-bold">{student.name[0].toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-display font-semibold text-on-background">{student.name}</p>
                    <p className="text-caption text-on-surface-variant">
                      {student.gradeLevel.replace("_", ". ").replace("ILKOKUL", "İlkokul").replace("ORTAOKUL", "Ortaokul")}
                    </p>
                  </div>
                </div>
                <Link href={`/egitmenlerimiz`}
                  className="text-caption bg-primary-fixed text-on-primary-fixed px-3 py-1.5 rounded-full hover:opacity-90 transition font-semibold">
                  Ders Al
                </Link>
              </div>

              {student.bookings.length > 0 ? (
                <div className="space-y-2 border-t border-outline-variant/20 pt-3">
                  <p className="text-caption text-on-surface-variant font-semibold uppercase tracking-wide mb-2">Son Dersler</p>
                  {student.bookings.map((b) => (
                    <div key={b.id} className="flex items-center justify-between text-body-md py-1">
                      <span className="font-semibold text-on-background">{b.educator.user.name}</span>
                      <span className="text-on-surface-variant text-caption">{new Date(b.slot.date).toLocaleDateString("tr-TR")}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-caption text-on-surface-variant border-t border-outline-variant/20 pt-3">Henüz ders alınmadı.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
