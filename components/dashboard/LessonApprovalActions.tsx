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
          className="text-body-md px-3 py-2 rounded-md border border-outline-variant bg-surface-container-low text-on-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-outline"
        />
        <div className="flex gap-2">
          <button onClick={() => handle("reject")} disabled={loading}
            className="flex-1 rounded-full bg-error-container text-on-error-container text-label-md py-2 hover:opacity-90 disabled:opacity-50 transition">
            Reddet
          </button>
          <button onClick={() => setShowReject(false)}
            className="px-3 py-2 text-label-md text-on-surface-variant hover:bg-surface-container rounded-full transition">
            İptal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button onClick={() => handle("approve")} disabled={loading}
        className="rounded-full bg-secondary-container text-on-secondary-container px-4 py-1.5 text-label-md hover:opacity-90 disabled:opacity-50 transition">
        Onayla
      </button>
      <button onClick={() => setShowReject(true)} disabled={loading}
        className="rounded-full bg-error-container text-on-error-container px-4 py-1.5 text-label-md hover:opacity-90 transition">
        Reddet
      </button>
    </div>
  );
}
