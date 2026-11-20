import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Admin: veli üzerinde ayar (şimdilik yalnızca test hesabı işareti)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  if (typeof body.canBookEarly !== "boolean") {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }
  const updated = await db.parent.updateMany({ where: { id }, data: { canBookEarly: body.canBookEarly } });
  if (updated.count === 0) return NextResponse.json({ error: "Veli bulunamadı" }, { status: 404 });
  revalidatePath(`/admin/parents/${id}`);
  return NextResponse.json({ ok: true });
}
