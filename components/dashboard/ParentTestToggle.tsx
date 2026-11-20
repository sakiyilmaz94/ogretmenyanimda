"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ParentTestToggle({ parentId, initial }: { parentId: string; initial: boolean }) {
  const router = useRouter();
  const [on, setOn] = useState(initial);
  const [saving, setSaving] = useState(false);

  async function toggle() {
    const next = !on;
    setSaving(true);
    const res = await fetch(`/api/admin/parents/${parentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ canBookEarly: next }),
    });
    setSaving(false);
    if (res.ok) { setOn(next); router.refresh(); }
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-display font-semibold text-on-background">Test hesabı</p>
        <p className="text-caption text-on-surface-variant">
          Açıkken bu veli, ders satışı kapalıyken de rezervasyon yapabilir. Diğer veliler &quot;çok yakında&quot; görür.
        </p>
      </div>
      <button type="button" role="switch" aria-checked={on} onClick={toggle} disabled={saving}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 disabled:opacity-50 ${on ? "bg-primary" : "bg-surface-container-high"}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-surface-container-lowest shadow transition-transform ${on ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}
