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

      {parent.students.length === 0 ? (
        <div className="bg-blue-50 rounded-xl p-8 text-center">
          <p className="text-2xl mb-3">🎒</p>
          <h3 className="font-semibold text-gray-900 mb-2">Henüz öğrenci eklemediniz</h3>
          <p className="text-gray-500 text-sm mb-4">
            Çocuğunuz için ders rezervasyonu yapabilmek için önce öğrenci ekleyin.
          </p>
          <Link
            href="/parent/students"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Öğrenci Ekle
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {parent.students.map((student) => (
            <div key={student.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-500">
                    {student.gradeLevel.replace("_", " ").replace("ILKOKUL", "İlkokul").replace("ORTAOKUL", "Ortaokul")}
                  </p>
                </div>
                <Link
                  href={`/parent/book?studentId=${student.id}`}
                  className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
                >
                  Ders Al
                </Link>
              </div>

              {student.bookings.length > 0 && (
                <div className="space-y-2">
                  {student.bookings.map((b) => (
                    <div key={b.id} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0">
                      <span className="text-gray-600">{b.educator.user.name}</span>
                      <span className="text-gray-500">{new Date(b.slot.date).toLocaleDateString("tr-TR")}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
