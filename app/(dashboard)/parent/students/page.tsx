import { auth } from "@/auth";
import { db } from "@/lib/db";
import StudentManager from "@/components/dashboard/StudentManager";

export default async function ParentStudentsPage() {
  const session = await auth();
  const parent = await db.parent.findUnique({
    where: { userId: session!.user.id },
    include: { students: { orderBy: { createdAt: "asc" } } },
  });

  if (!parent) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Öğrencilerim</h1>
        <p className="text-gray-500">Çocuklarınızın bilgilerini yönetin</p>
      </div>
      <StudentManager
        parentId={parent.id}
        students={parent.students.map((s) => ({
          ...s,
          birthDate: s.birthDate?.toISOString() ?? null,
          createdAt: s.createdAt.toISOString(),
          updatedAt: s.updatedAt.toISOString(),
        }))}
      />
    </div>
  );
}
