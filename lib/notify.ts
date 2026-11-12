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

// Tüm yöneticilere uygulama içi bildirim (ör. Meet linki üretilemedi)
export async function notifyAdmins(payload: Omit<NotifyPayload, "userId">) {
  const admins = await db.user.findMany({ where: { role: "ADMIN" }, select: { id: true } });
  await Promise.all(admins.map((a) => notify({ userId: a.id, ...payload }).catch((e) => console.error("Admin bildirimi gönderilemedi:", e))));
}
