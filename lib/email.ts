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

// Ortak marka kabuğu — tüm karşılama/bilgilendirme e-postaları bunu kullanır.
function welcomeShell({ heading, subtitle, body }: { heading: string; subtitle: string; body: string }) {
  return `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:580px;margin:0 auto;padding:24px;background:#eef0ff">
      <div style="background:linear-gradient(135deg,#4648D4,#5a5cf0);border-radius:18px 18px 0 0;padding:28px 32px;text-align:center">
        <span style="color:#ffffff;font-weight:800;font-size:20px;letter-spacing:-0.3px">Öğretmen Yanımda</span>
        <span style="display:inline-block;margin-left:6px;color:#6CF8BB;font-size:18px">✦</span>
      </div>
      <div style="background:#ffffff;border-radius:0 0 18px 18px;padding:34px 32px;box-shadow:0 4px 24px rgba(70,72,212,0.08)">
        <h1 style="color:#0b1c30;margin:0 0 6px;font-size:24px;font-weight:800">${heading}</h1>
        <p style="color:#94a3b8;margin:0 0 22px;font-size:14px">${subtitle}</p>
        ${body}
        <hr style="border:none;border-top:1px solid #eef2f7;margin:26px 0 18px"/>
        <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin:0">
          Her türlü soru için bize <a href="mailto:destek@ogretmenyanimda.com.tr" style="color:#4648D4;font-weight:600">destek@ogretmenyanimda.com.tr</a> adresinden ulaşabilirsin.
        </p>
      </div>
      <p style="color:#9aa3c0;font-size:12px;text-align:center;margin:16px 0 0">© ${new Date().getFullYear()} Öğretmen Yanımda · Türkiye'nin güvenilir özel ders platformu</p>
    </div>`;
}

// Kayıt sonrası: VELİ → hoş geldin, ÖĞRETMEN → başvuru alındı (teşekkür)
export function emailWelcome({ name, role }: { name: string; role: "EDUCATOR" | "PARENT" }) {
  const firstName = (name ?? "").trim().split(" ")[0] || name;

  if (role === "EDUCATOR") {
    return welcomeShell({
      heading: `Başvurun bize ulaştı, ${firstName}! 🙌`,
      subtitle: "Öğretmen başvurun alındı",
      body: `
        <p style="color:#334155;line-height:1.7;margin:0 0 16px;font-size:15px">
          Öğretmen başvurun bize <strong>başarıyla ulaştı</strong> — bize zaman ayırıp aramıza
          katılmak istediğin için teşekkür ederiz. 🙏 Bilgini paylaşarak birçok öğrencinin
          gelişimine katkı sağlayacağına yürekten inanıyoruz.
        </p>
        <div style="background:#f4f5ff;border:1px solid #e0e2ff;border-radius:12px;padding:18px 20px;margin:0 0 20px">
          <p style="color:#0b1c30;font-weight:700;margin:0 0 10px;font-size:15px">Sırada ne var?</p>
          <p style="color:#475569;line-height:1.7;margin:0 0 6px;font-size:14px">✅ Ekibimiz diploma ve kimlik bilgilerini titizlikle inceleyecek</p>
          <p style="color:#475569;line-height:1.7;margin:0 0 6px;font-size:14px">📩 <strong>1–3 iş günü</strong> içinde sonucu e-posta ile bildireceğiz</p>
          <p style="color:#475569;line-height:1.7;margin:0;font-size:14px">🎉 Onaylandığında seni "aramıza hoş geldin" mailiyle karşılayacağız — ardından hemen başlayabilirsin</p>
        </div>
        <p style="color:#334155;line-height:1.7;margin:0;font-size:15px">
          Sürecin her adımında yanındayız. Çok yakında görüşmek dileğiyle! 💙
        </p>`,
    });
  }

  // PARENT
  return welcomeShell({
    heading: `Aramıza hoş geldin, ${firstName}! 🎉`,
    subtitle: "Hesabın hazır",
    body: `
      <p style="color:#334155;line-height:1.7;margin:0 0 16px;font-size:15px">
        Çocuğunun eğitim yolculuğunda yanında olmaktan büyük mutluluk duyuyoruz! 🎈
        Hesabın <strong>başarıyla oluşturuldu</strong> ve her şey hazır.
      </p>
      <div style="background:#f4f5ff;border:1px solid #e0e2ff;border-radius:12px;padding:18px 20px;margin:0 0 22px">
        <p style="color:#0b1c30;font-weight:700;margin:0 0 10px;font-size:15px">Şimdi neler yapabilirsin?</p>
        <p style="color:#475569;line-height:1.7;margin:0 0 6px;font-size:14px">👩‍🏫 Onaylı öğretmenler arasından çocuğuna en uygun olanı seç</p>
        <p style="color:#475569;line-height:1.7;margin:0 0 6px;font-size:14px">📅 Uygun gün ve saate kolayca randevu al</p>
        <p style="color:#475569;line-height:1.7;margin:0;font-size:14px">📈 Seviye testi ve ders raporlarıyla gelişimi takip et</p>
      </div>
      <div style="text-align:center;margin:0 0 4px">
        <a href="https://ogretmenyanimda.com.tr/egitmenlerimiz" style="display:inline-block;background:#4648D4;color:#ffffff;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:700;font-size:15px">Öğretmenleri Keşfet →</a>
      </div>`,
  });
}

