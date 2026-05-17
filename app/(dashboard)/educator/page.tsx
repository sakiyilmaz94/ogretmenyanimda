import { auth } from "@/auth";
import { db } from "@/lib/db";
import Link from "next/link";

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
    },
  });

  if (!educator) return null;

  const totalBookings = await db.booking.count({ where: { educatorId: educator.id } });
  const confirmedBookings = await db.booking.count({
    where: { educatorId: educator.id, status: "CONFIRMED" },
  });
  const availableSlots = await db.availabilitySlot.count({
    where: { educatorId: educator.id, isBooked: false },
  });

  const isPending = educator.status === "PENDING";
  const isRejected = educator.status === "REJECTED";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Hoş geldiniz, {session?.user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-gray-500">Eğitmen panelinize genel bakış</p>
      </div>

      {isPending && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-yellow-800 font-medium">⏳ Hesabınız onay bekliyor</p>
          <p className="text-yellow-700 text-sm mt-1">
            Admin onayladıktan sonra derslerinizi yayınlayabilirsiniz.
          </p>
        </div>
      )}

      {isRejected && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-800 font-medium">❌ Başvurunuz reddedildi</p>
          {educator.rejectionNote && (
            <p className="text-red-700 text-sm mt-1">Sebep: {educator.rejectionNote}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Toplam Rezervasyon", value: totalBookings, icon: "📋" },
          { label: "Aktif Ders", value: confirmedBookings, icon: "✅" },
          { label: "Boş Slot", value: availableSlots, icon: "📅" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/educator/availability"
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition block"
        >
          <div className="text-3xl mb-3">📅</div>
          <h3 className="font-semibold text-gray-900">Uygunluk Takvimi</h3>
          <p className="text-sm text-gray-500 mt-1">
            Müsait olduğunuz saatleri belirleyin
          </p>
        </Link>

        <Link
          href="/educator/bookings"
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition block"
        >
          <div className="text-3xl mb-3">📋</div>
          <h3 className="font-semibold text-gray-900">Rezervasyonlarım</h3>
          <p className="text-sm text-gray-500 mt-1">
            Gelen ders taleplerini yönetin
          </p>
        </Link>
      </div>

      {educator.bookings.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Son Rezervasyonlar</h2>
          <div className="space-y-3">
            {educator.bookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium">{b.student.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(b.slot.date).toLocaleDateString("tr-TR")} — {b.slot.startTime}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  b.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                  b.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  {b.status === "CONFIRMED" ? "Onaylı" : b.status === "PENDING" ? "Beklemede" : b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
