import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

const BUCKET = "uploads";
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_DIPLOMA = ["application/pdf"];
const ALLOWED_IDCARD = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const type = formData.get("type") as string | null;

  if (!file) return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
  if (!["diploma", "idcard"].includes(type ?? ""))
    return NextResponse.json({ error: "Geçersiz tür" }, { status: 400 });
  if (file.size > MAX_SIZE)
    return NextResponse.json({ error: "Dosya 5MB'dan büyük olamaz" }, { status: 400 });

  const allowed = type === "diploma" ? ALLOWED_DIPLOMA : ALLOWED_IDCARD;
  if (!allowed.includes(file.type))
    return NextResponse.json(
      { error: type === "diploma" ? "Yalnızca PDF kabul edilir" : "JPG veya PNG yükleyin" },
      { status: 400 }
    );

  const ext = file.name.split(".").pop() ?? "bin";
  const path = `registration/${type}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
