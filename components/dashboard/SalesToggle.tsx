"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SalesToggle({ initialOpen }: { initialOpen: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(initialOpen);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function toggle() {
    const next = !open;
    if (next && !confirm("Ders satışını açmak istediğinize emin misiniz? Duyuru bandı kalkacak, öğretmenler herkese görünecek.")) return;
    setSaving(true); setError("");
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ salesOpen: next }),
    });
    setSaving(false);
    if (res.ok) { setOpen(next); router.refresh(); }
    else setError("Kaydedilemedi");
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <span className={`px-3 py-1 rounded-full text-caption font-semibold ${open ? "bg-secondary-container text-on-secondary-container" : "bg-tertiary-fixed text-on-tertiary-fixed"}`}>
          {open ? "Ders satışı AÇIK" : "Ders satışı KAPALI (yakında modu)"}
        </span>
        <button onClick={toggle} disabled={saving}
          className="rounded-full squishy-btn bg-primary text-on-primary px-6 py-2.5 text-label-md font-semibold disabled:opacity-50">
          {saving ? "Kaydediliyor…" : open ? "Satışı Kapat" : "Satışı Aç"}
        </button>
      </div>
      {error && <p className="text-caption text-on-error-container">{error}</p>}
    </div>
  );
}
