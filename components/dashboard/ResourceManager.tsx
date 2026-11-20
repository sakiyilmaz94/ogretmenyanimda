"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface ResourceRow { id: string; grade: string; title: string; url: string }

const GRADES = [
  { key: "ILKOKUL_1", label: "1. Sınıf" },
  { key: "ILKOKUL_2", label: "2. Sınıf" },
  { key: "ILKOKUL_3", label: "3. Sınıf" },
  { key: "ILKOKUL_4", label: "4. Sınıf" },
];

export default function ResourceManager({ resources }: { resources: ResourceRow[] }) {
  const router = useRouter();
  const [grade, setGrade] = useState("ILKOKUL_1");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    const res = await fetch("/api/admin/kaynaklar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grade, title, url }),
    });
    setSaving(false);
    if (res.ok) { setTitle(""); setUrl(""); router.refresh(); }
    else { const d = await res.json().catch(() => ({})); setError(d.error ?? "Eklenemedi."); }
  }

  async function remove(r: ResourceRow) {
    if (!confirm(`"${r.title}" kaynağı silinsin mi? (Drive'daki dosya silinmez, sadece sitedeki link kalkar.)`)) return;
    await fetch(`/api/admin/kaynaklar?id=${r.id}`, { method: "DELETE" });
    router.refresh();
  }

  const inputCls = "w-full bg-surface-container-low border border-outline-variant rounded-md px-4 py-2.5 text-body-md focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="bg-surface-container-lowest rounded-md soft-card-static border border-primary/20 p-6 space-y-4">
        <h2 className="font-display text-headline-md text-on-background">Yeni Kaynak Ekle</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-label-md text-on-surface-variant mb-1.5">Sınıf</label>
            <select value={grade} onChange={(e) => setGrade(e.target.value)} className={inputCls}>
              {GRADES.map((g) => <option key={g.key} value={g.key}>{g.label}</option>)}
            </select>
          </div>
          <div className="sm:col-span-3">
            <label className="block text-label-md text-on-surface-variant mb-1.5">Kaynağın adı (velinin göreceği)</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Örn: Saatler" className={inputCls} />
          </div>
        </div>
        <div>
          <label className="block text-label-md text-on-surface-variant mb-1.5">Google Drive linki</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://drive.google.com/file/d/..." className={inputCls} />
          <p className="text-caption text-on-surface-variant mt-1.5 leading-relaxed">
            Drive&apos;da dosyaya sağ tıkla → Paylaş → &quot;Bağlantıya sahip olan herkes&quot; → &quot;Görüntüleyen&quot; yap, sonra bağlantıyı kopyala.
            Bunu yapmazsan veliler dosyayı açamaz.
          </p>
        </div>
        {error && <div className="bg-error text-on-error rounded-md px-4 py-2.5 text-label-md font-semibold">{error}</div>}
        <button disabled={saving} className="rounded-full squishy-btn bg-primary text-on-primary px-6 py-2.5 text-label-md font-semibold disabled:opacity-50">
          {saving ? "Ekleniyor…" : "Ekle"}
        </button>
      </form>

      {GRADES.map((g) => {
        const list = resources.filter((r) => r.grade === g.key);
        return (
          <div key={g.key} className="bg-surface-container-lowest rounded-md soft-card-static border border-outline-variant/20 overflow-hidden">
            <div className="px-5 py-3 border-b border-outline-variant/20 flex items-center justify-between">
              <h3 className="font-display text-body-md font-semibold text-on-background">{g.label}</h3>
              <span className="text-caption text-on-surface-variant">{list.length} kaynak</span>
            </div>
            {list.length === 0 ? (
              <p className="px-5 py-4 text-label-md text-on-surface-variant">Henüz kaynak yok.</p>
            ) : (
              <ul className="divide-y divide-outline-variant/20">
                {list.map((r) => (
                  <li key={r.id} className="px-5 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-on-background truncate">{r.title}</p>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-caption text-primary hover:underline truncate block">{r.url}</a>
                    </div>
                    <button onClick={() => remove(r)} className="shrink-0 text-caption rounded-full bg-error-container text-on-error-container px-3 py-1 font-semibold hover:opacity-90">Sil</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
