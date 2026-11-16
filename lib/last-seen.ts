import { db } from "@/lib/db";

const HOUR = 60 * 60 * 1000;

/** Kullanıcının "son görülme" zamanını günceller; en fazla saatte bir yazar (DB'yi yormamak için). */
export async function touchLastSeen(userId: string) {
  try {
    await db.user.updateMany({
      where: { id: userId, OR: [{ lastSeenAt: null }, { lastSeenAt: { lt: new Date(Date.now() - HOUR) } }] },
      data: { lastSeenAt: new Date() },
    });
  } catch (err) {
    console.error("lastSeenAt güncellenemedi:", err);
  }
}
