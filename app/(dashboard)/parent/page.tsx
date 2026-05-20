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
        <h1 className="text-2xl font-bold text-gray-900">
          Hoş geldiniz, {session?.user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-gray-500">Veli panelinize genel bakış</p>
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
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Ana akış: Öğretmen bul */}
      <div className="bg-navy-900 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-12 h-12 bg-gold-500 rounded-xl flex items-center justify-center shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-white font-semibold text-lg">Öğretmen Ara & Randevu Al</p>
          <p className="text-navy-300 text-sm mt-0.5">Onaylı öğretmenleri inceleyin, profillerini görün ve doğrudan randevu alın.</p>
        </div>
        <Link
          href="/egitmenlerimiz"
          className="bg-gold-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gold-600 transition-colors shrink-0"
        >
          Öğretmenleri Gör →
        </Link>
      </div>

      {parent.students.length === 0 ? (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-800 mb-2">Henüz öğrenci eklemediniz</h3>
          <p className="text-slate-500 text-sm mb-4">Randevu alabilmek için önce çocuğunuzu sisteme ekleyin.</p>
          <Link href="/parent/students"
            className="inline-block bg-navy-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-800 transition-colors">
            Öğrenci Ekle
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {parent.students.map((student) => (
            <div key={student.id} className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center">
                    <span className="text-navy-700 font-bold text-sm">{student.name[0].toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-navy-900">{student.name}</p>
                    <p className="text-xs text-slate-400">
                      {student.gradeLevel.replace("_", ". ").replace("ILKOKUL", "İlkokul").replace("ORTAOKUL", "Ortaokul")}
                    </p>
                  </div>
                </div>
                <Link href={`/egitmenlerimiz`}
                  className="text-xs bg-gold-500 text-white px-3 py-1.5 rounded-lg hover:bg-gold-600 transition-colors font-medium">
                  Ders Al
                </Link>
              </div>

              {student.bookings.length > 0 ? (
                <div className="space-y-2 border-t border-slate-50 pt-3">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-2">Son Dersler</p>
                  {student.bookings.map((b) => (
                    <div key={b.id} className="flex items-center justify-between text-sm py-1">
                      <span className="font-medium text-navy-900">{b.educator.user.name}</span>
                      <span className="text-slate-400 text-xs">{new Date(b.slot.date).toLocaleDateString("tr-TR")}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 border-t border-slate-50 pt-3">Henüz ders alınmadı.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
