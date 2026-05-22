"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminGirisPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (res?.error) {
      setError("Kimlik doğrulama başarısız. Bilgilerinizi kontrol edin.");
      return;
    }

    // Sadece admin ise yönlendir
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden p-4">
      {/* Blobs */}
      <div className="blob-bg bg-primary-fixed w-80 h-80 rounded-full absolute -top-20 -right-20" />
      <div
        className="blob-bg w-64 h-64 rounded-full absolute -bottom-16 -left-16"
        style={{ backgroundColor: "var(--color-tertiary-fixed)", animationDelay: "-5s" }}
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Lock icon */}
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg className="w-8 h-8 text-on-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest rounded-md p-10 soft-card-static">
          <h1 className="font-display text-headline-lg text-on-background text-center mb-2">
            Yönetici Girişi
          </h1>
          <p className="text-on-surface-variant text-body-md text-center mb-8">
            Yalnızca admin hesapları giriş yapabilir
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-label-md text-on-surface-variant mb-1.5">
                E-posta Adresi
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@ogretmenyanimda.com.tr"
                className="w-full px-4 py-3 bg-surface-container-low rounded-full border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition text-on-background"
              />
            </div>

            <div>
              <label className="block text-label-md text-on-surface-variant mb-1.5">
                Şifre
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 bg-surface-container-low rounded-full border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition text-on-background"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition p-1"
                >
                  {showPass ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-error-container text-on-error-container rounded-md px-4 py-3 text-label-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-on-primary rounded-full w-full py-4 font-display font-bold text-headline-md squishy-btn disabled:opacity-50 transition-opacity mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Doğrulanıyor...
                </>
              ) : (
                "Panele Giriş Yap"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-label-md text-on-surface-variant hover:text-primary transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Ana sayfaya dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
