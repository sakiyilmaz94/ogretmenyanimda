import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(Number(amount));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export const GRADE_LABELS: Record<string, string> = {
  ILKOKUL_1: "1. Sınıf",
  ILKOKUL_2: "2. Sınıf",
  ILKOKUL_3: "3. Sınıf",
  ILKOKUL_4: "4. Sınıf",
  ORTAOKUL_5: "5. Sınıf",
  ORTAOKUL_6: "6. Sınıf",
  ORTAOKUL_7: "7. Sınıf",
  ORTAOKUL_8: "8. Sınıf",
};

export const SUBJECT_LABELS: Record<string, string> = {
  TURKCE: "Türkçe",
  MATEMATIK: "Matematik",
  FEN_BILIMLERI: "Fen Bilimleri",
  SOSYAL_BILGILER: "Sosyal Bilgiler",
  INGILIZCE: "İngilizce",
  INKILAP_TARIHI: "İnkılap Tarihi",
  OGRENCI_KOCLUGU: "Öğrenci Koçluğu",
  DIGER: "Diğer",
};
