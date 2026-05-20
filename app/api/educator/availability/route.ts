import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const educatorId = searchParams.get("educatorId");
  const available = searchParams.get("available") === "true";

  if (!educatorId) {
    return NextResponse.json({ error: "educatorId gerekli." }, { status: 400 });
  }

  const slots = await db.availabilitySlot.findMany({
    where: {
      educatorId,
      date: { gte: new Date() },
      ...(available ? { isBooked: false } : {}),
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  return NextResponse.json(
    slots.map((s) => ({ ...s, date: s.date.toISOString().split("T")[0] }))
  );
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "EDUCATOR") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { educatorId, date, startTime, endTime } = await req.json();

  const startMins = timeToMinutes(startTime);
  const endMins = timeToMinutes(endTime);

  if (endMins - startMins < 60) {
    return NextResponse.json({ error: "En az 1 saatlik pencere gerekli." }, { status: 400 });
  }

  // Aynı güne ait rezerve edilmemiş slotları sil
  await db.availabilitySlot.deleteMany({
    where: { educatorId, date: new Date(date), isBooked: false },
  });

  // Zaman penceresini 1'er saatlik slotlara böl
  const slotsToCreate = [];
  for (let t = startMins; t + 60 <= endMins; t += 60) {
    slotsToCreate.push({
      educatorId,
      date: new Date(date),
      startTime: minutesToTime(t),
      endTime: minutesToTime(t + 60),
    });
  }

  await db.availabilitySlot.createMany({ data: slotsToCreate });

  return NextResponse.json({ created: slotsToCreate.length });
}
