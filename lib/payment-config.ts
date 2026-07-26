import { db } from "./db";

// Saf: benzersiz referans kodu üretir (karışan karakterler hariç). Örn. "ÖY-A3F9".
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 0, O, 1, I dahil değil
export function generateReferenceCode(): string {
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `ÖY-${code}`;
}

// DB: kullanılmayan bir referans kodu üretir (çakışma kontrollü).
export async function generateUniqueReferenceCode(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const code = generateReferenceCode();
    const exists = await db.payment.findFirst({ where: { referenceCode: code } });
    if (!exists) return code;
  }
  // güvenlik ağı — pratikte buraya düşülmez
  return `ÖY-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

export interface BankInfo {
  iban: string;
  accountName: string;
  bankName: string;
}

// DB: IBAN bilgisini okur. Tanımlı değilse boş string'ler döner.
export async function getBankInfo(): Promise<BankInfo> {
  const rows = await db.appSetting.findMany({
    where: { key: { in: ["bank_iban", "bank_account_name", "bank_name"] } },
  });
  const m = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    iban: m.bank_iban ?? "",
    accountName: m.bank_account_name ?? "",
    bankName: m.bank_name ?? "",
  };
}

// DB: IBAN bilgisini yazar (upsert).
export async function setBankInfo(info: BankInfo): Promise<void> {
  const entries: [string, string][] = [
    ["bank_iban", info.iban],
    ["bank_account_name", info.accountName],
    ["bank_name", info.bankName],
  ];
  await Promise.all(
    entries.map(([key, value]) =>
      db.appSetting.upsert({ where: { key }, update: { value }, create: { key, value } })
    )
  );
}
