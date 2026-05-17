"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Subject, GradeLevel } from "@prisma/client";
import { SUBJECT_LABELS, GRADE_LABELS } from "@/lib/utils";

interface Props {
  educator: {
    id: string;
    bio: string | null;
    subjects: Subject[];
    gradeLevels: GradeLevel[];
    hourlyRate: number;
    phone: string | null;
    user: { name: string | null; email: string };
  };
}

export default function EducatorProfileForm({ educator }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    bio: educator.bio ?? "",
    subjects: educator.subjects as Subject[],
    gradeLevels: educator.gradeLevels as GradeLevel[],
    hourlyRate: educator.hourlyRate.toString(),
    phone: educator.phone ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function toggleSubject(s: Subject) {
    setForm((f) => ({
      ...f,
      subjects: f.subjects.includes(s) ? f.subjects.filter((x) => x !== s) : [...f.subjects, s],
    }));
  }

  function toggleGrade(g: GradeLevel) {
    setForm((f) => ({
      ...f,
      gradeLevels: f.gradeLevels.includes(g) ? f.gradeLevels.filter((x) => x !== g) : [...f.gradeLevels, g],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const res = await fetch(`/api/educator/profile`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        hourlyRate: parseFloat(form.hourlyRate),
      }),
    });

    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      router.refresh();
    } else {
      const d = await res.json();
      setError(d.error ?? "Bir hata oluştu.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Kişisel Bilgiler</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
          <input
            value={educator.user.name ?? ""}
            disabled
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
          <input
            value={educator.user.email}
            disabled
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="05XX XXX XX XX"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hakkımda</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={4}
            placeholder="Deneyiminizi, uzmanlık alanlarınızı kısaca anlatın..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Saatlik Ücret (₺)</label>
          <input
            type="number"
            min="0"
            step="10"
            value={form.hourlyRate}
            onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Ders Konuları</h2>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(SUBJECT_LABELS) as Subject[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSubject(s)}
              className={`px-3 py-1.5 rounded-lg text-sm border-2 transition ${
                form.subjects.includes(s)
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {SUBJECT_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Sınıf Seviyeleri</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.keys(GRADE_LABELS) as GradeLevel[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => toggleGrade(g)}
              className={`px-3 py-2 rounded-lg text-sm border-2 transition text-center ${
                form.gradeLevels.includes(g)
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {GRADE_LABELS[g]}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg p-3">{error}</p>}
      {success && <p className="text-green-700 text-sm bg-green-50 rounded-lg p-3">✅ Profiliniz güncellendi.</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
  );
}
