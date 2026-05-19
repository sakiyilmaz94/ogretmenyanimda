import { db } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase-admin";

interface NotifyPayload {
  userId: string;
  title: string;
  message: string;
  link?: string;
}

export async function notify({ userId, title, message, link }: NotifyPayload) {
  // DB kaydı
  await db.notification.create({ data: { userId, title, message, link: link ?? null } });

  // Realtime broadcast — kullanıcının kanalına anlık ilet
  await supabaseAdmin.channel(`user-${userId}`).send({
    type: "broadcast",
    event: "notification",
    payload: { title, message, link },
  });
}
