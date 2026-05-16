"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SUBJECT_LABELS, GRADE_LABELS } from "@/lib/utils";

interface EducatorWithUser {
  id: string;
  status: string;
  bio: string | null;
  subjects: string[];
  gradeLevels: string[];
  hourlyRate: { toNumber: () => number };
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

  const statusColor = {
    PENDING: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    SUSPENDED: "bg-gray-100 text-gray-700",
  }[educator.status] ?? "bg-gray-100 text-gray-700";

  const statusLabel = {
    PENDING: "Beklemede",
    APPROVED: "Onaylı",
    REJECTED: "Reddedildi",
    SUSPENDED: "Askıya Alındı",
  }[educator.status] ?? educator.status;

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-gray-900">{educator.user.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor}`}>
              {statusLabel}
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-1">{educator.user.email}</p>
          {educator.bio && (
            <p className="text-sm text-gray-600 mb-2">{educator.bio}</p>
          )}
          <div className="flex flex-wrap gap-1 mb-2">
            {educator.subjects.map((s) => (
              <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                {SUBJECT_LABELS[s] ?? s}
              </span>
            ))}
            {educator.gradeLevels.map((g) => (
              <span key={g} className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
                {GRADE_LABELS[g] ?? g}
              </span>
            ))}
          </div>
          <p className="text-sm font-medium text-gray-700">
            Saatlik Ücret: {educator.hourlyRate.toNumber()} ₺
          </p>
          {educator.rejectionNote && (
            <p className="text-sm text-red-600 mt-1">Red notu: {educator.rejectionNote}</p>
          )}
        </div>

        {educator.status === "PENDING" && (
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => handleAction("approve")}
              disabled={!!loading}
              className="bg-green-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading === "approve" ? "..." : "Onayla"}
            </button>
            <button
              onClick={() => setShowReject(!showReject)}
              className="bg-red-50 text-red-600 text-sm px-3 py-1.5 rounded-lg hover:bg-red-100"
            >
              Reddet
            </button>
          </div>
        )}
      </div>

      {showReject && (
        <div className="mt-3 pt-3 border-t">
          <textarea
            value={rejectionNote}
            onChange={(e) => setRejectionNote(e.target.value)}
            placeholder="Red sebebini yazın (isteğe bağlı)..."
            className="w-full border rounded-lg p-2 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <button
            onClick={() => handleAction("reject")}
            disabled={!!loading}
            className="mt-2 bg-red-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading === "reject" ? "..." : "Reddi Onayla"}
          </button>
        </div>
      )}
    </div>
  );
}
