import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notify } from "@/lib/notify";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ bookingId: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { bookingId } = await params;
  const { action } = await req.json();

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: {
      educator: true,
      student: { include: { parent: true } },
    },
  });
  if (!booking) return NextResponse.json({ error: "Rezervasyon bulunamadı" }, { status: 404 });

  if (session.user.role === "EDUCATOR") {
    if (booking.educator.userId !== session.user.id) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
    }
    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
    }

    const newStatus = action === "approve" ? "CONFIRMED" : "CANCELLED";
    const updated = await db.booking.update({ where: { id: bookingId }, data: { status: newStatus } });

    // Veliye bildir
    await notify({
      userId: booking.student.parent.userId,
      title: action === "approve" ? "Rezervasyon Onaylandı" : "Rezervasyon Reddedildi",
      message: action === "approve"
        ? "Ders rezervasyonunuz eğitmen tarafından onaylandı."
        : "Ders rezervasyonunuz eğitmen tarafından reddedildi.",
      link: "/parent/bookings",
    });

    return NextResponse.json(updated);
  }

  if (session.user.role === "ADMIN") {
    const statusMap: Record<string, string> = {
      confirm: "CONFIRMED", cancel: "CANCELLED", complete: "COMPLETED",
    };
    if (!statusMap[action]) return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });

    const updated = await db.booking.update({
      where: { id: bookingId },
      data: { status: statusMap[action] as never },
    });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
}
