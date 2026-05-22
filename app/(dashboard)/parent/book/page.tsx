import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import BookingWizard from "@/components/dashboard/BookingWizard";

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

  const educators = await db.educator.findMany({
    where: { status: "APPROVED" },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-headline-lg text-on-background">Ders Rezervasyonu</h1>
        <p className="text-body-md text-on-surface-variant">Çocuğunuz için uygun öğretmen ve saati seçin</p>
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
