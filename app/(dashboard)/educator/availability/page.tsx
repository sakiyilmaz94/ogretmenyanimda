import { auth } from "@/auth";
import { db } from "@/lib/db";
import AvailabilityManager from "@/components/dashboard/AvailabilityManager";

export default async function AvailabilityPage() {
  const session = await auth();
  const educator = await db.educator.findUnique({
    where: { userId: session!.user.id },
  });

  if (!educator) return null;

  const slots = await db.availabilitySlot.findMany({
    where: {
      educatorId: educator.id,
      date: { gte: new Date() },
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Uygunluk Takvimi</h1>
        <p className="text-gray-500">Müsait olduğunuz gün ve saatleri belirleyin</p>
      </div>
      <AvailabilityManager
        educatorId={educator.id}
        existingSlots={slots.map((s) => ({
          ...s,
          date: s.date.toISOString(),
        }))}
      />
    </div>
  );
}
