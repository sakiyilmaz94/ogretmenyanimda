import { Resend } from "resend";

const FROM = process.env.RESEND_FROM_EMAIL ?? "noreply@ogretmenyanimda.com.tr";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "placeholder");
}

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
  const result = await getResend().emails.send({ from: FROM, to, subject, html });
  if (result.error) {
    console.error("Resend hatası:", JSON.stringify(result.error));
    throw new Error(result.error.message);
  }
  console.log("Email gönderildi:", result.data?.id, "→", to);
}

// --- Şablonlar ---

export function emailWelcome({ name, role }: { name: string; role: "EDUCATOR" | "PARENT" }) {
  const isEducator = role === "EDUCATOR";
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:16px">
      <div style="text-align:center;margin-bottom:24px">
        <div style="display:inline-block;background:#0f172a;border-radius:12px;padding:12px 20px">
          <span style="color:white;font-weight:700;font-size:18px">Öğretmen Yanımda</span>
        </div>
      </div>
      <div style="background:white;border-radius:12px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
        <h2 style="color:#0f172a;margin:0 0 8px">Aramıza Hoş Geldiniz! 🎉</h2>
        <p style="color:#475569;margin:0 0 20px">Merhaba <strong>${name}</strong>,</p>
        ${isEducator ? `
          <p style="color:#475569;line-height:1.6">Öğretmen başvurunuz başarıyla alındı. Yöneticilerimiz diplomanızı ve kimlik bilgilerinizi inceleyecek; <strong>1–3 iş günü</strong> içinde onay/red durumunuz e-posta ile bildirilecektir.</p>
          <p style="color:#475569;line-height:1.6">Onaylandıktan sonra profilinizi oluşturabilir, uygunluk saatlerinizi belirleyebilir ve ders vermeye başlayabilirsiniz.</p>
        ` : `
          <p style="color:#475569;line-height:1.6">Hesabınız başarıyla oluşturuldu. Artık onaylı öğretmenlerimiz arasından çocuğunuza en uygun olanı seçebilir, randevu alabilir ve ders ilerlemesini takip edebilirsiniz.</p>
          <div style="margin:24px 0;text-align:center">
            <a href="https://ogretmenyanimda.com.tr/egitmenlerimiz" style="display:inline-block;background:#0f172a;color:white;padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:600">Öğretmenleri Keşfet →</a>
          </div>
        `}
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0"/>
        <p style="color:#94a3b8;font-size:13px;margin:0">Sorularınız için <a href="mailto:destek@ogretmenyanimda.com.tr" style="color:#0f172a">destek@ogretmenyanimda.com.tr</a> adresine yazabilirsiniz.</p>
      </div>
    </div>`;
}

export function emailLessonReportRequest({
  educatorName,
  studentName,
  date,
}: {
  educatorName: string;
  studentName: string;
  date: string;
}) {
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
      <h2 style="color:#0f172a">Ders Raporu Bekleniyor 📋</h2>
      <p>Merhaba <strong>${educatorName}</strong>,</p>
      <p><strong>${studentName}</strong> ile yaptığınız <strong>${date}</strong> tarihli ders tamamlandı.</p>
      <p>Velinin çocuğunun gelişimini takip edebilmesi için lütfen aşağıdaki butona tıklayarak ders raporunu doldurunuz.</p>
      <a href="https://ogretmenyanimda.com.tr/educator/bookings" style="display:inline-block;background:#0f172a;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Raporu Doldur →</a>
      <p style="color:#64748b;font-size:13px;margin-top:16px">Raporda işlenen konular, bir sonraki ders planı ve varsa ödev bilgilerini paylaşmanızı rica ederiz.</p>
    </div>`;
}

