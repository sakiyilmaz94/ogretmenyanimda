import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { Role, Subject, GradeLevel } from "@prisma/client";
import { sendEmail, emailWelcome } from "@/lib/email";
import { toPrivatePath } from "@/lib/private-docs";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { isValidTrIban, normalizeIban } from "@/lib/iban";
import { notifyAdmins } from "@/lib/notify";
import { APPLICABLE_SUBJECTS, ALL_GRADE_LEVELS, BRANCHES, branchMismatch, gradeMismatch, MIN_EXPERIENCE_YEARS, MIN_HOURLY_RATE, MIN_RATE_MESSAGE, missingEducatorFields } from "@/lib/educator-requirements";

export async function POST(req: Request) {
  // Sahte hesap / toplu kayıt koruması: IP başına saatte 5 kayıt
  const rl = await rateLimit(`register:${clientIp(req)}`, 5, 3600);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Çok fazla kayıt denemesi yapıldı. Lütfen bir süre sonra tekrar deneyin." }, { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } });
  }

  const { name, email, password, role, diplomaUrl, idCardUrl, coachingCertUrl, phone, subjects, gradeLevels, hourlyRate, experience, branch, iban, ibanHolderName } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Tüm alanları doldurun." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Şifre en az 8 karakter olmalıdır." }, { status: 400 });
  }

  let educatorData: { branch: string; phone: string; subjects: Subject[]; gradeLevels: GradeLevel[]; hourlyRate: number; experience: number; iban: string; ibanHolderName: string } | null = null;
  if (role === "EDUCATOR") {
    const subj = (Array.isArray(subjects) ? subjects : []).filter((x: string) => (APPLICABLE_SUBJECTS as string[]).includes(x)) as Subject[];
    const grades = (Array.isArray(gradeLevels) ? gradeLevels : []).filter((x: string) => (ALL_GRADE_LEVELS as string[]).includes(x)) as GradeLevel[];
    const rate = Number(hourlyRate);
    const exp = Number(experience);
    if (Number.isFinite(rate) && rate > 0 && rate < MIN_HOURLY_RATE) {
      return NextResponse.json({ error: MIN_RATE_MESSAGE }, { status: 400 });
    }
    const holder = typeof ibanHolderName === "string" ? ibanHolderName.trim() : "";
    if (typeof iban !== "string" || !isValidTrIban(iban)) {
      return NextResponse.json({ error: "Geçerli bir IBAN girin (TR ile başlayan 26 karakter). Haftalık ödemeniz bu hesaba yapılacaktır." }, { status: 400 });
    }
    if (holder.length < 3 || holder.length > 80) {
      return NextResponse.json({ error: "IBAN hesap sahibinin adını soyadını yazın." }, { status: 400 });
    }
    const missing = missingEducatorFields({
      iban: normalizeIban(iban),
      phone: typeof phone === "string" ? phone : null,
      subjects: subj,
      gradeLevels: grades,
      hourlyRate: Number.isFinite(rate) ? rate : null,
      coachingCertUrl: typeof coachingCertUrl === "string" ? coachingCertUrl : null,
      experience: experience === "" || experience == null || !Number.isFinite(exp) ? null : exp,
    });
    if (missing.length > 0) {
      return NextResponse.json({ error: `Zorunlu alanlar eksik: ${missing.join(", ")}.` }, { status: 400 });
    }
    if (exp < MIN_EXPERIENCE_YEARS) {
      return NextResponse.json({ error: `Platformumuzda en az ${MIN_EXPERIENCE_YEARS} yıl deneyimli öğretmenlerle çalışıyoruz.` }, { status: 400 });
    }
    if (!branch || !BRANCHES[branch]) {
      return NextResponse.json({ error: "Branşınızı (mezuniyet alanınızı) seçin." }, { status: 400 });
    }
    const bad = branchMismatch(branch, subj);
    if (bad.length > 0) {
      return NextResponse.json({ error: `Branşınız (${BRANCHES[branch].label}) ile seçtiğiniz dersler uyuşmuyor. Başvuru yalnızca kendi branşınızdaki derslerle yapılabilir.` }, { status: 400 });
    }
    if (gradeMismatch(branch, grades).length > 0) {
      return NextResponse.json({ error: `${BRANCHES[branch].label} için yalnızca ortaokul (5-8. sınıf) seviyeleri seçilebilir.` }, { status: 400 });
    }
    educatorData = { branch, phone: phone.trim(), subjects: subj, gradeLevels: grades, hourlyRate: rate, experience: Math.round(exp), iban: normalizeIban(iban), ibanHolderName: holder };
  }

  // Belgeler yalnızca gizli klasördeki yollar olarak kabul edilir (başka adres yerleştirilemez)
  const diplomaPath = toPrivatePath(diplomaUrl);
  const idCardPath = toPrivatePath(idCardUrl);
  const coachingPath = toPrivatePath(coachingCertUrl);
  if (role === "EDUCATOR" && (!diplomaPath || !idCardPath)) {
    return NextResponse.json({ error: "Diploma ve kimlik belgesi yüklemek zorunludur." }, { status: 400 });
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Bu e-posta adresi zaten kullanımda." }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const userRole = role === "EDUCATOR" ? Role.EDUCATOR : Role.PARENT;

  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: userRole,
    },
  });

  if (userRole === Role.PARENT) {
    await db.parent.create({ data: { userId: user.id } });
  } else if (userRole === Role.EDUCATOR) {
    await db.educator.create({
      data: {
        userId: user.id,
        hourlyRate: educatorData?.hourlyRate ?? 0,
        phone: educatorData?.phone ?? null,
        branch: educatorData?.branch ?? null,
        iban: educatorData?.iban ?? null,
        ibanHolderName: educatorData?.ibanHolderName ?? null,
        coachingCertUrl: subjects?.includes?.("OGRENCI_KOCLUGU") ? coachingPath : null,
        subjects: educatorData?.subjects ?? [],
        gradeLevels: educatorData?.gradeLevels ?? [],
        experience: educatorData?.experience ?? null,
        status: "PENDING",
        diplomaUrl: diplomaPath,
        idCardUrl: idCardPath,
      },
    });
  }

  // Yeni öğretmen başvurusu → yöneticiye panel bildirimi + e-posta
  if (userRole === Role.EDUCATOR) {
    notifyAdmins({
      title: "Yeni öğretmen başvurusu",
      message: `${name} öğretmen olarak başvurdu${educatorData ? ` (${BRANCHES[educatorData.branch]?.label ?? educatorData.branch}, ${educatorData.experience} yıl deneyim)` : ""}. Belgeleri inceleyip onaylayın veya reddedin.`,
      link: "/admin/educators?durum=PENDING",
    }).catch(console.error);
  }

  sendEmail({
    to: email,
    subject: "Öğretmen Yanımda'ya Hoş Geldiniz!",
    html: emailWelcome({ name, role: userRole }),
  }).catch(console.error);

  return NextResponse.json({ success: true });
}
