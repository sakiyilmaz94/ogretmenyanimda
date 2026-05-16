import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "EDUCATOR") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { educatorId, date, startTime, endTime } = await req.json();

  const existing = await db.availabilitySlot.findUnique({
    where: { educatorId_date_startTime: { educatorId, date: new Date(date), startTime } },
  });

  if (existing) {
    return NextResponse.json({ error: "Bu slot zaten mevcut." }, { status: 400 });
  }

  const slot = await db.availabilitySlot.create({
    data: {
      educatorId,
      date: new Date(date),
      startTime,
      endTime,
    },
  });

  return NextResponse.json(slot);
}
