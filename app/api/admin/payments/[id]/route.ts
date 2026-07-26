import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notify } from "@/lib/notify";
import { revalidatePath } from "next/cache";

// Admin bir IBAN havalesini onaylar (PAID) — velinin havalesini bankadan görüp işaretler.
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { id } = await params;
  const { action } = await req.json();

  const payment = await db.payment.findUnique({
    where: { id },
    include: {
      booking: {
        include: {
          student: { include: { parent: { include: { user: true } } } },
          educator: { include: { user: true } },
        },
      },
    },
  });
  if (!payment) return NextResponse.json({ error: "Ödeme bulunamadı" }, { status: 404 });

  if (action !== "approve") {
    return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
  }
  if (payment.status === "PAID") {
    return NextResponse.json({ error: "Bu ödeme zaten onaylanmış." }, { status: 400 });
  }

  await db.payment.update({ where: { id }, data: { status: "PAID" } });
  await db.booking.update({ where: { id: payment.bookingId }, data: { status: "COMPLETED" } });

  const parentUserId = payment.booking.student.parent.user.id;
  await notify({
    userId: parentUserId,
    title: "Ödemeniz Onaylandı ✓",
    message: `${payment.booking.student.name} için havaleniz onaylandı, randevunuz kesinleşti.`,
    link: "/parent/bookings",
  });
  await notify({
    userId: payment.booking.educator.userId,
    title: "Ödeme Onaylandı — Randevu Kesinleşti",
    message: `${payment.booking.student.name} için ödeme onaylandı. Randevu kesinleşmiştir.`,
    link: "/educator/bookings",
  });

  revalidatePath("/admin/payments");
  return NextResponse.json({ ok: true });
}
