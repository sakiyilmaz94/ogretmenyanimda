import { auth } from "@/auth";
import { db } from "@/lib/db";
import { formatCurrency, formatDate, SUBJECT_LABELS, GRADE_LABELS } from "@/lib/utils";
import Link from "next/link";
import NavIcon, { type NavIconName } from "@/components/layout/NavIcon";
import { isSalesOpen } from "@/lib/site-status";

export const dynamic = "force-dynamic";

export default async function ParentDashboard() {
  const session = await auth();
  const parent = await db.parent.findUnique({
    where: { userId: session!.user.id },
    include: {
      students: {
        orderBy: { createdAt: "asc" },
        include: {
          bookings: {
            include: {
              educator: { include: { user: true } },
              slot: true,
              payment: true,
            },
          },
        },
      },
    },
  });

  if (!parent) return null;

  const salesOpen = await isSalesOpen();
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const weekEnd = new Date(startOfToday.getTime() + 7 * 864e5);

  const all = parent.students.flatMap((s) =>
    s.bookings.map((b) => ({
      id: b.id,
      status: b.status,
      studentName: s.name,
      educatorName: b.educator.user.name ?? "—",
      subject: b.subject,
      date: new Date(b.slot.date),
      startTime: b.slot.startTime,
      price: b.totalPrice.toNumber(),
      paid: b.payment?.status === "PAID",
      paymentAmount: b.payment?.status === "PAID" ? b.payment.amount.toNumber() : 0,
    }))
  );

  const isPendingPay = (b: (typeof all)[number]) => b.status === "CONFIRMED" && !b.paid;
  const pendingCount = all.filter(isPendingPay).length;
  const completedThisMonth = all.filter((b) => b.status === "COMPLETED" && b.date >= startOfMonth).length;
  const upcomingThisWeek = all.filter((b) => b.status === "CONFIRMED" && b.date >= startOfToday && b.date <= weekEnd).length;
  const totalSpent = all.reduce((sum, b) => sum + b.paymentAmount, 0);

  // Yaklaşan dersler (onaylı, gelecekte), en yakın 3
  const upcoming = all
    .filter((b) => b.status === "CONFIRMED" && b.date >= startOfToday)
    .sort((a, b) => +a.date - +b.date)
    .slice(0, 3);

  const hasChild = parent.students.length > 0;
  const hasLesson = all.length > 0;
  const hasPaid = all.some((b) => b.paid);
  const showGuide = !hasChild || !hasLesson;
  const guideSteps = [
    { n: 1, title: "Çocuğunuzu ekleyin", desc: "Adı ve sınıfı yeterli.", href: "/parent/students", done: hasChild, cta: "Çocuk Ekle" },
    { n: 2, title: "Öğretmen ve saati seçin", desc: "Uygun öğretmeni bulun, size uyan saati rezerve edin.", href: "/parent/book", done: hasLesson, cta: "Ders Al" },
    { n: 3, title: "Ödemeyi yapın", desc: "Öğretmen onayından sonra havale ile ödeyin; ödeme onaylanınca ders kesinleşir.", href: "/parent/bookings", done: hasPaid, cta: "Derslerim" },
  ];

  const metrics: { label: string; value: string | number; icon: NavIconName; ring: string; iconBg: string }[] = [
    { label: "Ödeme bekleyen ders", value: pendingCount, icon: "payments", ring: "border-error/30", iconBg: "bg-error-container text-on-error-container" },
    { label: "Bu ay tamamlanan", value: completedThisMonth, icon: "approvals", ring: "border-outline-variant/20", iconBg: "bg-secondary-container text-on-secondary-container" },
    { label: "Bu hafta yaklaşan", value: upcomingThisWeek, icon: "schedule", ring: "border-outline-variant/20", iconBg: "bg-primary-fixed text-primary" },
    { label: "Toplam harcama", value: formatCurrency(totalSpent), icon: "list", ring: "border-outline-variant/20", iconBg: "bg-surface-container-high text-on-surface-variant" },
  ];

  const quickActions: { label: string; href: string; icon: NavIconName }[] = [
    { label: "Yeni ders al", href: "/parent/book", icon: "calendarPlus" },
    { label: "Öğrenci ekle", href: "/parent/students", icon: "students" },
    { label: "Öğretmen bul", href: "/egitmenlerimiz", icon: "teachers" },
  ];

  return (
    <div className="space-y-8">
      {/* a) Ödeme uyarı banner'ı */}
      {pendingCount > 0 && (
        <div className="bg-tertiary-fixed border border-on-tertiary-fixed/15 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <p className="font-display font-semibold text-on-tertiary-fixed">
              {pendingCount} dersin ödemesi bekliyor
            </p>
          </div>
          <Link href="/parent/bookings"
            className="rounded-full squishy-btn bg-primary text-on-primary px-5 py-2.5 text-label-md font-semibold shrink-0 text-center">
            Ödemelere git →
          </Link>
        </div>
      )}

      {!salesOpen && (
        <div className="bg-primary-fixed border border-primary/20 rounded-2xl px-5 py-4 flex items-start gap-3">
          <span className="text-2xl">📚</span>
          <div>
            <p className="font-display font-semibold text-on-primary-fixed">Dersler çok yakında başlıyor!</p>
            <p className="text-body-md text-on-primary-fixed/80">
              Ders satışı açıldığında kayıtlı e-posta adresinize haber vereceğiz. Bu arada çocuğunuzu ekleyebilir,
              ücretsiz kaynaklarımızı ve eğitim oyunlarımızı kullanabilirsiniz.
            </p>
          </div>
        </div>
      )}

      <div>
        <h1 className="font-display text-headline-lg text-on-background">
          Hoş geldiniz, {session?.user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-body-md text-on-surface-variant">Çocuğunuzun dersleri, ödemeleri ve ücretsiz çalışma materyalleri tek yerde</p>
      </div>

      {/* Başlangıç rehberi (çocuk veya ders yoksa) */}
      {showGuide && (
        <div className="bg-surface-container-lowest rounded-2xl border border-primary/20 p-5 soft-card-static">
          <h2 className="font-display font-semibold text-on-background text-headline-md mb-1">Nasıl başlarım?</h2>
          <p className="text-body-md text-on-surface-variant mb-4">Üç adımda ilk dersinize hazırlanın.</p>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {guideSteps.map((g) => (
              <li key={g.n} className={`rounded-xl border p-4 flex flex-col gap-2 ${g.done ? "border-secondary-container bg-secondary-container/30" : "border-outline-variant/30"}`}>
                <div className="flex items-center gap-2">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-label-md font-bold shrink-0 ${g.done ? "bg-secondary-container text-on-secondary-container" : "bg-primary text-on-primary"}`}>
                    {g.done ? "✓" : g.n}
                  </span>
                  <span className="font-display font-semibold text-on-background">{g.title}</span>
                </div>
                <p className="text-caption text-on-surface-variant leading-relaxed">{g.desc}</p>
                {!g.done && (
                  <Link href={g.href} className="mt-auto self-start text-label-md text-primary font-semibold hover:underline">{g.cta} →</Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* b) Metrik kartlar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className={`bg-surface-container-lowest rounded-2xl p-5 soft-card-static border ${m.ring}`}>
            <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-3 ${m.iconBg}`}>
              <NavIcon name={m.icon} className="w-6 h-6" />
            </div>
            <div className="font-display text-headline-md text-on-background">{m.value}</div>
            <div className="text-caption text-on-surface-variant">{m.label}</div>
          </div>
        ))}
      </div>

      {/* c) Hızlı işlem butonları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickActions.map((a) => (
          <Link key={a.href} href={a.href}
            className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 soft-card flex items-center gap-3 hover:border-primary/40 transition">
            <span className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center shrink-0">
              <NavIcon name={a.icon} className="w-5 h-5" />
            </span>
            <span className="font-display font-semibold text-on-background">{a.label}</span>
            <span className="ml-auto text-primary">→</span>
          </Link>
        ))}
      </div>

      {/* c2) Ücretsiz içerikler */}
      <div>
        <h2 className="font-display font-semibold text-on-background text-headline-md mb-3">Ücretsiz içerikler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Ücretsiz Kaynaklar", desc: "Sınıfa göre çalışma kağıtları ve fasiküller", href: "/kaynaklar", icon: "resources" as NavIconName },
            { label: "Eğitim Oyunları", desc: "Çarpım tablosu, okuma ve hız okuma oyunları", href: "/oyunlar", icon: "lessons" as NavIconName },
          ].map((a) => (
            <Link key={a.href} href={a.href}
              className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 soft-card flex items-center gap-3 hover:border-primary/40 transition">
              <span className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                <NavIcon name={a.icon} className="w-5 h-5" />
              </span>
              <span>
                <span className="block font-display font-semibold text-on-background">{a.label}</span>
                <span className="block text-caption text-on-surface-variant">{a.desc}</span>
              </span>
              <span className="ml-auto text-primary">→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* d) 2 sütun: Çocuklarım + Yaklaşan Dersler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Çocuklarım */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-5 soft-card-static">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-on-background text-headline-md">Çocuklarım</h2>
            <Link href="/parent/students" className="text-caption text-primary font-semibold hover:underline">Tümü →</Link>
          </div>
          {parent.students.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-body-md text-on-surface-variant mb-3">Henüz çocuk eklemediniz.</p>
              <Link href="/parent/students" className="inline-block rounded-full squishy-btn bg-primary text-on-primary px-5 py-2.5 text-label-md font-semibold">Çocuk Ekle</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {parent.students.map((s) => {
                const sb = all.filter((b) => b.studentName === s.name);
                const pend = sb.filter(isPendingPay).length;
                const lastLesson = sb.filter((b) => b.status === "COMPLETED" || b.date <= now)
                  .sort((a, b) => +b.date - +a.date)[0];
                return (
                  <div key={s.id} className="flex items-center gap-3 border border-outline-variant/20 rounded-xl p-3">
                    <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                      <span className="text-on-primary font-display font-bold">{s.name[0].toUpperCase()}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display font-semibold text-on-background truncate">{s.name}</p>
                      <p className="text-caption text-on-surface-variant">{GRADE_LABELS[s.gradeLevel] ?? s.gradeLevel}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {pend > 0 && (
                        <span className="text-[11px] bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded-full font-semibold">{pend} ödeme bekliyor</span>
                      )}
                      <span className="text-[11px] bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full">
                        Son ders: {lastLesson ? formatDate(lastLesson.date) : "—"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Yaklaşan Dersler */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-5 soft-card-static flex flex-col">
          <h2 className="font-display font-semibold text-on-background text-headline-md mb-4">Yaklaşan Dersler</h2>
          {upcoming.length === 0 ? (
            <p className="text-body-md text-on-surface-variant py-6 text-center flex-1">Yaklaşan ders yok.</p>
          ) : (
            <div className="space-y-3 flex-1">
              {upcoming.map((b) => (
                <div key={b.id} className="flex items-center gap-3 border border-outline-variant/20 rounded-xl p-3">
                  <div className="bg-primary-fixed rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-display font-bold">{b.educatorName[0]?.toUpperCase()}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display font-semibold text-on-background truncate">{b.educatorName}</p>
                    <p className="text-caption text-on-surface-variant truncate">
                      {SUBJECT_LABELS[b.subject] ?? b.subject} · {b.studentName}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-caption font-semibold text-on-background">{formatDate(b.date)}</p>
                    <p className="text-[11px] text-on-surface-variant">{b.startTime}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link href="/parent/book"
            className="mt-4 rounded-full squishy-btn bg-primary text-on-primary px-5 py-2.5 text-label-md font-semibold text-center">
            + Yeni ders rezervasyonu
          </Link>
        </div>
      </div>
    </div>
  );
}