export function emailLessonReportReady({
  parentName,
  educatorName,
  studentName,
  date,
}: {
  parentName: string;
  educatorName: string;
  studentName: string;
  date: string;
}) {
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
      <h2 style="color:#15803d">Ders Raporu Hazır ✅</h2>
      <p>Merhaba <strong>${parentName}</strong>,</p>
      <p><strong>${educatorName}</strong>, <strong>${studentName}</strong> için ${date} tarihli ders raporunu doldurdu.</p>
      <p>Raporunuzu görüntülemek için panele gidiniz.</p>
      <a href="https://ogretmenyanimda.com.tr/parent/bookings" style="display:inline-block;background:#15803d;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Raporu Görüntüle →</a>
    </div>`;
}

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
  meetingUrl,
  deadline,
}: {
  parentName: string;
  educatorName: string;
  studentName: string;
  date: string;
  time: string;
  amount: string;
  meetingUrl?: string;
  deadline?: string; // son ödeme tarih/saati (ör. "12 Haziran 14:00")
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
        <tr><td style="padding:8px;${meetingUrl ? "border-bottom:1px solid #e2e8f0;" : ""}color:#64748b">Ödeme Tutarı</td><td style="padding:8px;${meetingUrl ? "border-bottom:1px solid #e2e8f0;" : ""}font-weight:600;color:#d97706">${amount}</td></tr>
        ${meetingUrl ? `<tr><td style="padding:8px;color:#64748b">Google Meet</td><td style="padding:8px;font-weight:600"><a href="${meetingUrl}" style="color:#1a73e8">${meetingUrl}</a></td></tr>` : ""}
      </table>
      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:14px 16px;margin:16px 0;color:#9a3412">
        <strong>⏳ Önemli:</strong> Lütfen <strong>24 saat içinde</strong>${deadline ? ` (son ödeme: <strong>${deadline}</strong>)` : ""} ödemeyi tamamlayın. Aksi halde randevunuz <strong>otomatik olarak iptal edilecek</strong> ve bu saat diğer veliler için yeniden açılacaktır.
      </div>
      <a href="https://ogretmenyanimda.com.tr/parent/bookings" style="display:inline-block;background:#d97706;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Ödeme Yap →</a>
      ${meetingUrl ? `<a href="${meetingUrl}" style="display:inline-block;margin-left:12px;background:#1a73e8;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Google Meet'e Katıl →</a>` : ""}
    </div>`;
}

// 12 saat sonra gönderilen ödeme hatırlatması (henüz ödenmediyse)
export function emailPaymentReminder({
  parentName,
  educatorName,
  studentName,
  date,
  time,
  amount,
  deadline,
}: {
  parentName: string;
  educatorName: string;
  studentName: string;
  date: string;
  time: string;
  amount: string;
  deadline?: string;
}) {
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
      <h2 style="color:#d97706">Ödeme Hatırlatması ⏳</h2>
      <p>Merhaba <strong>${parentName}</strong>,</p>
      <p><strong>${studentName}</strong> için <strong>${educatorName}</strong> ile aldığınız dersin ödemesi henüz tamamlanmadı.</p>
      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:14px 16px;margin:16px 0;color:#9a3412">
        <strong>Son ödeme${deadline ? `: ${deadline}` : " yaklaşıyor"}.</strong> Bu süre içinde ödeme yapılmazsa randevu <strong>otomatik iptal edilecek</strong> ve saat yeniden açılacaktır.
      </div>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;color:#64748b">Ders</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600">${date} · ${time}</td></tr>
        <tr><td style="padding:8px;color:#64748b">Ödeme Tutarı</td><td style="padding:8px;font-weight:600;color:#d97706">${amount}</td></tr>
      </table>
      <a href="https://ogretmenyanimda.com.tr/parent/bookings" style="display:inline-block;background:#d97706;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Hemen Ödeme Yap →</a>
    </div>`;
}

// Süre dolduğunda otomatik iptal bildirimi
export function emailBookingAutoCancelled({
  parentName,
  educatorName,
  studentName,
  date,
  time,
}: {
  parentName: string;
  educatorName: string;
  studentName: string;
  date: string;
  time: string;
}) {
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
      <h2 style="color:#b91c1c">Randevunuz İptal Edildi</h2>
      <p>Merhaba <strong>${parentName}</strong>,</p>
      <p><strong>${studentName}</strong> için <strong>${educatorName}</strong> ile planlanan <strong>${date} · ${time}</strong> dersi, ödeme süresi (24 saat) içinde tamamlanmadığı için <strong>otomatik olarak iptal edildi</strong>.</p>
      <p>Bu saat artık başka veliler için yeniden açıldı. Dilerseniz yeni bir randevu oluşturabilirsiniz.</p>
      <a href="https://ogretmenyanimda.com.tr/parent/book" style="display:inline-block;background:#4648D4;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Yeni Randevu Al →</a>
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
