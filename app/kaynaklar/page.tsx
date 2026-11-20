import Link from "next/link";
import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import SalesAnnouncementBar from "@/components/layout/SalesAnnouncementBar";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Ücretsiz Kaynaklar — Öğretmen Yanımda",
  description: "İlkokul 1-4. sınıf için ücretsiz çalışma kağıtları ve fasiküller.",
};

const GRADES = [
  { n: "1", key: "ILKOKUL_1", label: "1. Sınıf" },
  { n: "2", key: "ILKOKUL_2", label: "2. Sınıf" },
  { n: "3", key: "ILKOKUL_3", label: "3. Sınıf" },
  { n: "4", key: "ILKOKUL_4", label: "4. Sınıf" },
  { n: "tum", key: "ALL", label: "Tüm Sınıflar" },
];

export default async function KaynaklarPage({ searchParams }: { searchParams: Promise<{ sinif?: string }> }) {
  const session = await auth();
  const role = session?.user?.role ?? null;
  const { sinif } = await searchParams;
  const active = GRADES.find((g) => g.n === sinif) ?? GRADES[0];

  const resources = await db.freeResource.findMany({
    where: active.key === "ALL" ? { grade: null } : { grade: active.key as never },
    orderBy: { createdAt: "asc" },
  });

  return (
    <>
      <SalesAnnouncementBar />
      <PublicNavbar role={role} />
      <main className="pt-16 bg-background">
        <section className="bg-inverse-surface py-16 text-center relative overflow-hidden">
          <div className="blob-bg bg-primary-fixed w-96 h-96 rounded-full absolute -top-20 -right-20 opacity-30" />
          <div className="max-w-3xl mx-auto px-4 relative">
            <p className="text-primary font-semibold text-label-md uppercase tracking-widest mb-3">Ücretsiz</p>
            <h1 className="font-display text-headline-xl text-on-background mb-4">Kaynaklar</h1>
            <p className="text-on-surface-variant text-body-lg">
              Sınıfınızı seçin, çalışma kağıdını ve fasikülü indirin.
            </p>
          </div>
        </section>

        <section className="bg-surface-container-low py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {GRADES.map((g) => (
                <Link
                  key={g.n}
                  href={`/kaynaklar?sinif=${g.n}`}
                  className={`px-5 py-2.5 rounded-full text-label-md font-bold transition ${
                    g.n === active.n
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {g.label}
                </Link>
              ))}
            </div>

            {resources.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-md p-10 text-center soft-card-static">
                <p className="text-body-md text-on-surface-variant">
                  {active.key === "ALL" ? "Tüm sınıflara uygun kaynaklar" : active.label + " kaynakları"} çok yakında burada olacak.
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {resources.map((r) => (
                  <li key={r.id}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-4 bg-surface-container-lowest rounded-md px-5 py-4 soft-card hover:shadow-md transition cursor-pointer"
                    >
                      <span className="font-display text-body-lg font-semibold text-on-background">{r.title}</span>
                      <span className="shrink-0 inline-flex items-center rounded-full bg-primary text-on-primary px-4 py-1.5 text-label-md font-bold">
                        Aç / İndir →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
