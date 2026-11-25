import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Prisma, Subject, GradeLevel } from "@prisma/client";
import {
  APPLICABLE_SUBJECTS, ALL_GRADE_LEVELS, BRANCHES, branchMismatch, gradeMismatch,
  MIN_EXPERIENCE_YEARS, MIN_HOURLY_RATE, MIN_RATE_MESSAGE,
} from "@/lib/educator-requirements";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "EDUCATOR") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const educator = await db.educator.findUnique({ where: { userId: session.user.id } });
  if (!educator) return NextResponse.json({ error: "Öğretmen bulunamadı." }, { status: 404 });
  // Belge yolları ve IBAN tarayıcıya gönderilmez (IBAN için ayrı, maskeli ekran var)
  const { diplomaUrl: _d, idCardUrl: _i, coachingCertUrl: _c, iban: _ib, ...safe } = educator;
  void _d; void _i; void _c; void _ib;
  return NextResponse.json(safe);
}

// Yalnızca GÖNDERİLEN alanlar güncellenir (gönderilmeyen alan silinmez) ve kayıttaki kurallar burada da geçerlidir.
export async function PATCH(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "EDUCATOR") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const body = await req.json();
  const educator = await db.educator.findUnique({ where: { userId: session.user.id } });
  if (!educator) return NextResponse.json({ error: "Öğretmen bulunamadı." }, { status: 404 });

  const data: Prisma.EducatorUpdateInput = {};
  const fail = (error: string) => NextResponse.json({ error }, { status: 400 });

  if (body.hourlyRate !== undefined) {
    const rate = Number(body.hourlyRate);
    if (!(rate >= MIN_HOURLY_RATE)) return fail(MIN_RATE_MESSAGE);
    data.hourlyRate = new Prisma.Decimal(rate);
  }

  if (body.subjects !== undefined) {
    const subj = (Array.isArray(body.subjects) ? body.subjects : []).filter((x: string) => (APPLICABLE_SUBJECTS as string[]).includes(x)) as Subject[];
    if (subj.length === 0) return fail("En az bir ders seçin.");
    if (educator.branch && branchMismatch(educator.branch, subj).length > 0) {
      return fail(`Branşınız (${BRANCHES[educator.branch]?.label ?? educator.branch}) dışındaki dersleri seçemezsiniz.`);
    }
    data.subjects = subj;
  }

  if (body.gradeLevels !== undefined) {
    const grades = (Array.isArray(body.gradeLevels) ? body.gradeLevels : []).filter((x: string) => (ALL_GRADE_LEVELS as string[]).includes(x)) as GradeLevel[];
    if (grades.length === 0) return fail("En az bir sınıf seviyesi seçin.");
    if (gradeMismatch(educator.branch, grades).length > 0) {
      return fail("Branşınız için yalnızca ortaokul (5-8. sınıf) seviyeleri seçilebilir.");
    }
    data.gradeLevels = grades;
  }

  if (typeof body.phone === "string" && body.phone.trim() !== "") {
    const phone = body.phone.trim();
    if (phone.replace(/\D/g, "").length < 10) return fail("Geçerli bir telefon numarası girin.");
    data.phone = phone;
  }

  if (body.experience !== undefined && body.experience !== null && body.experience !== "") {
    const exp = Number(body.experience);
    if (!Number.isFinite(exp) || exp < 0) return fail("Geçerli bir deneyim yılı girin.");
    if (exp < MIN_EXPERIENCE_YEARS && exp !== educator.experience) {
      return fail(`Deneyim yılı en az ${MIN_EXPERIENCE_YEARS} olmalıdır.`);
    }
    data.experience = Math.round(exp);
  }

  if (body.bio !== undefined) data.bio = typeof body.bio === "string" ? body.bio : null;
  if (body.photoUrl !== undefined) data.photoUrl = body.photoUrl || null;
  if (body.titleName !== undefined) data.titleName = body.titleName || null;
  if (body.skills !== undefined) data.skills = Array.isArray(body.skills) ? body.skills : [];
  if (body.certificates !== undefined) data.certificates = Array.isArray(body.certificates) ? body.certificates : [];
  if (body.linkedinUrl !== undefined) data.linkedinUrl = body.linkedinUrl || null;
  if (body.isProfilePublic !== undefined) data.isProfilePublic = body.isProfilePublic === true;

  const updated = await db.educator.update({ where: { id: educator.id }, data });
  const { diplomaUrl: _d, idCardUrl: _i, coachingCertUrl: _c, iban: _ib, ...safe } = updated;
  void _d; void _i; void _c; void _ib;
  return NextResponse.json(safe);
}
