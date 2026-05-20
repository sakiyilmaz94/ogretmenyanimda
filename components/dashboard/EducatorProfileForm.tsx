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
    photoUrl: string | null;
    titleName: string | null;
    experience: number | null;
    skills: string[];
    certificates: string[];
    linkedinUrl: string | null;
    isProfilePublic: boolean;
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
    photoUrl: educator.photoUrl ?? "",
    titleName: educator.titleName ?? "",
    experience: educator.experience?.toString() ?? "",
    skills: educator.skills.join(", "),
    certificates: educator.certificates.join(", "),
    linkedinUrl: educator.linkedinUrl ?? "",
    isProfilePublic: educator.isProfilePublic,
  });
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
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

    const res = await fetch("/api/educator/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        hourlyRate: parseFloat(form.hourlyRate),
        experience: form.experience ? parseInt(form.experience) : null,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        certificates: form.certificates.split(",").map((s) => s.trim()).filter(Boolean),
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

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Profil Yayın Durumu */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-navy-900">Profili Yayınla</p>
          <p className="text-slate-500 text-sm">Profiliniz &quot;Öğretmenlerimiz&quot; sayfasında görünsün</p>
        </div>
        <button
          type="button"
          onClick={() => setForm({ ...form, isProfilePublic: !form.isProfilePublic })}
          className={`w-12 h-6 rounded-full transition-colors relative ${form.isProfilePublic ? "bg-gold-500" : "bg-slate-200"}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isProfilePublic ? "translate-x-6" : "translate-x-0.5"}`} />
        </button>
      </div>

      {/* Kişisel Bilgiler */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <h2 className="font-semibold text-navy-900">Kişisel Bilgiler</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Ad Soyad</label>
            <input value={educator.user.name ?? ""} disabled
              className="w-full px-4 py-2.5 rounded-xl border border-slate-100 text-sm bg-slate-50 text-slate-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">E-posta</label>
            <input value={educator.user.email} disabled
              className="w-full px-4 py-2.5 rounded-xl border border-slate-100 text-sm bg-slate-50 text-slate-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Telefon</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="05XX XXX XX XX" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Unvan</label>
            <input value={form.titleName} onChange={(e) => setForm({ ...form, titleName: e.target.value })}
              placeholder="ör. Matematik Öğretmeni" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Deneyim (yıl)</label>
            <input type="number" min={0} max={50} value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
              placeholder="ör. 5" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Saatlik Ücret (₺)</label>
            <input type="number" min={0} step={10} value={form.hourlyRate}
              onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })} className={inputCls} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Profil Fotoğrafı</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-navy-900 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
              {form.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.photoUrl} alt="Profil" className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <span className="font-serif text-2xl text-gold-400">
                  {(educator.user.name ?? "E")[0].toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <label className="cursor-pointer">
                <span className="inline-block px-4 py-2 bg-slate-100 text-slate-700 text-sm rounded-xl hover:bg-slate-200 transition font-medium">
                  {uploadingPhoto ? "Yükleniyor..." : "Fotoğraf Seç"}
                </span>
                <input type="file" accept="image/*" className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingPhoto(true);
                    const fd = new FormData();
                    fd.append("file", file);
                    fd.append("folder", "profile-photos");
                    const res = await fetch("/api/upload", { method: "POST", body: fd });
                    setUploadingPhoto(false);
                    if (res.ok) {
                      const { url } = await res.json();
                      setForm((f) => ({ ...f, photoUrl: url }));
                    }
                  }}
                />
              </label>
              <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP · Maks 5 MB</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">LinkedIn URL</label>
          <input value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
            placeholder="https://linkedin.com/in/..." className={inputCls} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Hakkımda</label>
          <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4}
            placeholder="Deneyiminizi, uzmanlık alanlarınızı kısaca anlatın..."
            className={`${inputCls} resize-none`} />
        </div>
      </div>

      {/* Yetenek & Sertifikalar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <h2 className="font-semibold text-navy-900">Yetenek & Sertifikalar</h2>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Yetenekler <span className="text-slate-400 font-normal">(virgülle ayırın)</span>
          </label>
          <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })}
            placeholder="ör. Problem çözme, Sabırlı anlatım, Görsel öğretim" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Sertifikalar & Eğitimler <span className="text-slate-400 font-normal">(virgülle ayırın)</span>
          </label>
          <input value={form.certificates} onChange={(e) => setForm({ ...form, certificates: e.target.value })}
            placeholder="ör. Eğitim Fakültesi Mezunu, Pedagoji Sertifikası" className={inputCls} />
        </div>
      </div>

      {/* Ders Konuları */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <h2 className="font-semibold text-navy-900">Ders Konuları</h2>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(SUBJECT_LABELS) as Subject[]).map((s) => (
            <button key={s} type="button" onClick={() => toggleSubject(s)}
              className={`px-3 py-1.5 rounded-xl text-sm border-2 transition font-medium ${
                form.subjects.includes(s)
                  ? "border-gold-400 bg-gold-50 text-gold-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}>
              {SUBJECT_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Sınıf Seviyeleri */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <h2 className="font-semibold text-navy-900">Sınıf Seviyeleri</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.keys(GRADE_LABELS) as GradeLevel[]).map((g) => (
            <button key={g} type="button" onClick={() => toggleGrade(g)}
              className={`px-3 py-2 rounded-xl text-sm border-2 transition text-center font-medium ${
                form.gradeLevels.includes(g)
                  ? "border-gold-400 bg-gold-50 text-gold-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}>
              {GRADE_LABELS[g]}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-600 text-sm bg-red-50 rounded-xl p-4">{error}</p>}
      {success && <p className="text-green-700 text-sm bg-green-50 rounded-xl p-4">Profiliniz güncellendi.</p>}

      <button type="submit" disabled={loading}
        className="w-full bg-gold-500 text-white py-3.5 rounded-xl font-bold hover:bg-gold-600 disabled:opacity-50 transition">
        {loading ? "Kaydediliyor..." : "Profili Kaydet"}
      </button>
    </form>
  );
}
