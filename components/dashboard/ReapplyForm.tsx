"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReapplyForm({ rejectionNote }: { rejectionNote: string | null }) {
  const router = useRouter();
  const [diploma, setDiploma] = useState<File | null>(null);
  const [idCard, setIdCard] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function uploadFile(file: File, type: string): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", type);
    const res = await fetch("/api/auth/register-upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Dosya yüklenemedi");
    return data.url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!diploma || !idCard) {
      setError("Her iki belgeyi de yüklemeniz zorunludur.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const [diplomaUrl, idCardUrl] = await Promise.all([
        uploadFile(diploma, "diploma"),
        uploadFile(idCard, "idcard"),
      ]);
      const res = await fetch("/api/educator/reapply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diplomaUrl, idCardUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 space-y-4">
      <div>
        <p className="text-red-800 font-semibold">Başvurunuz reddedildi</p>
        {rejectionNote && (
          <p className="text-red-700 text-sm mt-1">
            <span className="font-medium">Red sebebi:</span> {rejectionNote}
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-red-100 p-5 space-y-4">
        <p className="text-sm text-slate-600 font-medium">Belgelerinizi güncelleyerek yeniden başvurun</p>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Diploma / Mezuniyet Belgesi <span className="text-red-500">*</span>
          </label>
          <label className="flex items-center gap-3 w-full border-2 border-dashed border-slate-200 rounded-xl px-4 py-3 cursor-pointer hover:border-gold-400 transition-colors">
            <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm text-slate-500 truncate">
              {diploma ? diploma.name : "PDF dosyası seçin (maks. 5MB)"}
            </span>
            <input type="file" accept=".pdf" className="hidden" onChange={e => setDiploma(e.target.files?.[0] || null)} />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Kimlik Kartı Fotoğrafı <span className="text-red-500">*</span>
          </label>
          <label className="flex items-center gap-3 w-full border-2 border-dashed border-slate-200 rounded-xl px-4 py-3 cursor-pointer hover:border-gold-400 transition-colors">
            <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2" />
            </svg>
            <span className="text-sm text-slate-500 truncate">
              {idCard ? idCard.name : "JPG veya PNG seçin (maks. 5MB)"}
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={e => setIdCard(e.target.files?.[0] || null)} />
          </label>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || !diploma || !idCard}
          className="w-full bg-navy-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-navy-800 disabled:opacity-50 transition-colors"
        >
          {loading ? "Gönderiliyor..." : "Yeniden Başvur"}
        </button>
      </div>
    </div>
  );
}
