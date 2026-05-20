"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "" });
  const [diploma, setDiploma] = useState<File | null>(null);
  const [idCard, setIdCard] = useState<File | null>(null);
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function uploadFile(file: File, type: string): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", type);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    return data.url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.role === "EDUCATOR" && !kvkkAccepted) {
      setError("Devam edebilmek için gizlilik metnini onaylamanız gerekir.");
      return;
    }
    setLoading(true);
    setError("");

    let diplomaUrl: string | undefined;
    let idCardUrl: string | undefined;

    if (form.role === "EDUCATOR") {
      if (!diploma || !idCard) {
        setError("Diploma ve kimlik kartı fotoğrafı yüklemek zorunludur.");
        setLoading(false);
        return;
      }
      try {
        [diplomaUrl, idCardUrl] = await Promise.all([
          uploadFile(diploma, "diploma"),
          uploadFile(idCard, "idcard"),
        ]);
      } catch {
        setError("Dosya yükleme sırasında hata oluştu. Tekrar deneyin.");
        setLoading(false);
        return;
      }
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, diplomaUrl, idCardUrl }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Kayıt sırasında bir hata oluştu.");
      return;
    }

    router.push("/login?registered=1");
  }

  const roles = [
    {
      value: "PARENT",
      title: "Veli Başvurusu",
      subtitle: "Çocuğunuz için özel ders arayın",
      desc: "Onaylı öğretmenlerimiz arasından çocuğunuza en uygun olanı seçin, randevu alın ve ilerlemesini takip edin.",
      features: ["Öğretmen seçimi", "Randevu takibi", "Ödeme & fatura", "İlerleme raporu"],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      value: "EDUCATOR",
      title: "Öğretmen Başvurusu",
      subtitle: "Platformda ders verin, gelir elde edin",
      desc: "Başvurunuz yöneticilerimiz tarafından incelenir. Onaylandıktan sonra profilinizi oluşturup ders verebilirsiniz.",
      features: ["Esnek çalışma saati", "Düzenli gelir", "Profil sayfası", "Randevu yönetimi"],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-navy-900 rounded-lg flex items-center justify-center">
              <span className="font-serif text-gold-400 text-sm font-bold">Ö</span>
            </div>
            <span className="font-serif text-navy-900 font-semibold text-lg hidden sm:block">Öğretmen Yanımda</span>
          </Link>
          <p className="text-sm text-slate-500">
            Hesabınız var mı?{" "}
            <Link href="/login" className="text-gold-600 font-medium hover:underline">
              Giriş yapın
            </Link>
          </p>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        {step === 1 ? (
          <div className="w-full max-w-3xl">
            <div className="text-center mb-10">
              <h1 className="font-serif text-4xl text-navy-900 mb-3">Hesap Oluşturun</h1>
              <p className="text-slate-500 text-lg">Devam etmek için hesap türünüzü seçin</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => { setForm({ ...form, role: role.value }); setStep(2); }}
                  className="text-left bg-white rounded-2xl border-2 border-slate-100 p-8 hover:border-gold-400 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-navy-50 text-navy-700 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-navy-900 group-hover:text-gold-400 transition-colors">
                    {role.icon}
                  </div>
                  <h2 className="font-serif text-2xl text-navy-900 mb-1">{role.title}</h2>
                  <p className="text-gold-600 text-sm font-medium mb-4">{role.subtitle}</p>
                  <p className="text-slate-500 text-sm leading-relaxed mb-5">{role.desc}</p>
                  <ul className="space-y-2">
                    {role.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                        <svg className="w-4 h-4 text-gold-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm font-semibold text-navy-900">Başla</span>
                    <svg className="w-5 h-5 text-gold-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1 text-sm text-slate-500 hover:text-navy-900 mb-6 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Geri
            </button>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-gold-50 text-gold-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {form.role === "PARENT" ? "Veli Başvurusu" : "Öğretmen Başvurusu"}
                </div>
                <h1 className="font-serif text-2xl text-navy-900">Bilgilerinizi girin</h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Ad Soyad</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="Adınız Soyadınız"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">E-posta</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    placeholder="ornek@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Şifre</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    minLength={8}
                    placeholder="En az 8 karakter"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition"
                  />
                </div>

                {form.role === "EDUCATOR" && (
                  <>
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700">
                      Başvurunuz 1–3 iş günü içinde incelenir. Onay sonrası platforma erişim sağlarsınız.
                    </div>

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
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={e => setDiploma(e.target.files?.[0] || null)}
                        />
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
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => setIdCard(e.target.files?.[0] || null)}
                        />
                      </label>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <p className="text-xs text-slate-500 leading-relaxed mb-3">
                        Yüklediğiniz diploma ve kimlik kartı bilgileri yalnızca kimlik doğrulama amacıyla kullanılır. Bu bilgiler hiçbir üçüncü tarafla paylaşılmaz, öğrencilere veya velilere gösterilmez. Onay sürecinin ardından belgeler güvenli şekilde saklanır. 6698 sayılı KVKK kapsamında haklarınız saklıdır.
                      </p>
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={kvkkAccepted}
                          onChange={e => setKvkkAccepted(e.target.checked)}
                          className="mt-0.5 rounded"
                        />
                        <span className="text-xs text-slate-600 font-medium">
                          Belge bilgilerimin yalnızca kimlik doğrulama amacıyla kullanılacağını, üçüncü taraflarla paylaşılmayacağını okudum ve onaylıyorum.
                        </span>
                      </label>
                    </div>
                  </>
                )}

                {error && (
                  <p className="text-red-600 text-sm bg-red-50 rounded-xl px-4 py-3">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold-500 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-gold-600 disabled:opacity-50 transition-colors"
                >
                  {loading ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
