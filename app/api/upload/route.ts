import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

const BUCKET = "uploads";
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "misc";

  if (!file) return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: "Dosya 5MB'dan büyük olamaz" }, { status: 400 });
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: "Desteklenmeyen dosya formatı" }, { status: 400 });

  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${folder}/${session.user.id}/${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);

  return NextResponse.json({ url: data.publicUrl, path });
}
