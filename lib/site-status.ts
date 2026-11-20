import { db } from "@/lib/db";

/**
 * Ders satışı açık mı? Admin → Ayarlar'dan açılıp kapatılır (AppSetting "salesOpen").
 * Ayar yoksa KAPALI sayılır: duyuru bandı görünür, öğretmen listesi gizlenir.
 */
export async function isSalesOpen(): Promise<boolean> {
  try {
    const s = await db.appSetting.findUnique({ where: { key: "salesOpen" } });
    return s?.value === "true";
  } catch {
    return false;
  }
}

export async function setSalesOpen(open: boolean): Promise<void> {
  await db.appSetting.upsert({
    where: { key: "salesOpen" },
    update: { value: open ? "true" : "false" },
    create: { key: "salesOpen", value: open ? "true" : "false" },
  });
}
