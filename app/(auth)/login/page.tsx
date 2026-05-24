"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const registered = params.get("registered") === "1";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (res?.error) {
      setError("E-posta veya şifre hatalı.");
      return;
    }

    router.refresh();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Blobs */}
      <div className="blob-bg bg-primary-fixed w-80 h-80 rounded-full absolute -top-20 -left-20" />
      <div
        className="blob-bg w-64 h-64 rounded-full absolute bottom-20 right-10"
        style={{ backgroundColor: "var(--color-secondary-container)", animationDelay: "-5s" }}
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
            Hesabınız yok mu?{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Kayıt Ol
            </Link>
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-12 px-4">
        <div className="bg-surface-container-lowest rounded-md p-10 soft-card-static max-w-md w-full">
          <div className="mb-8">
            <h1 className="font-display text-headline-lg text-on-background mb-2">
              Hoş Geldiniz
            </h1>
            <p className="text-on-surface-variant text-body-md">
              Hesabınıza giriş yapın
            </p>
          </div>

          {registered && (
            <div className="mb-5 bg-secondary-container text-on-secondary-container rounded-md px-4 py-3 text-label-md">
              Hesabınız oluşturuldu. Giriş yapabilirsiniz.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-label-md text-on-surface-variant mb-1.5">
                E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
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

            {error && (
              <div className="bg-error-container text-on-error-container rounded-md px-4 py-3 text-label-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-on-primary rounded-full w-full py-4 font-display font-bold text-headline-md squishy-btn disabled:opacity-50 transition-opacity mt-2"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>
          <p className="mt-6 text-center text-body-md text-on-surface-variant">
            Hesabınız yok mu?{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Kayıt Ol
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
