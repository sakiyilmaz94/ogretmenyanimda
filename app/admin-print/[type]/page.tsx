import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCommissionRate } from "@/lib/finance";
import { SUBJECT_LABELS, GRADE_LABELS } from "@/lib/utils";
import AutoPrint from "@/components/dashboard/AutoPrint";

export const dynamic = "force-dynamic";

const tl = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₺";
const d = (x: Date | string) => new Date(x).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" });

function cutoff(range?: string): number | null {
  const now = Date.now();
  if (range === "15d") return now - 15 * 864e5;
  if (range === "1m") return now - 30 * 864e5;
  if (range === "3m") return now - 90 * 864e5;
  return null;
}
const rangeLabel: Record<string, string> = { all: "Tüm zamanlar", "15d": "Son 15 gün", "1m": "Son 1 ay", "3m": "Son 3 ay" };

const TITLES: Record<string, string> = {
  finans: "Finansal Rapor (Gelir-Gider)",
  odemeler: "Ödeme / İşlem Dökümü",
  ogretmenler: "Öğretmen Listesi ve Kazançları",
  ogrenciler: "Öğrenci Listesi",
  veliler: "Veli Listesi",
};

export default async function AdminPrintPage({
  params, searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ range?: string }>;
}) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const { type } = await params;
  const { range = "all" } = await searchParams;
  const cut = cutoff(range);
  const rate = await getCommissionRate();
  const title = TITLES[type] ?? "Rapor";

  let content: React.ReactNode = <p>Bilinmeyen rapor türü.</p>;

  // ---- FİNANS ----
  if (type === "finans") {
    const payments = await db.payment.findMany({ where: { status: "PAID" }, select: { amount: true, createdAt: true } });
    const inRange = payments.filter((p) => cut === null || +p.createdAt >= cut);
    const gross = inRange.reduce((s, p) => s + p.amount.toNumber(), 0);
    const commission = Math.round(gross * (rate / 100) * 100) / 100;
    const payout = Math.round((gross - commission) * 100) / 100;
    content = (
      <table className="kv">
        <tbody>
          <tr><td>Ödeme adedi</td><td>{inRange.length}</td></tr>
          <tr><td>Toplam tahsilat (brüt)</td><td>{tl(gross)}</td></tr>
          <tr className="hi"><td>Platform geliri (komisyon %{rate})</td><td>{tl(commission)}</td></tr>
          <tr><td>Öğretmene ödenecek toplam</td><td>{tl(payout)}</td></tr>
        </tbody>
      </table>
    );
  }

  // ---- ÖDEMELER ----
  else if (type === "odemeler") {
    const payments = await db.payment.findMany({
      orderBy: { createdAt: "desc" },
      include: { booking: { include: { student: true, educator: { include: { user: true } } } } },
    });
    const rows = payments.filter((p) => cut === null || +p.createdAt >= cut);
    const stLabel: Record<string, string> = { PAID: "Ödendi", PENDING: "Beklemede", FAILED: "Başarısız", REFUNDED: "İade" };
    content = (
      <table className="grid">
        <thead><tr><th>Tarih</th><th>Öğrenci</th><th>Öğretmen</th><th>Tutar</th><th>Bizim (%{rate})</th><th>Öğretmene</th><th>Durum</th></tr></thead>
        <tbody>
          {rows.map((p) => {
            const a = p.amount.toNumber(); const c = Math.round(a * (rate / 100) * 100) / 100;
            return <tr key={p.id}><td>{d(p.createdAt)}</td><td>{p.booking.student.name}</td><td>{p.booking.educator.user.name}</td><td className="r">{tl(a)}</td><td className="r">{p.status === "PAID" ? tl(c) : "—"}</td><td className="r">{p.status === "PAID" ? tl(a - c) : "—"}</td><td>{stLabel[p.status] ?? p.status}</td></tr>;
          })}
        </tbody>
      </table>
    );
  }

  // ---- ÖĞRETMENLER ----
  else if (type === "ogretmenler") {
    const eds = await db.educator.findMany({
      include: { user: true, bookings: { include: { payment: true } } },
      orderBy: { createdAt: "desc" },
    });
    const stLabel: Record<string, string> = { APPROVED: "Onaylı", PENDING: "Beklemede", REJECTED: "Reddedildi" };
    content = (
      <table className="grid">
        <thead><tr><th>Öğretmen</th><th>E-posta</th><th>Branşlar</th><th>Ücret/saat</th><th>Ödenen ders</th><th>Brüt kazanç</th><th>Öğretmene</th><th>Durum</th></tr></thead>
        <tbody>
          {eds.map((e) => {
            const paid = e.bookings.filter((b) => b.payment?.status === "PAID");
            const gross = paid.reduce((s, b) => s + (b.payment?.amount.toNumber() ?? 0), 0);
            const payout = Math.round(gross * (1 - rate / 100) * 100) / 100;
            return <tr key={e.id}><td>{e.user.name}</td><td>{e.user.email}</td><td>{e.subjects.map((s) => SUBJECT_LABELS[s] ?? s).join(", ")}</td><td className="r">{tl(e.hourlyRate.toNumber())}</td><td className="r">{paid.length}</td><td className="r">{tl(gross)}</td><td className="r">{tl(payout)}</td><td>{stLabel[e.status] ?? e.status}</td></tr>;
          })}
        </tbody>
      </table>
    );
  }

  // ---- ÖĞRENCİLER ----
  else if (type === "ogrenciler") {
    const students = await db.student.findMany({
      orderBy: { createdAt: "desc" },
      include: { parent: { include: { user: true } }, bookings: { select: { id: true } } },
    });
    content = (
      <table className="grid">
        <thead><tr><th>Öğrenci</th><th>Sınıf</th><th>Veli</th><th>Ders sayısı</th><th>Kayıt tarihi</th></tr></thead>
        <tbody>
          {students.map((s) => <tr key={s.id}><td>{s.name}</td><td>{GRADE_LABELS[s.gradeLevel] ?? s.gradeLevel}</td><td>{s.parent.user.name}</td><td className="r">{s.bookings.length}</td><td>{d(s.createdAt)}</td></tr>)}
        </tbody>
      </table>
    );
  }

  // ---- VELİLER ----
  else if (type === "veliler") {
    const parents = await db.parent.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true, students: { include: { bookings: { include: { payment: true } } } } },
    });
    content = (
      <table className="grid">
        <thead><tr><th>Veli</th><th>E-posta</th><th>Telefon</th><th>Çocuk</th><th>Toplam harcama</th><th>Kayıt</th></tr></thead>
        <tbody>
          {parents.map((p) => {
            const spent = p.students.reduce((sum, s) => sum + s.bookings.reduce((bs, b) => bs + (b.payment?.status === "PAID" ? b.payment.amount.toNumber() : 0), 0), 0);
            return <tr key={p.id}><td>{p.user.name}</td><td>{p.user.email}</td><td>{p.phone ?? "—"}</td><td className="r">{p.students.length}</td><td className="r">{tl(spent)}</td><td>{d(p.createdAt)}</td></tr>;
          })}
        </tbody>
      </table>
    );
  }

  return (
    <div className="oy-print">
      <style>{`
        .oy-print { font-family: -apple-system, Segoe UI, Roboto, sans-serif; color: #111; background: #fff; max-width: 900px; margin: 0 auto; padding: 32px; }
        .oy-print h1 { font-size: 20px; margin: 0 0 2px; }
        .oy-print .meta { color: #555; font-size: 12px; margin: 0 0 18px; }
        .oy-print .brand { color: #4648D4; font-weight: 800; font-size: 13px; letter-spacing: .3px; }
        .oy-print table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 8px; }
        .oy-print table.grid th, .oy-print table.grid td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
        .oy-print table.grid th { background: #f1f2fb; font-weight: 700; }
        .oy-print table.grid td.r, .oy-print table.grid th:nth-child(n) { }
        .oy-print td.r { text-align: right; white-space: nowrap; }
        .oy-print table.kv td { padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 14px; }
        .oy-print table.kv td:last-child { text-align: right; font-weight: 700; }
        .oy-print table.kv tr.hi td { background: #eef0ff; color: #4648D4; font-weight: 800; }
        .oy-print .foot { margin-top: 24px; color: #888; font-size: 11px; border-top: 1px solid #eee; padding-top: 10px; }
        #oy-print-btn { margin-top: 24px; background: #4648D4; color: #fff; border: 0; border-radius: 999px; padding: 10px 20px; font-weight: 700; cursor: pointer; font-size: 14px; }
        @page { size: A4; margin: 16mm; }
        @media print { .print-hide { display: none !important; } .oy-print { padding: 0; } }
      `}</style>

      <p className="brand">ÖĞRETMEN YANIMDA</p>
      <h1>{title}</h1>
      <p className="meta">Dönem: {rangeLabel[range] ?? "Tüm zamanlar"} · Oluşturma: {new Date().toLocaleString("tr-TR")}</p>

      {content}

      <p className="foot">Bu belge Öğretmen Yanımda yönetim paneli tarafından otomatik oluşturulmuştur.</p>
      <AutoPrint />
    </div>
  );
}
