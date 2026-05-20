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

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "EDUCATOR") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { educatorId, date, startTime, endTime } = await req.json();

  // Aynı güne ait rezerve edilmemiş slotları sil (yenisiyle değiştir)
  await db.availabilitySlot.deleteMany({
    where: {
      educatorId,
      date: new Date(date),
      isBooked: false,
    },
  });

  const slot = await db.availabilitySlot.create({
    data: { educatorId, date: new Date(date), startTime, endTime },
  });

  return NextResponse.json(slot);
}
