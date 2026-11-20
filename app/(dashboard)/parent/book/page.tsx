import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import BookingWizard from "@/components/dashboard/BookingWizard";
import Link from "next/link";
import { isSalesOpen } from "@/lib/site-status";

export default async function ParentBookPage({
  searchParams,
}: {
  searchParams: Promise<{ studentId?: string; educatorId?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;

  const parent = await db.parent.findUnique({
    where: { userId: session!.user.id },
    include: { students: { orderBy: { createdAt: "asc" } } },
  });

  if (!parent) redirect("/parent");

  // Satış kapalıyken yalnızca test hesapları rezervasyon yapabilir
  if (!parent.canBookEarly && !(await isSalesOpen())) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-headline-lg text-on-background">Ders Al</h1>
          <p className="text-body-md text-on-surface-variant">Çocuğunuz için uygun öğretmen ve saati seçip ders rezervasyonu yapın</p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-primary/20 p-8 text-center soft-card-static space-y-3">
          <p className="text-4xl">📚</p>
          <h2 className="font-display text-headline-md text-on-background">Dersler çok yakında başlıyor!</h2>
          <p className="text-body-md text-on-surface-variant max-w-lg mx-auto leading-relaxed">
            Ders rezervasyonu açıldığında kayıtlı e-posta adresinize haber vereceğiz. Bu arada çocuğunuzu ekleyebilir,
            ücretsiz kaynaklarımızı ve eğitim oyunlarımızı kullanabilirsiniz.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/parent/students" className="rounded-full squishy-btn bg-primary text-on-primary px-6 py-3 text-label-md font-semibold">Çocuğumu Ekle</Link>
            <Link href="/kaynaklar" className="rounded-full bg-surface-container text-on-background px-6 py-3 text-label-md font-semibold hover:bg-surface-container-high transition">Ücretsiz Kaynaklar</Link>
            <Link href="/oyunlar" className="rounded-full bg-surface-container text-on-background px-6 py-3 text-label-md font-semibold hover:bg-surface-container-high transition">Eğitim Oyunları</Link>
          </div>
        </div>
      </div>
    );
  }

  const educators = await db.educator.findMany({
    where: { status: "APPROVED" },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-headline-lg text-on-background">Ders Al</h1>
        <p className="text-body-md text-on-surface-variant">Çocuğunuz için uygun öğretmen ve saati seçip ders rezervasyonu yapın</p>
      </div>
      <BookingWizard
        parentId={parent.id}
        students={parent.students.map((s) => ({
          id: s.id,
          name: s.name,
          gradeLevel: s.gradeLevel,
        }))}
        educators={educators.map((e) => ({
          id: e.id,
          name: e.user.name ?? "",
          bio: e.bio,
          subjects: e.subjects,
          gradeLevels: e.gradeLevels,
          hourlyRate: e.hourlyRate.toNumber(),
        }))}
        defaultStudentId={params.studentId}
        defaultEducatorId={params.educatorId}
      />
    </div>
  );
}
