import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Prisma, Subject, GradeLevel, EducatorStatus } from "@prisma/client";

// Admin: bir öğretmenin bilgilerini (ders saat ücreti dahil) düzenler
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const data: Prisma.EducatorUpdateInput = {};

  if (body.hourlyRate !== undefined && body.hourlyRate !== null && body.hourlyRate !== "") {
    const rate = Number(body.hourlyRate);
    if (Number.isNaN(rate) || rate < 0) {
      return NextResponse.json({ error: "Geçersiz ücret" }, { status: 400 });
    }
    data.hourlyRate = new Prisma.Decimal(rate);
  }
  if (typeof body.bio === "string") data.bio = body.bio.trim() || null;
  if (typeof body.titleName === "string") data.titleName = body.titleName.trim() || null;
  if (body.experience !== undefined) {
    data.experience = body.experience === "" || body.experience === null ? null : Number(body.experience);
  }
  if (typeof body.phone === "string") data.phone = body.phone.trim() || null;
  if (typeof body.isProfilePublic === "boolean") data.isProfilePublic = body.isProfilePublic;

  if (Array.isArray(body.subjects)) {
    data.subjects = body.subjects.filter((s: string): s is Subject => s in Subject);
  }
  if (Array.isArray(body.gradeLevels)) {
    data.gradeLevels = body.gradeLevels.filter((g: string): g is GradeLevel => g in GradeLevel);
  }
  if (typeof body.status === "string" && body.status in EducatorStatus) {
    data.status = body.status as EducatorStatus;
  }

  await db.educator.update({ where: { id }, data });

  revalidatePath(`/admin/educators/${id}`);
  revalidatePath("/admin/educators");
  return NextResponse.json({ ok: true });
}
