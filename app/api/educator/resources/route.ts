import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const educator = await db.educator.findUnique({ where: { userId: session.user.id } });
  if (!educator) return NextResponse.json({ error: "Öğretmen bulunamadı" }, { status: 404 });

  const resources = await db.educatorResource.findMany({
    where: { educatorId: educator.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(resources);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const educator = await db.educator.findUnique({ where: { userId: session.user.id } });
  if (!educator) return NextResponse.json({ error: "Öğretmen bulunamadı" }, { status: 404 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const subject = formData.get("subject") as string | null;

  if (!file || !title) {
    return NextResponse.json({ error: "Dosya ve başlık zorunludur." }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Dosya 10MB'den büyük olamaz." }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "pdf";
  const fileName = `${educator.id}/${Date.now()}.${ext}`;
  const bytes = await file.arrayBuffer();

  const { error: uploadError } = await supabaseAdmin.storage
    .from("educator-resources")
    .upload(fileName, bytes, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: "Dosya yüklenemedi: " + uploadError.message }, { status: 500 });
  }

  const { data: urlData } = supabaseAdmin.storage
    .from("educator-resources")
    .getPublicUrl(fileName);

  const resource = await db.educatorResource.create({
    data: {
      educatorId: educator.id,
      title,
      description: description || null,
      fileUrl: urlData.publicUrl,
      subject: (subject as never) || null,
      isFree: true,
    },
  });

  return NextResponse.json(resource, { status: 201 });
}
