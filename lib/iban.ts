/** Türkiye IBAN'ı: "TR" + 24 hane (toplam 26 karakter), ISO 7064 mod-97 sağlamasıyla. */

export function normalizeIban(raw: string): string {
  return raw.replace(/[\s-]/g, "").toUpperCase();
}

export function isValidTrIban(raw: string): boolean {
  const iban = normalizeIban(raw);
  if (!/^TR\d{24}$/.test(iban)) return false;
  // İlk 4 karakteri sona al, harfleri sayıya çevir (A=10 … Z=35), mod 97 == 1 olmalı
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const digits = rearranged.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  let rem = 0;
  for (const ch of digits) rem = (rem * 10 + Number(ch)) % 97;
  return rem === 1;
}

/** "TR12 3456 •••• •••• •••• 7890 12" biçiminde maskeli gösterim (ilk 4 + son 4 görünür). */
export function maskIban(iban: string): string {
  const n = normalizeIban(iban);
  if (n.length < 8) return "••••";
  return `${n.slice(0, 4)} •••• •••• •••• •••• ${n.slice(-4)}`;
}

/** Okunaklı gruplama: "TR12 3456 7890 ..." */
export function formatIban(iban: string): string {
  return normalizeIban(iban).replace(/(.{4})/g, "$1 ").trim();
}
