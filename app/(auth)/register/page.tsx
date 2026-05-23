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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Blobs */}
      <div className="blob-bg bg-primary-fixed w-80 h-80 rounded-full absolute -top-20 -left-20" />
      <div
        className="blob-bg w-64 h-64 rounded-full absolute bottom-20 right-10"
        style={{ backgroundColor: "var(--color-tertiary-fixed)", animationDelay: "-5s" }}
      />

      {/* Header */}
      <header className="relative z-10 bg-transparent px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="font-display text-on-primary text-sm font-bold">Ö</span>
            </div>
            <span className="font-display text-primary font-bold text-lg hidden sm:block">
              Öğretmen Yanımda
            </span>
          </Link>
          <p className="text-body-md text-on-surface-variant">
            Hesabınız var mı?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Giriş yapın
            </Link>
          </p>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center py-12 px-4">
        {step === 1 ? (
          /* ── STEP 1: Rol Seçimi ── */
          <div className="w-full max-w-3xl">
            <div className="text-center mb-10">
              <h1 className="font-display text-headline-xl text-on-background mb-3">
                Nasıl katılmak istersiniz?
              </h1>
              <p className="text-on-surface-variant text-body-md">
                Devam etmek için hesap türünüzü seçin
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => { setForm({ ...form, role: role.value }); setStep(2); }}
                  className="group text-left bg-surface-container-lowest rounded-md p-8 soft-card border-2 border-outline-variant hover:border-primary cursor-pointer transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-primary-fixed text-primary rounded-full flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    {role.icon}
                  </div>
                  <h2 className="font-display text-headline-md text-on-background mb-1">
                    {role.title}
                  </h2>
                  <p className="text-primary text-label-md mb-4">{role.subtitle}</p>
                  <p className="text-on-surface-variant text-body-md leading-relaxed mb-5">
                    {role.desc}
                  </p>
                  <ul className="space-y-2">
                    {role.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-label-md text-on-surface-variant">
                        <svg className="w-4 h-4 text-secondary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-label-md text-on-background">Başla</span>
                    <svg className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ── STEP 2: Kayıt Formu ── */
          <div className="w-full max-w-md">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1 text-label-md text-on-surface-variant hover:text-primary mb-6 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Geri
            </button>

            <div className="bg-surface-container-lowest rounded-md p-8 soft-card-static">
              <div className="mb-6">
                <span className="bg-primary-fixed text-on-primary-fixed rounded-full px-4 py-1.5 text-label-md inline-block mb-4">
                  {form.role === "PARENT" ? "Veli Başvurusu" : "Öğretmen Başvurusu"}
                </span>
                <h1 className="font-display text-headline-md text-on-background">
                  Bilgilerinizi girin
                </h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-label-md text-on-surface-variant mb-1.5">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="Adınız Soyadınız"
                    className="w-full px-4 py-3 bg-surface-container-low rounded-full border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition text-on-background"
                  />
                </div>

                <div>
                  <label className="block text-label-md text-on-surface-variant mb-1.5">
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    placeholder="ornek@email.com"
                    className="w-full px-4 py-3 bg-surface-container-low rounded-full border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition text-on-background"
                  />
                </div>

                <div>
                  <label className="block text-label-md text-on-surface-variant mb-1.5">
                    Şifre
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                      minLength={8}
                      placeholder="En az 8 karakter"
                      className="w-full px-4 py-3 pr-12 bg-surface-container-low rounded-full border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition text-on-background"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                      aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {form.role === "EDUCATOR" && (
                  <>
                    <div className="bg-tertiary-fixed text-on-tertiary-fixed rounded-md p-4 text-label-md">
                      Başvurunuz 1–3 iş günü içinde incelenir. Onay sonrası platforma erişim sağlarsınız.
                    </div>

                    <div>
                      <label className="block text-label-md text-on-surface-variant mb-1.5">
                        Diploma / Mezuniyet Belgesi{" "}
                        <span className="text-on-error-container">*</span>
                      </label>
                      <label className="flex items-center gap-3 w-full border-2 border-dashed border-outline-variant rounded-md px-4 py-3 cursor-pointer hover:border-primary transition-colors">
                        <svg className="w-5 h-5 text-on-surface-variant shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-label-md text-on-surface-variant truncate">
                          {diploma ? diploma.name : "PDF dosyası seçin (maks. 5MB)"}
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={(e) => setDiploma(e.target.files?.[0] || null)}
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-label-md text-on-surface-variant mb-1.5">
                        Kimlik Kartı Fotoğrafı{" "}
                        <span className="text-on-error-container">*</span>
                      </label>
                      <label className="flex items-center gap-3 w-full border-2 border-dashed border-outline-variant rounded-md px-4 py-3 cursor-pointer hover:border-primary transition-colors">
                        <svg className="w-5 h-5 text-on-surface-variant shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2" />
                        </svg>
                        <span className="text-label-md text-on-surface-variant truncate">
                          {idCard ? idCard.name : "JPG veya PNG seçin (maks. 5MB)"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => setIdCard(e.target.files?.[0] || null)}
                        />
                      </label>
                    </div>

                    <div className="bg-surface-container rounded-md p-4 border border-outline-variant">
                      <p className="text-caption text-on-surface-variant leading-relaxed mb-3">
                        Yüklediğiniz diploma ve kimlik kartı bilgileri yalnızca kimlik doğrulama amacıyla kullanılır. Bu bilgiler hiçbir üçüncü tarafla paylaşılmaz, öğrencilere veya velilere gösterilmez. Onay sürecinin ardından belgeler güvenli şekilde saklanır. 6698 sayılı KVKK kapsamında haklarınız saklıdır.
                      </p>
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={kvkkAccepted}
                          onChange={(e) => setKvkkAccepted(e.target.checked)}
                          className="mt-0.5 rounded accent-primary"
                        />
                        <span className="text-caption text-on-surface-variant font-semibold">
                          Belge bilgilerimin yalnızca kimlik doğrulama amacıyla kullanılacağını, üçüncü taraflarla paylaşılmayacağını okudum ve onaylıyorum.
                        </span>
                      </label>
                    </div>
                  </>
                )}

                {error && (
                  <div className="bg-error-container text-on-error-container rounded-md px-4 py-3 text-label-md">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-on-primary rounded-full w-full py-4 font-display font-bold squishy-btn disabled:opacity-50 transition-opacity mt-2"
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
