import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

const GRADES = ["ILKOKUL_1", "ILKOKUL_2", "ILKOKUL_3", "ILKOKUL_4", "ALL"];

async function requireAdmin() {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const { grade, title, url } = await req.json();

  if (!GRADES.includes(grade)) return NextResponse.json({ error: "Sınıf seçin." }, { status: 400 });
  const t = typeof title === "string" ? title.trim() : "";
  if (t.length < 2 || t.length > 120) return NextResponse.json({ error: "Kaynak adı 2-120 karakter olmalı." }, { status: 400 });
  let link: URL;
  try { link = new URL(typeof url === "string" ? url.trim() : ""); } catch {
    return NextResponse.json({ error: "Geçerli bir link yapıştırın." }, { status: 400 });
  }
  if (link.protocol !== "https:") return NextResponse.json({ error: "Link https ile başlamalı." }, { status: 400 });

  const created = await db.freeResource.create({ data: { grade: grade === "ALL" ? null : grade, title: t, url: link.toString() } });
  revalidatePath("/kaynaklar");
  return NextResponse.json(created);
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id gerekli" }, { status: 400 });
  await db.freeResource.deleteMany({ where: { id } });
  revalidatePath("/kaynaklar");
  return NextResponse.json({ ok: true });
}
