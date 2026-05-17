import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import BookingWizard from "@/components/dashboard/BookingWizard";

export default async function ParentBookPage({
  searchParams,
}: {
  searchParams: Promise<{ studentId?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;

  const parent = await db.parent.findUnique({
    where: { userId: session!.user.id },
    include: { students: { orderBy: { createdAt: "asc" } } },
  });

  if (!parent) redirect("/parent");
  if (parent.students.length === 0) redirect("/parent/students");

  const educators = await db.educator.findMany({
    where: { status: "APPROVED" },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ders Rezervasyonu</h1>
        <p className="text-gray-500">Çocuğunuz için uygun eğitmen ve saati seçin</p>
      </div>
      <BookingWizard
        students={parent.students.map((s) => ({
          ...s,
          birthDate: s.birthDate?.toISOString() ?? null,
          createdAt: s.createdAt.toISOString(),
          updatedAt: s.updatedAt.toISOString(),
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
      />
    </div>
  );
}
