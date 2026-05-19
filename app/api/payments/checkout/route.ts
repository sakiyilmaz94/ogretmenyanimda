import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { initCheckoutForm } from "@/lib/iyzico";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "PARENT") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { bookingId } = await req.json();
  if (!bookingId) {
    return NextResponse.json({ error: "bookingId gerekli" }, { status: 400 });
  }

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: {
      student: { include: { parent: { include: { user: true } } } },
      educator: { include: { user: true } },
      payment: true,
    },
  });

  if (!booking || booking.student.parent.userId !== session.user.id) {
    return NextResponse.json({ error: "Rezervasyon bulunamadı" }, { status: 404 });
  }

  if (booking.payment?.status === "PAID") {
    return NextResponse.json({ error: "Bu rezervasyon zaten ödendi" }, { status: 400 });
  }

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const proto = host.startsWith("localhost") ? "http" : "https";
  const callbackUrl = `${proto}://${host}/api/payments/callback`;

  const parentUser = booking.student.parent.user;
  const [buyerName, ...surnameParts] = (parentUser.name ?? "Veli").split(" ");
  const buyerSurname = surnameParts.join(" ") || "Yok";

  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "127.0.0.1";

  const result = await initCheckoutForm({
    bookingId: booking.id,
    amount: Number(booking.totalPrice),
    buyerName,
    buyerSurname,
    buyerEmail: parentUser.email ?? "no-email@example.com",
    buyerPhone: booking.student.parent.phone ?? "+905000000000",
    buyerIp: ip,
    studentName: booking.student.name,
    educatorName: booking.educator.user.name ?? "Eğitmen",
    callbackUrl,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  // Token'ı Payment kaydına sakla
  if (booking.payment) {
    await db.payment.update({
      where: { id: booking.payment.id },
      data: { iyzicoToken: result.token },
    });
  }

  return NextResponse.json({
    checkoutFormContent: result.checkoutFormContent,
    token: result.token,
    mockMode: result.mockMode ?? false,
  });
}
