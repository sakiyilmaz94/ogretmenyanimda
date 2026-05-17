import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slotId: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "EDUCATOR") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { slotId } = await params;
  const slot = await db.availabilitySlot.findUnique({ where: { id: slotId } });

  if (!slot || slot.isBooked) {
    return NextResponse.json({ error: "Slot silinemez." }, { status: 400 });
  }

  await db.availabilitySlot.delete({ where: { id: slotId } });
  return NextResponse.json({ success: true });
}
