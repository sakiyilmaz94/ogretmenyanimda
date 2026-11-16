import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const ROLE_LABEL: Record<string, string> = { ADMIN: "Yönetici", EDUCATOR: "Öğretmen", PARENT: "Veli" };

function fmt(d: Date | null) {
  if (!d) return "Henüz girmedi";
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Istanbul" }).format(d);
}

export default async function AdminActivityPage() {
  const users = await db.user.findMany({
    where: { role: { in: ["EDUCATOR", "PARENT"] } },
    select: { id: true, name: true, email: true, role: true, lastSeenAt: true, createdAt: true },
    orderBy: [{ lastSeenAt: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
  });

  const now = Date.now();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const seenToday = users.filter((u) => u.lastSeenAt && u.lastSeenAt >= today).length;
  const seenWeek = users.filter((u) => u.lastSeenAt && now - u.lastSeenAt.getTime() < 7 * 86400000).length;
  const never = users.filter((u) => !u.lastSeenAt).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-headline-md text-on-background">Kullanıcı Aktivitesi</h1>
        <p className="text-label-md text-on-surface-variant mt-0.5">
          Kayıtlı öğretmen ve velilerin panele son giriş/ziyaret zamanı (en fazla saatlik hassasiyetle). Bu özellik açıldıktan önceki ziyaretler görünmez.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Bugün gelen", value: seenToday },
          { label: "Son 7 gün", value: seenWeek },
          { label: "Hiç gelmeyen", value: never },
        ].map((s) => (
          <div key={s.label} className="bg-surface-container-lowest rounded-md p-5 soft-card-static border border-outline-variant/20">
            <p className="text-label-md text-on-surface-variant">{s.label}</p>
            <p className="text-headline-md font-display text-on-background mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-md soft-card-static border border-outline-variant/20 overflow-x-auto">
        <table className="w-full text-body-md min-w-[560px]">
          <thead className="bg-surface-container text-on-surface-variant">
            <tr>
              <th className="text-left px-5 py-3 text-label-md font-semibold">Kullanıcı</th>
              <th className="text-left px-5 py-3 text-label-md font-semibold">Rol</th>
              <th className="text-left px-5 py-3 text-label-md font-semibold">Son Görülme</th>
              <th className="text-left px-5 py-3 text-label-md font-semibold">Kayıt Tarihi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-surface-container-low transition">
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-on-background">{u.name ?? "—"}</p>
                  <p className="text-caption text-on-surface-variant">{u.email}</p>
                </td>
                <td className="px-5 py-3.5 text-on-surface-variant">{ROLE_LABEL[u.role] ?? u.role}</td>
                <td className="px-5 py-3.5 whitespace-nowrap">{fmt(u.lastSeenAt)}</td>
                <td className="px-5 py-3.5 text-on-surface-variant whitespace-nowrap">{new Date(u.createdAt).toLocaleDateString("tr-TR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
