"use client";

import { useState, useEffect, useRef } from "react";
import { SUBJECT_LABELS } from "@/lib/utils";

interface Resource {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  subject: string | null;
  isFree: boolean;
  createdAt: string;
}

export default function EducatorKaynaklarPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await fetch("/api/educator/resources");
    if (res.ok) setResources(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title.trim()) { setError("Başlık ve dosya zorunludur."); return; }
    setUploading(true); setError(""); setSuccess("");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", title.trim());
    if (description.trim()) fd.append("description", description.trim());
    if (subject) fd.append("subject", subject);

    const res = await fetch("/api/educator/resources", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);

    if (!res.ok) { setError(data.error ?? "Yükleme başarısız."); return; }
    setSuccess("Kaynak başarıyla eklendi.");
    setTitle(""); setDescription(""); setSubject(""); setFile(null);
    if (fileRef.current) fileRef.current.value = "";
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu kaynağı silmek istediğinizden emin misiniz?")) return;
    await fetch(`/api/educator/resources/${id}`, { method: "DELETE" });
    setResources((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-headline-md text-on-background mb-1">Kaynaklarım</h1>
        <p className="text-on-surface-variant text-body-md">
          Velilerin inceleyip ücretsiz indirebileceği PDF kaynakları ekleyin.
        </p>
      </div>

      {/* Yükleme Formu */}
      <div className="bg-surface-container-lowest rounded-md p-6 soft-card-static border border-outline-variant/30">
        <h2 className="font-display font-semibold text-on-background mb-4">Yeni Kaynak Ekle</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-label-md text-on-surface-variant mb-1.5">Başlık *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ör. 4. Sınıf Matematik Soru Bankası"
              className="w-full px-4 py-2.5 bg-surface-container-low rounded-full border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary text-on-background"
            />
          </div>

          <div>
            <label className="block text-label-md text-on-surface-variant mb-1.5">Açıklama</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kısa açıklama (isteğe bağlı)"
              rows={2}
              className="w-full px-4 py-2.5 bg-surface-container-low rounded-md border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary text-on-background resize-none"
            />
          </div>

          <div>
            <label className="block text-label-md text-on-surface-variant mb-1.5">Ders</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-container-low rounded-full border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary text-on-background"
            >
              <option value="">Genel (ders seçilmedi)</option>
              {Object.entries(SUBJECT_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-label-md text-on-surface-variant mb-1.5">PDF Dosyası * (maks. 10MB)</label>
            <label className="flex items-center gap-3 w-full border-2 border-dashed border-outline-variant rounded-md px-4 py-3 cursor-pointer hover:border-primary transition-colors">
              <svg className="w-5 h-5 text-on-surface-variant shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span className="text-label-md text-on-surface-variant truncate">
                {file ? file.name : "PDF dosyası seçin"}
              </span>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          {error && <p className="text-sm text-on-error-container bg-error-container px-4 py-2 rounded-md">{error}</p>}
          {success && <p className="text-sm text-on-secondary-container bg-secondary-container px-4 py-2 rounded-md">{success}</p>}

          <button
            type="submit"
            disabled={uploading}
            className="bg-primary text-on-primary rounded-full px-6 py-2.5 text-label-md font-semibold squishy-btn disabled:opacity-50"
          >
            {uploading ? "Yükleniyor..." : "Kaynak Ekle"}
          </button>
        </form>
      </div>

      {/* Kaynak Listesi */}
      <div>
        <h2 className="font-display font-semibold text-on-background mb-4">
          Mevcut Kaynaklar ({resources.length})
        </h2>
        {loading ? (
          <p className="text-on-surface-variant text-sm">Yükleniyor…</p>
        ) : resources.length === 0 ? (
          <div className="text-center py-12 bg-surface-container-lowest rounded-md border border-outline-variant/30">
            <p className="text-on-surface-variant text-body-md">Henüz kaynak eklemediniz.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resources.map((r) => (
              <div key={r.id} className="bg-surface-container-lowest rounded-md p-4 soft-card-static border border-outline-variant/30 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-on-background text-body-md truncate">{r.title}</p>
                  {r.description && <p className="text-sm text-on-surface-variant mt-0.5 line-clamp-1">{r.description}</p>}
                  <div className="flex items-center gap-2 mt-1.5">
                    {r.subject && (
                      <span className="text-caption bg-primary-fixed text-on-primary-fixed rounded-full px-2 py-0.5">
                        {SUBJECT_LABELS[r.subject] ?? r.subject}
                      </span>
                    )}
                    <span className="text-caption bg-secondary-container text-on-secondary-container rounded-full px-2 py-0.5">
                      Ücretsiz
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={r.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-label-md text-primary hover:underline"
                  >
                    Gör
                  </a>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-label-md text-on-error-container hover:text-error transition-colors"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
