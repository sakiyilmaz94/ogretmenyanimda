import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;
  const educator = await db.educator.findUnique({ where: { userId: session.user.id } });
  if (!educator) return NextResponse.json({ error: "Öğretmen bulunamadı" }, { status: 404 });

  const resource = await db.educatorResource.findFirst({
    where: { id, educatorId: educator.id },
  });
  if (!resource) return NextResponse.json({ error: "Kaynak bulunamadı" }, { status: 404 });

  const pathMatch = resource.fileUrl.match(/educator-resources\/(.+)$/);
  if (pathMatch) {
    await supabaseAdmin.storage.from("educator-resources").remove([pathMatch[1]]);
  }

  await db.educatorResource.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
