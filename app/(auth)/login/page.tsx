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
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-surface-container-low rounded-full border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition text-on-background"
              />
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
