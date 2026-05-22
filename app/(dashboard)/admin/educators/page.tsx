import { db } from "@/lib/db";
import EducatorApprovalCard from "@/components/dashboard/EducatorApprovalCard";

export default async function AdminEducatorsPage() {
  const raw = await db.educator.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  // Decimal → number (client component'e JSON olarak geçebilsin)
  const educators = raw.map((e) => ({
    ...e,
    hourlyRate: e.hourlyRate.toNumber(),
  }));

  const pending = educators.filter((e) => e.status === "PENDING");
  const approved = educators.filter((e) => e.status === "APPROVED");
  const rejected = educators.filter((e) => e.status === "REJECTED");

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="font-display text-headline-md text-on-background">Öğretmen Yönetimi</h1>
        <p className="text-label-md text-on-surface-variant mt-0.5">Tüm öğretmenleri görüntüleyin ve yönetin</p>
      </div>

      {pending.length > 0 && (
        <section>
          <h2 className="text-label-md text-on-surface-variant mb-4 flex items-center gap-2">
            <span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full text-caption font-semibold">
              Onay Bekleyen ({pending.length})
            </span>
          </h2>
          <div className="space-y-3">
            {pending.map((e) => (
              <EducatorApprovalCard key={e.id} educator={e} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-label-md text-on-surface-variant mb-4 flex items-center gap-2">
          <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-caption font-semibold">
            Onaylı Öğretmenler ({approved.length})
          </span>
        </h2>
        {approved.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-md p-12 text-center soft-card-static border border-outline-variant/20">
            <div className="bg-primary-fixed rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-on-primary-fixed-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-display text-headline-md text-on-background mb-2">Henüz onaylı öğretmen yok</h3>
            <p className="text-label-md text-on-surface-variant">Onaylanan öğretmenler burada görünecek.</p>
          </div>
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
          <h2 className="text-label-md text-on-surface-variant mb-4 flex items-center gap-2">
            <span className="bg-error-container text-on-error-container px-3 py-1 rounded-full text-caption font-semibold">
              Reddedilmiş ({rejected.length})
            </span>
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