// Öğretmen başvurusu ONAYLANDIĞINDA gönderilen asıl "aramıza hoş geldin" maili
export function emailEducatorApproved({ name }: { name: string }) {
  const firstName = (name ?? "").trim().split(" ")[0] || name;
  return welcomeShell({
    heading: `Aramıza hoş geldin, ${firstName}! 🎉`,
    subtitle: "Başvurun onaylandı",
    body: `
      <p style="color:#334155;line-height:1.7;margin:0 0 16px;font-size:15px">
        Harika haber! Başvurun incelendi ve <strong>onaylandı</strong>. Ailemize katıldığın için
        çok mutluyuz 💙 — artık Öğretmen Yanımda topluluğunun bir parçasısın.
      </p>
      <div style="background:#f4f5ff;border:1px solid #e0e2ff;border-radius:12px;padding:18px 20px;margin:0 0 22px">
        <p style="color:#0b1c30;font-weight:700;margin:0 0 10px;font-size:15px">Hemen başlamak için</p>
        <p style="color:#475569;line-height:1.7;margin:0 0 6px;font-size:14px">📝 Profilini oluştur — branşların, sınıf seviyelerin ve ders ücretin</p>
        <p style="color:#475569;line-height:1.7;margin:0 0 6px;font-size:14px">🗓️ Uygunluk takvimini doldur ki veliler seni seçebilsin</p>
        <p style="color:#475569;line-height:1.7;margin:0;font-size:14px">🎓 İlk randevularını al ve ders vermeye başla</p>
      </div>
      <div style="text-align:center;margin:0 0 4px">
        <a href="https://ogretmenyanimda.com.tr/educator/profile" style="display:inline-block;background:#4648D4;color:#ffffff;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:700;font-size:15px">Profilimi Oluştur →</a>
      </div>`,
  });
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


// Zengin "Ders Dönüt Raporu" — veliye gönderilen (tablo tabanlı, inline CSS)
const MASTERY_LABELS = ["", "Henüz başlıyor", "Gelişiyor", "İyi düzeyde", "Tam hakim"];
export function emailLessonReport({
  studentName, educatorName, educatorBranch, subjectLabel, grade, durationMin, date, time,
  topics, participation, comprehension, confidence, mastery, highlight, homework, parentTip,
}: {
  studentName: string; educatorName: string; educatorBranch: string; subjectLabel: string;
  grade?: string | null; durationMin?: number | null;
  date: string; time: string;
  topics: string[]; participation: number; comprehension: number; confidence: number; mastery: number;
  highlight?: string | null; homework?: { title: string; source?: string }[] | null; parentTip?: string | null;
}) {
  // Türkçe tamlayan eki (Zeynep → Zeynep'in, Ayşe → Ayşe'nin)
  const trGenitive = (name: string) => {
    const w = (name ?? "").trim(); if (!w) return w;
    const lower = w.toLocaleLowerCase("tr"); const vowels = "aeıioöuü";
    let lv = ""; for (let i = lower.length - 1; i >= 0; i--) if (vowels.includes(lower[i])) { lv = lower[i]; break; }
    const back = "aıou".includes(lv); const rounded = "ouöü".includes(lv);
    const v = back ? (rounded ? "u" : "ı") : (rounded ? "ü" : "i");
    return `${w}'${vowels.includes(lower[lower.length - 1]) ? "n" : ""}${v}`;
  };
  const firstName = (educatorName || "Öğretmen").trim().split(/\s+/)[0];
  const stars = (n: number) => {
    let s = "";
    for (let i = 1; i <= 5; i++) s += `<span style="color:${i <= n ? "#EF9F27" : "#cbd5e1"};font-size:17px">${i <= n ? "★" : "☆"}</span>`;
    return s;
  };
  const criterion = (label: string, n: number) =>
    `<tr><td style="padding:7px 0;color:#334155;font-size:14px">${label}</td><td style="padding:7px 0;text-align:right;white-space:nowrap">${stars(n)}</td></tr>`;
  const masteryBar = () => {
    let cells = "";
    for (let i = 1; i <= 4; i++) cells += `<td style="height:8px;background:${i <= mastery ? "#534AB7" : "#e2e1f5"};border-radius:4px"></td>${i < 4 ? '<td style="width:4px"></td>' : ""}`;
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:6px"><tr>${cells}</tr></table>`;
  };
  const initials = (educatorName || "Ö").trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toLocaleUpperCase("tr");

  const topicsHtml = topics.length
    ? topics.map((t) => `<span style="display:inline-block;background:#EEEDFE;color:#26215C;font-size:13px;font-weight:600;padding:5px 12px;border-radius:999px;margin:0 6px 6px 0">${t}</span>`).join("")
    : `<span style="color:#94a3b8;font-size:13px">—</span>`;

  const homeworkHtml = homework && homework.length
    ? `<div style="background:#f1f5f9;border-radius:8px;padding:16px 20px;margin:0">
        <p style="margin:0 0 8px;font-weight:700;color:#0f172a;font-size:14px">📚 Eve Ödev</p>
        <ul style="margin:0;padding-left:18px;color:#334155;font-size:14px;line-height:1.7">
          ${homework.map((h) => `<li>${h.title}${h.source ? ` <span style="color:#64748b">(${h.source})</span>` : ""}</li>`).join("")}
        </ul>
      </div>`
    : "";

  const highlightHtml = highlight
    ? `<div style="background:#EEEDFE;border-left:3px solid #534AB7;border-radius:6px;padding:14px 18px;margin:0">
        <p style="margin:0 0 4px;font-weight:700;color:#26215C;font-size:13px">✨ Bugünün en güzel anı</p>
        <p style="margin:0;color:#3a3560;font-size:14px;font-style:italic;line-height:1.6">${highlight}</p>
      </div>`
    : "";

  const tipHtml = parentTip
    ? `<div style="background:#FAEEDA;border-radius:8px;padding:14px 18px;margin:0">
        <p style="margin:0 0 4px;font-weight:700;color:#92651b;font-size:13px">💡 Veliye tavsiye</p>
        <p style="margin:0;color:#6b4e16;font-size:14px;font-style:italic;line-height:1.6">${parentTip}</p>
      </div>`
    : "";

  return `
  <div style="background:#f1f5f9;padding:24px 12px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
  <table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden">
    <!-- HEADER -->
    <tr><td style="background:#4F46E5;padding:20px 24px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="color:#ffffff;font-size:14px;font-weight:700">ÖğretmenYanımda</td>
        <td style="text-align:right"><span style="background:rgba(255,255,255,0.18);color:#fff;font-size:12px;font-weight:600;padding:4px 12px;border-radius:999px">Ders Dönüt Raporu</span></td>
      </tr></table>
      <p style="margin:14px 0 2px;color:#ffffff;font-size:19px;font-weight:800">${trGenitive(studentName)} bugünkü dersi tamamlandı 🎉</p>
      <p style="margin:0 0 10px;color:#dcdafc;font-size:14px">${firstName} Öğretmen'den derse ait notlar aşağıda</p>
      <p style="margin:0;color:#c3c0fb;font-size:12px">📖 ${subjectLabel}${grade ? ` · ${grade}` : ""}&nbsp;&nbsp;·&nbsp;&nbsp;🕐 ${durationMin ? `${durationMin} dakika` : time}&nbsp;&nbsp;·&nbsp;&nbsp;📅 ${date}</p>
    </td></tr>

    <!-- BÖLÜM 1: Konular -->
    <tr><td style="padding:20px 24px">
      <p style="margin:0 0 10px;font-weight:700;color:#0f172a;font-size:14px">Bu ders ne işledik?</p>
      <div>${topicsHtml}</div>
    </td></tr>

    <!-- BÖLÜM 2: Bugün nasıldı -->
    <tr><td style="padding:4px 24px 16px">
      <p style="margin:0 0 6px;font-weight:700;color:#0f172a;font-size:14px">${studentName} bugün nasıldı?</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${criterion("Derse katılım", participation)}
        ${criterion("Konuyu anlama hızı", comprehension)}
        ${criterion("Özgüven & isteklilik", confidence)}
      </table>
      <div style="margin-top:10px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="color:#334155;font-size:14px">Konu hakimiyeti</td>
          <td style="text-align:right;color:#534AB7;font-weight:700;font-size:13px">${MASTERY_LABELS[mastery] ?? ""}</td>
        </tr></table>
        ${masteryBar()}
      </div>
    </td></tr>

    ${highlightHtml ? `<tr><td style="padding:4px 24px 16px">${highlightHtml}</td></tr>` : ""}
    ${homeworkHtml ? `<tr><td style="padding:4px 24px 16px">${homeworkHtml}</td></tr>` : ""}
    ${tipHtml ? `<tr><td style="padding:4px 24px 16px">${tipHtml}</td></tr>` : ""}

    <!-- FOOTER -->
    <tr><td style="padding:18px 24px;border-top:1px solid #eef2f7">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td style="width:40px"><div style="width:40px;height:40px;border-radius:50%;background:#4F46E5;color:#fff;text-align:center;line-height:40px;font-weight:700;font-size:15px">${initials}</div></td>
        <td style="padding-left:12px"><p style="margin:0;font-weight:700;color:#0f172a;font-size:14px">${educatorName}</p><p style="margin:0;color:#64748b;font-size:12px">${educatorBranch}</p></td>
      </tr></table>
      <div style="text-align:center;margin-top:16px">
        <a href="https://ogretmenyanimda.com.tr/parent/book" style="display:inline-block;background:#4F46E5;color:#fff;padding:11px 26px;border-radius:999px;text-decoration:none;font-weight:700;font-size:14px">Yeni Ders Rezervasyonu →</a>
      </div>
      <p style="margin:14px 0 0;text-align:center;color:#94a3b8;font-size:11px">ogretmenyanimda.com.tr · Türkiye'nin güvenilir özel ders platformu</p>
    </td></tr>
  </table>
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

// Veliye ödeme başarı maili — Meet linkinin dersten ~1 saat önce geleceğini bildirir
export function emailPaymentSuccessParent({
  parentName, studentName, educatorName, date, time, amount,
}: {
  parentName: string; studentName: string; educatorName: string; date: string; time: string; amount: string;
}) {
  return `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px">
      <h2 style="color:#15803d">Ödemeniz Alındı — Randevu Kesinleşti ✓</h2>
      <p>Merhaba <strong>${parentName}</strong>,</p>
      <p><strong>${studentName}</strong> için <strong>${educatorName}</strong> ile <strong>${date} · ${time}</strong> dersinizin ödemesi (${amount}) başarıyla alındı. Randevunuz kesinleşti. 🎉</p>
      <div style="background:#eef0ff;border:1px solid #d6d9ff;border-radius:10px;padding:14px 16px;margin:16px 0;color:#3a3ca8">
        <strong>📹 Canlı ders bağlantısı (Google Meet)</strong><br/>
        Ders bağlantınız, <strong>dersten yaklaşık 1 saat önce</strong> e-posta ile ve veli panelinizde paylaşılacaktır. Şimdiden bir şey yapmanıza gerek yok — zamanı gelince hatırlatacağız.
      </div>
      <a href="https://ogretmenyanimda.com.tr/parent/bookings" style="display:inline-block;background:#4648D4;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Rezervasyonlarım →</a>
    </div>`;
}

// Dersten ~1 saat önce gönderilen Google Meet bağlantısı (veli + öğretmen)
export function emailMeetingLink({
  recipientName, educatorName, studentName, date, time, meetingUrl,
}: {
  recipientName: string; educatorName: string; studentName: string; date: string; time: string; meetingUrl: string;
}) {
  return `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px">
      <h2 style="color:#4648D4">Dersiniz Birazdan Başlıyor 📹</h2>
      <p>Merhaba <strong>${recipientName}</strong>,</p>
      <p><strong>${studentName}</strong> · <strong>${educatorName}</strong> ile <strong>${date} · ${time}</strong> dersiniz yaklaşıyor. Aşağıdaki bağlantıdan canlı derse katılabilirsiniz:</p>
      <div style="text-align:center;margin:22px 0">
        <a href="${meetingUrl}" style="display:inline-block;background:#1a73e8;color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:700;font-size:15px">Google Meet'e Katıl →</a>
      </div>
      <p style="color:#64748b;font-size:13px">Bağlantı: <a href="${meetingUrl}" style="color:#1a73e8">${meetingUrl}</a></p>
      <p style="color:#64748b;font-size:13px">İpucu: Derse birkaç dakika önceden katılarak kamera ve mikrofonunuzu kontrol edebilirsiniz.</p>
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
