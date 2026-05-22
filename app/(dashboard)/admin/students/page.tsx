import { db } from "@/lib/db";
import { formatDate, GRADE_LABELS } from "@/lib/utils";

export default async function AdminStudentsPage() {
  const students = await db.student.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      parent: { include: { user: true } },
      bookings: { select: { id: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-headline-md text-on-background">Öğrenci Yönetimi</h1>
          <p className="text-label-md text-on-surface-variant mt-0.5">Platforma kayıtlı tüm öğrenciler</p>
        </div>
        <span className="bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full text-caption font-semibold">
          {students.length} öğrenci
        </span>
      </div>

      <div className="bg-surface-container-lowest rounded-md soft-card-static overflow-hidden border border-outline-variant/20">
        <table className="w-full text-body-md">
          <thead className="bg-surface-container">
            <tr>
              <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Öğrenci</th>
              <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Sınıf</th>
              <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Veli</th>
              <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Rezervasyon</th>
              <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Kayıt Tarihi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {students.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-on-surface-variant text-label-md">
                  Henüz öğrenci bulunmuyor.
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr key={s.id} className="hover:bg-surface-container-low transition">
                  <td className="px-5 py-3.5 font-medium text-on-background">{s.name}</td>
                  <td className="px-5 py-3.5 text-on-surface-variant">{GRADE_LABELS[s.gradeLevel] ?? s.gradeLevel}</td>
                  <td className="px-5 py-3.5 text-on-surface-variant">{s.parent.user.name}</td>
                  <td className="px-5 py-3.5">
                    <span className="bg-primary-fixed text-on-primary-fixed-variant text-caption px-2 py-0.5 rounded-full font-semibold">
                      {s.bookings.length} ders
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-on-surface-variant">{formatDate(s.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
