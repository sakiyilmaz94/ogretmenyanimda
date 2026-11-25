import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getCommissionRate, getScheduledChange } from "@/lib/finance";

// Yalnızca giriş yapmış ÖĞRETMEN: kendi panelinde göstereceği geçerli ve planlı komisyon oranı (herkese açık değil)
export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "EDUCATOR") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const [rate, scheduled] = await Promise.all([getCommissionRate(), getScheduledChange()]);
  return NextResponse.json({ rate, scheduled });
}
