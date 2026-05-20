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
    <div className="bg-white rounded-2xl border border-amber-200 p-6">
      <h2 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
        Onay Kararı
      </h2>
      <p className="text-sm text-slate-500 mb-4">Yukarıdaki belgeleri inceledikten sonra başvuruyu onaylayın veya reddedin.</p>
      <div className="flex gap-3">
        <button
          onClick={() => handleAction("approve")}
          disabled={!!loading}
          className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {loading === "approve" ? "Onaylanıyor..." : "✓ Onayla"}
        </button>
        <button
          onClick={() => setShowReject(!showReject)}
          className="flex-1 bg-red-50 text-red-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors border border-red-200"
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
            className="w-full border border-slate-200 rounded-xl p-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <button
            onClick={() => handleAction("reject")}
            disabled={!!loading}
            className="mt-2 w-full bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {loading === "reject" ? "Reddediliyor..." : "Reddi Onayla"}
          </button>
        </div>
      )}
    </div>
  );
}
