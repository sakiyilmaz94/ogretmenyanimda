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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Öğrenci Yönetimi</h1>
        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
          {students.length} öğrenci
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Öğrenci</th>
              <th className="text-left px-4 py-3 font-medium">Sınıf</th>
              <th className="text-left px-4 py-3 font-medium">Veli</th>
              <th className="text-left px-4 py-3 font-medium">Rezervasyon</th>
              <th className="text-left px-4 py-3 font-medium">Kayıt Tarihi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  Henüz öğrenci bulunmuyor.
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3">{GRADE_LABELS[s.gradeLevel] ?? s.gradeLevel}</td>
                  <td className="px-4 py-3 text-gray-600">{s.parent.user.name}</td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                      {s.bookings.length} ders
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(s.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
