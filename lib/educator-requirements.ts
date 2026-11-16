import { Subject, GradeLevel } from "@prisma/client";

/** Öğretmen başvurusunda seçilebilen dersler ("Diğer" hariç — listede olmayan branş başvuramaz). */
export const APPLICABLE_SUBJECTS = Object.values(Subject).filter((s) => s !== "DIGER");
export const ALL_GRADE_LEVELS = Object.values(GradeLevel);

export interface EducatorRequirementInput {
  phone?: string | null;
  subjects?: string[] | null;
  gradeLevels?: string[] | null;
  hourlyRate?: number | null;
  experience?: number | null;
  coachingCertUrl?: string | null;
}

/** Eksik zorunlu alanların okunaklı listesini döndürür (boşsa başvuru tamamdır). */
export function missingEducatorFields(e: EducatorRequirementInput): string[] {
  const missing: string[] = [];
  if (!e.phone || e.phone.replace(/\D/g, "").length < 10) missing.push("Telefon numarası");
  if (!e.subjects || e.subjects.length === 0) missing.push("Verilecek ders(ler)");
  if (!e.gradeLevels || e.gradeLevels.length === 0) missing.push("Sınıf seviyeleri");
  if (!e.hourlyRate || e.hourlyRate <= 0) missing.push("Saatlik ders ücreti");
  if (e.experience == null || e.experience < 0) missing.push("Deneyim (yıl)");
  if (e.subjects?.includes("OGRENCI_KOCLUGU") && !e.coachingCertUrl) missing.push("Koçluk sertifikası");
  return missing;
}

/**
 * Öğretmenin mezuniyet branşı → platformda verebileceği dersler.
 * Listede olmayan branşlar (ör. Din Kültürü) şu an başvuramaz; ilgili ders platforma eklenince buraya eklenir.
 */
export const BRANCHES: Record<string, { label: string; subjects: string[]; ortaokulOnly?: boolean }> = {
  SINIF: { label: "Sınıf Öğretmenliği", subjects: ["TURKCE", "MATEMATIK", "FEN_BILIMLERI", "SOSYAL_BILGILER", "HAYAT_BILGISI", "ILK_OKUMA_YAZMA", "OGRENCI_KOCLUGU"] },
  TURKCE: { label: "Türkçe Öğretmenliği", subjects: ["TURKCE", "OGRENCI_KOCLUGU"], ortaokulOnly: true },
  MATEMATIK: { label: "Matematik Öğretmenliği (Ortaokul)", subjects: ["MATEMATIK", "OGRENCI_KOCLUGU"], ortaokulOnly: true },
  FEN: { label: "Fen Bilimleri Öğretmenliği", subjects: ["FEN_BILIMLERI", "OGRENCI_KOCLUGU"], ortaokulOnly: true },
  SOSYAL: { label: "Sosyal Bilgiler / Tarih Öğretmenliği", subjects: ["SOSYAL_BILGILER", "INKILAP_TARIHI", "OGRENCI_KOCLUGU"], ortaokulOnly: true },
  INGILIZCE: { label: "İngilizce Öğretmenliği", subjects: ["INGILIZCE", "OGRENCI_KOCLUGU"], ortaokulOnly: true },
  REHBERLIK: { label: "Rehberlik / PDR", subjects: ["OGRENCI_KOCLUGU"] },
  DIGER: { label: "Diğer (listede yok)", subjects: [] },
};

/** Branşa uymayan seçili dersleri döndürür (boşsa uyumlu). */
export function branchMismatch(branch: string | null | undefined, subjects: string[]): string[] {
  const allowed = branch ? BRANCHES[branch]?.subjects ?? [] : [];
  return subjects.filter((s) => !allowed.includes(s));
}

/** Branş öğretmenleri yalnızca ortaokul (5-8) seviyesi seçebilir; sınıf öğretmeni kısıtsızdır. */
export function gradeMismatch(branch: string | null | undefined, grades: string[]): string[] {
  if (!branch || !BRANCHES[branch]?.ortaokulOnly) return [];
  return grades.filter((g) => !g.startsWith("ORTAOKUL_"));
}
