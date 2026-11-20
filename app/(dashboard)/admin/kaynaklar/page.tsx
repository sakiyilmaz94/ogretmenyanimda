import { db } from "@/lib/db";
import ResourceManager from "@/components/dashboard/ResourceManager";

export const dynamic = "force-dynamic";

export default async function AdminResourcesPage() {
  const resources = await db.freeResource.findMany({ orderBy: { createdAt: "asc" } });
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-headline-md text-on-background">Kaynaklar</h1>
        <p className="text-label-md text-on-surface-variant mt-0.5">
          Sitedeki herkese açık <strong>Kaynaklar</strong> sayfasında görünen ücretsiz fasikül ve etkinlikler. Dosyalar Google Drive&apos;da durur, burada sadece adı ve linki tutulur.
        </p>
      </div>
      <ResourceManager resources={resources.map((r) => ({ id: r.id, grade: r.grade ?? null, title: r.title, url: r.url }))} />
    </div>
  );
}
