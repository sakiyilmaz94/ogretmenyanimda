import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? "noreply@ogretmenyanimda.com.tr";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailPayload) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY eksik, email atlandı.");
    return;
  }
  const result = await resend.emails.send({ from: FROM, to, subject, html });
  if (result.error) {
    console.error("Resend hatası:", JSON.stringify(result.error));
    throw new Error(result.error.message);
  }
  console.log("Email gönderildi:", result.data?.id, "→", to);
}

// --- Şablonlar ---

export function emailBookingRequest({
  educatorName,
  studentName,
  subject,
  date,
  time,
  notes,
}: {
  educatorName: string;
  studentName: string;
  subject: string;
  date: string;
  time: string;
  notes?: string | null;
}) {
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
      <h2 style="color:#0f172a">Yeni Ders Talebi</h2>
      <p>Merhaba <strong>${educatorName}</strong>,</p>
      <p>Aşağıdaki talep paneline düşmüştür. Lütfen onaylayın veya reddedin.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;color:#64748b">Öğrenci</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600">${studentName}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;color:#64748b">Ders</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600">${subject}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;color:#64748b">Tarih</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600">${date}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;color:#64748b">Saat</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600">${time}</td></tr>
        ${notes ? `<tr><td style="padding:8px;color:#64748b">Not</td><td style="padding:8px;font-style:italic">${notes}</td></tr>` : ""}
      </table>
      <a href="https://ogretmenyanimda.com.tr/educator/bookings" style="display:inline-block;background:#0f172a;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Panelde Görüntüle</a>
    </div>`;
}

export function emailBookingConfirmed({
  parentName,
  educatorName,
  studentName,
  date,
  time,
  amount,
}: {
  parentName: string;
  educatorName: string;
  studentName: string;
  date: string;
  time: string;
  amount: string;
}) {
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
      <h2 style="color:#15803d">Randevunuz Onaylandı ✓</h2>
      <p>Merhaba <strong>${parentName}</strong>,</p>
      <p><strong>${educatorName}</strong> randevu talebinizi onayladı. Dersi kesinleştirmek için ödemeyi tamamlayın.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;color:#64748b">Öğrenci</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600">${studentName}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;color:#64748b">Öğretmen</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600">${educatorName}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;color:#64748b">Tarih</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600">${date}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;color:#64748b">Saat</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600">${time}</td></tr>
        <tr><td style="padding:8px;color:#64748b">Ödeme Tutarı</td><td style="padding:8px;font-weight:600;color:#d97706">${amount}</td></tr>
      </table>
      <a href="https://ogretmenyanimda.com.tr/parent/bookings" style="display:inline-block;background:#d97706;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Ödeme Yap →</a>
    </div>`;
}

export function emailPaymentReceived({
  educatorName,
  studentName,
  date,
  time,
  amount,
}: {
  educatorName: string;
  studentName: string;
  date: string;
  time: string;
  amount: string;
}) {
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
      <h2 style="color:#0f172a">Ödeme Alındı</h2>
      <p>Merhaba <strong>${educatorName}</strong>,</p>
      <p>${studentName} için ders ödemesi tamamlandı.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;color:#64748b">Öğrenci</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600">${studentName}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;color:#64748b">Tarih</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600">${date}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;color:#64748b">Saat</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600">${time}</td></tr>
        <tr><td style="padding:8px;color:#64748b">Tutar</td><td style="padding:8px;font-weight:600;color:#15803d">${amount}</td></tr>
      </table>
      <a href="https://ogretmenyanimda.com.tr/educator/bookings" style="display:inline-block;background:#0f172a;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Panelde Görüntüle</a>
    </div>`;
}
