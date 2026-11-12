import { db } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendEmail } from "@/lib/email";

// Yönetici uyarılarının e-postayla da gideceği adres (ADMIN_ALERT_EMAIL ile değiştirilebilir)
const ADMIN_ALERT_EMAIL = process.env.ADMIN_ALERT_EMAIL ?? "kisiegitimi@gmail.com";

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

// Yöneticilere uygulama içi bildirim + e-posta (ör. Meet linki üretilemedi)
export async function notifyAdmins(payload: Omit<NotifyPayload, "userId">) {
  const admins = await db.user.findMany({ where: { role: "ADMIN" }, select: { id: true } });
  await Promise.all(admins.map((a) => notify({ userId: a.id, ...payload }).catch((e) => console.error("Admin bildirimi gönderilemedi:", e))));

  const url = payload.link ? `https://ogretmenyanimda.com.tr${payload.link}` : "https://ogretmenyanimda.com.tr/admin";
  await sendEmail({
    to: ADMIN_ALERT_EMAIL,
    subject: `⚠️ ${payload.title}`,
    html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
      <h2 style="color:#b45309">${payload.title}</h2>
      <p>${payload.message}</p>
      <a href="${url}" style="display:inline-block;background:#4648D4;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Admin paneline git →</a>
    </div>`,
  }).catch((e) => console.error("Admin uyarı e-postası gönderilemedi:", e));
}
