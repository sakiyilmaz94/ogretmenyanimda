"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SUBJECT_LABELS, GRADE_LABELS } from "@/lib/utils";

interface EducatorWithUser {
  id: string;
  status: string;
  bio: string | null;
  subjects: string[];
  gradeLevels: string[];
  hourlyRate: number;
  diplomaUrl: string | null;
  idCardUrl: string | null;
  rejectionNote: string | null;
  user: {
    name: string | null;
    email: string;
    image: string | null;
  };
}

export default function EducatorApprovalCard({ educator }: { educator: EducatorWithUser }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [rejectionNote, setRejectionNote] = useState("");
  const [showReject, setShowReject] = useState(false);

  async function handleAction(action: "approve" | "reject") {
    setLoading(action);
    await fetch("/api/admin/educators/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        educatorId: educator.id,
        action,
        rejectionNote: action === "reject" ? rejectionNote : undefined,
      }),
    });
    setLoading(null);
    setShowReject(false);
    router.refresh();
  }

  const statusBadge = {
    PENDING: "bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full text-caption font-medium",
    APPROVED: "bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-caption font-medium",
    REJECTED: "bg-error-container text-on-error-container px-3 py-1 rounded-full text-caption font-medium",
    SUSPENDED: "bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-caption font-medium",
  }[educator.status] ?? "bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-caption font-medium";

  const statusLabel = {
    PENDING: "Beklemede",
    APPROVED: "Onaylı",
    REJECTED: "Reddedildi",
    SUSPENDED: "Askıya Alındı",
  }[educator.status] ?? educator.status;

  return (
    <div className="bg-surface-container-lowest rounded-md p-5 soft-card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary rounded-full w-9 h-9 flex items-center justify-center text-on-primary font-display font-bold text-body-md shrink-0">
              {(educator.user.name ?? "E")[0].toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-on-background text-body-md">{educator.user.name}</h3>
              <p className="text-caption text-on-surface-variant">{educator.user.email}</p>
            </div>
            <span className={statusBadge}>
              {statusLabel}
            </span>
          </div>
          {educator.bio && (
            <p className="text-body-md text-on-surface-variant mb-2 line-clamp-2">{educator.bio}</p>
          )}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {educator.subjects.map((s) => (
              <span key={s} className="bg-primary-fixed text-on-primary-fixed rounded-full px-3 py-0.5 text-caption font-medium">
                {SUBJECT_LABELS[s] ?? s}
              </span>
            ))}
            {educator.gradeLevels.map((g) => (
              <span key={g} className="bg-surface-container text-on-surface-variant rounded-full px-3 py-0.5 text-caption font-medium">
                {GRADE_LABELS[g] ?? g}
              </span>
            ))}
          </div>
          {educator.hourlyRate > 0 && (
            <p className="text-label-md font-semibold text-on-background">
              Saatlik Ücret: {educator.hourlyRate} ₺
            </p>
          )}
          {(educator.diplomaUrl || educator.idCardUrl) && (
            <div className="flex gap-3 mt-2">
              {educator.diplomaUrl && (
                <a href={educator.diplomaUrl} target="_blank" rel="noopener noreferrer"
                  className="text-caption text-primary hover:underline flex items-center gap-1 font-medium">
                  📄 Diploma
                </a>
              )}
              {educator.idCardUrl && (
                <a href={educator.idCardUrl} target="_blank" rel="noopener noreferrer"
                  className="text-caption text-primary hover:underline flex items-center gap-1 font-medium">
                  🪪 Kimlik
                </a>
              )}
            </div>
          )}
          {educator.rejectionNote && (
            <p className="text-label-md text-on-error-container bg-error-container rounded-full px-3 py-1 mt-2 inline-block">Red notu: {educator.rejectionNote}</p>
          )}
          <Link href={`/admin/educators/${educator.id}`} className="inline-block mt-2 text-label-md text-primary hover:underline font-semibold">
            Detayları Görüntüle →
          </Link>
        </div>

        {educator.status === "PENDING" && (
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => handleAction("approve")}
              disabled={!!loading}
              className="rounded-full bg-secondary-container text-on-secondary-container px-4 py-1.5 text-label-md hover:opacity-90 transition disabled:opacity-50"
            >
              {loading === "approve" ? "..." : "Onayla"}
            </button>
            <button
              onClick={() => setShowReject(!showReject)}
              className="rounded-full bg-error-container text-on-error-container px-4 py-1.5 text-label-md hover:opacity-90 transition"
            >
              Reddet
            </button>
          </div>
        )}
      </div>

      {showReject && (
        <div className="mt-3 pt-3 border-t border-outline-variant">
          <textarea
            value={rejectionNote}
            onChange={(e) => setRejectionNote(e.target.value)}
            placeholder="Red sebebini yazın (isteğe bağlı)..."
            className="w-full bg-surface-container-low border border-outline-variant rounded-md p-3 text-body-md text-on-background resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-outline"
          />
          <button
            onClick={() => handleAction("reject")}
            disabled={!!loading}
            className="mt-2 rounded-full bg-error-container text-on-error-container px-4 py-1.5 text-label-md hover:opacity-90 transition disabled:opacity-50"
          >
            {loading === "reject" ? "..." : "Reddi Onayla"}
          </button>
        </div>
      )}
    </div>
  );
}
