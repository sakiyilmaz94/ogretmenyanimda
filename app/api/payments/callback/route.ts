import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { retrieveCheckoutForm } from "@/lib/iyzico";

// iyzico POST callback ile token gönderir
export async function POST(req: Request) {
  let token: string | undefined;

  const contentType = req.headers.get("content-type") ?? "";
  if (contentType.includes("application/x-www-form-urlencoded")) {
    const text = await req.text();
    const params = new URLSearchParams(text);
    token = params.get("token") ?? undefined;
  } else {
    const body = await req.json().catch(() => ({}));
    token = body.token;
  }

  if (!token) {
    return NextResponse.redirect(
      new URL("/parent/bookings?payment=failed", req.url)
    );
  }

  const result = await retrieveCheckoutForm(token);

  if (!result.success || !result.bookingId) {
    return NextResponse.redirect(
      new URL("/parent/bookings?payment=failed", req.url)
    );
  }

  try {
    const booking = await db.booking.findUnique({
      where: { id: result.bookingId },
      include: { payment: true },
    });

    if (!booking) {
      return NextResponse.redirect(
        new URL("/parent/bookings?payment=failed", req.url)
      );
    }

    await db.$transaction([
      db.booking.update({
        where: { id: booking.id },
        data: { status: "CONFIRMED" },
      }),
      ...(booking.payment
        ? [
            db.payment.update({
              where: { id: booking.payment.id },
              data: {
                status: "PAID",
                iyzicoPaymentId: result.paymentId,
              },
            }),
          ]
        : []),
    ]);
  } catch {
    return NextResponse.redirect(
      new URL("/parent/bookings?payment=failed", req.url)
    );
  }

  return NextResponse.redirect(
    new URL(`/parent/bookings?payment=success&bookingId=${result.bookingId}`, req.url)
  );
}
