import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { educatorId, action, rejectionNote } = await req.json();

  if (action === "approve") {
    await db.educator.update({
      where: { id: educatorId },
      data: { status: "APPROVED", approvedAt: new Date() },
    });
  } else if (action === "reject") {
    await db.educator.update({
      where: { id: educatorId },
      data: { status: "REJECTED", rejectedAt: new Date(), rejectionNote },
    });
  }

  return NextResponse.json({ success: true });
}
