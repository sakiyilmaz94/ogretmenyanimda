import { db } from "@/lib/db";
import EducatorApprovalCard from "@/components/dashboard/EducatorApprovalCard";

export default async function AdminEducatorsPage() {
  const educators = await db.educator.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  const pending = educators.filter((e) => e.status === "PENDING");
  const approved = educators.filter((e) => e.status === "APPROVED");
  const rejected = educators.filter((e) => e.status === "REJECTED");

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Öğretmen Yönetimi</h1>

      {pending.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-yellow-700 mb-4 flex items-center gap-2">
            ⏳ Onay Bekleyen ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map((e) => (
              <EducatorApprovalCard key={e.id} educator={e} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
          ✅ Onaylı Öğretmenler ({approved.length})
        </h2>
        {approved.length === 0 ? (
          <p className="text-gray-500 text-sm">Henüz onaylı öğretmen yok.</p>
        ) : (
          <div className="space-y-3">
            {approved.map((e) => (
              <EducatorApprovalCard key={e.id} educator={e} />
            ))}
          </div>
        )}
      </section>

      {rejected.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
            ❌ Reddedilmiş ({rejected.length})
          </h2>
          <div className="space-y-3">
            {rejected.map((e) => (
              <EducatorApprovalCard key={e.id} educator={e} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
