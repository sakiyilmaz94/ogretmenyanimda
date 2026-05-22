"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EducatorDetailActions({ educatorId }: { educatorId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [rejectionNote, setRejectionNote] = useState("");
  const [showReject, setShowReject] = useState(false);

  async function handleAction(action: "approve" | "reject") {
    setLoading(action);
    await fetch("/api/admin/educators/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ educatorId, action, rejectionNote: action === "reject" ? rejectionNote : undefined }),
    });
    setLoading(null);
    setShowReject(false);
    router.refresh();
  }

  return (
    <div className="bg-surface-container-lowest rounded-md border border-tertiary-fixed p-6 soft-card-static">
      <h2 className="font-display font-semibold text-on-background text-body-md mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-tertiary-fixed inline-block"></span>
        Onay Kararı
      </h2>
      <p className="text-body-md text-on-surface-variant mb-4">Yukarıdaki belgeleri inceledikten sonra başvuruyu onaylayın veya reddedin.</p>
      <div className="flex gap-3">
        <button
          onClick={() => handleAction("approve")}
          disabled={!!loading}
          className="flex-1 rounded-full bg-secondary-container text-on-secondary-container py-2.5 text-label-md font-semibold hover:opacity-90 disabled:opacity-50 transition"
        >
          {loading === "approve" ? "Onaylanıyor..." : "✓ Onayla"}
        </button>
        <button
          onClick={() => setShowReject(!showReject)}
          className="flex-1 rounded-full bg-error-container text-on-error-container py-2.5 text-label-md font-semibold hover:opacity-90 transition"
        >
          ✕ Reddet
        </button>
      </div>
      {showReject && (
        <div className="mt-3">
          <textarea
            value={rejectionNote}
            onChange={(e) => setRejectionNote(e.target.value)}
            placeholder="Red sebebini yazın (öğretmene gösterilecek)..."
            className="w-full bg-surface-container-low border border-outline-variant rounded-md p-3 text-body-md text-on-background resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-outline"
          />
          <button
            onClick={() => handleAction("reject")}
            disabled={!!loading}
            className="mt-2 w-full rounded-full bg-error-container text-on-error-container py-2.5 text-label-md font-semibold hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading === "reject" ? "Reddediliyor..." : "Reddi Onayla"}
          </button>
        </div>
      )}
    </div>
  );
}
