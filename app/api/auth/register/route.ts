import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { Role, Subject, GradeLevel } from "@prisma/client";
import { sendEmail, emailWelcome } from "@/lib/email";
import { APPLICABLE_SUBJECTS, ALL_GRADE_LEVELS, BRANCHES, branchMismatch, gradeMismatch, MIN_EXPERIENCE_YEARS, missingEducatorFields } from "@/lib/educator-requirements";

export async function POST(req: Request) {
  const { name, email, password, role, diplomaUrl, idCardUrl, coachingCertUrl, phone, subjects, gradeLevels, hourlyRate, experience, branch } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Tüm alanları doldurun." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Şifre en az 8 karakter olmalıdır." }, { status: 400 });
  }

  let educatorData: { branch: string; phone: string; subjects: Subject[]; gradeLevels: GradeLevel[]; hourlyRate: number; experience: number } | null = null;
  if (role === "EDUCATOR") {
    const subj = (Array.isArray(subjects) ? subjects : []).filter((x: string) => (APPLICABLE_SUBJECTS as string[]).includes(x)) as Subject[];
    const grades = (Array.isArray(gradeLevels) ? gradeLevels : []).filter((x: string) => (ALL_GRADE_LEVELS as string[]).includes(x)) as GradeLevel[];
    const rate = Number(hourlyRate);
    const exp = Number(experience);
    const missing = missingEducatorFields({
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
    educatorData = { branch, phone: phone.trim(), subjects: subj, gradeLevels: grades, hourlyRate: rate, experience: Math.round(exp) };
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
        coachingCertUrl: subjects?.includes?.("OGRENCI_KOCLUGU") ? coachingCertUrl || null : null,
        subjects: educatorData?.subjects ?? [],
        gradeLevels: educatorData?.gradeLevels ?? [],
        experience: educatorData?.experience ?? null,
        status: "PENDING",
        diplomaUrl: diplomaUrl || null,
        idCardUrl: idCardUrl || null,
      },
    });
  }

  sendEmail({
    to: email,
    subject: "Öğretmen Yanımda'ya Hoş Geldiniz!",
    html: emailWelcome({ name, role: userRole }),
  }).catch(console.error);

  return NextResponse.json({ success: true });
}
