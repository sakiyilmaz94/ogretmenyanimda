"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LessonApprovalActions({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [note, setNote] = useState("");

  async function handle(action: "approve" | "reject") {
    setLoading(true);
    await fetch(`/api/admin/lesson-approvals/${lessonId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, rejectionNote: note }),
    });
    setLoading(false);
    setShowReject(false);
    router.refresh();
  }

  if (showReject) {
    return (
      <div className="flex flex-col gap-2 min-w-[200px]">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Red gerekçesi (opsiyonel)"
          rows={2}
          className="text-sm px-3 py-2 rounded-lg border border-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-red-300"
        />
        <div className="flex gap-2">
          <button onClick={() => handle("reject")} disabled={loading}
            className="flex-1 bg-red-500 text-white text-sm py-2 rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 transition">
            Reddet
          </button>
          <button onClick={() => setShowReject(false)}
            className="px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 rounded-lg transition">
            İptal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button onClick={() => handle("approve")} disabled={loading}
        className="bg-green-500 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 transition">
        Onayla
      </button>
      <button onClick={() => setShowReject(true)} disabled={loading}
        className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition">
        Reddet
      </button>
    </div>
  );
}
