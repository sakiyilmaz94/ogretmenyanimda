# Tasarım: Kapsamlı Yönetici (Admin) Paneli

**Tarih:** 2026-06-12 · **Durum:** Onaylandı, fazlara bölünerek uygulanacak

## Amaç
Admin'in tek yerden: tüm öğretmenlerin ve velilerin verisine erişmesi, öğretmenleri
(ders saat ücreti dahil) tam düzenlemesi, gelir-gider/finansa hâkim olması; her şey
ayrı sekmelerde, filtrelenebilir, sade; resmi kurum talepleri için PDF indirilebilir.

## Onaylanan kararlar
- **Panel erişimi:** Salt-okunur detay sayfası (impersonate yok). Admin, bir öğretmenin/
  velinin her şeyini tek sayfada görür.
- **Finans modeli:** Komisyon. Veli ödemesi = GELİR. Platform %komisyon alır (net kazanç);
  kalan = öğretmene payout (GİDER). Komisyon oranı **Ayarlar'dan düzenlenebilir, varsayılan %20**.
- **PDF:** finans/gelir-gider raporu, ödeme-işlem dökümü, öğretmen listesi+kazançları, öğrenci/veli listesi.
- **İlerleme:** Fazlara bölünür; her faz ayrı yapılır, test edilir, onay alınır.

## Mevcut durum (özet)
Var: Öğretmenler(+[id] detay: rezervasyonlar & tahsil edilen), Ders Programları, Ders Onayları,
Rezervasyonlar, Ödemeler(+toplam), Öğrenciler, Raporlar(metrik+groupBy), Fiyatlandırma, Ayarlar.
Yok: öğretmen tam düzenleme (ücret), veli (parent) bölümü, gider/komisyon/payout modeli, PDF.

## Komisyon hesabı (referans)
- Bir ödeme (PAID) için: `gelir = payment.amount`, `net = amount * komisyon%`, `payout = amount - net`.
- Toplamlar PAID ödemeler üzerinden hesaplanır. Komisyon oranı tek kaynak: Ayarlar.

---

## FAZLAR

### Faz 1 — Öğretmen tam yönetimi
- `admin/educators/[id]`: salt-okunur "panel" görünümü (rezervasyonlar, ders programı özeti,
  öğrencileri, kazanç/payout özeti) + **düzenleme formu**: hourlyRate, subjects, gradeLevels,
  bio, status, isProfilePublic.
- Yeni API `PATCH /api/admin/educators/[id]` (admin-only) bu alanları günceller.
- `admin/educators` liste: arama/filtre (durum, branş) + ücret kolonu.

### Faz 2 — Veliler sekmesi
- Yeni nav "Veliler" → `admin/parents`: veli listesi (ad, e-posta, telefon, çocuk sayısı,
  toplam harcama), filtre/arama.
- `admin/parents/[id]`: salt-okunur veli detayı (çocuklar, rezervasyonlar, ödemeler).

### Faz 3 — Finans / Gelir-Gider
- Yeni nav "Finans" → `admin/finans`: tarih aralığı + öğretmen filtresi; kartlar
  (toplam gelir, komisyon/net, öğretmen payout/gider), işlem tablosu, öğretmen bazında payout özeti.
- Komisyon oranı Ayarlar'da saklanır (Setting/Config); finans bunu kullanır.

### Faz 4 — PDF dışa aktarım
- Seçili tablolarda "PDF indir": finans raporu, ödeme dökümü, öğretmen+kazanç, öğrenci/veli.
- Yöntem: sunucu tarafı PDF (ör. @react-pdf/renderer veya basit HTML→PDF). Tarih/filtre PDF'e yansır.

## Genel kurallar
- Mevcut renk sistemi/Tailwind/tasarım dili korunur. Auth/middleware'e dokunulmaz (admin-only kontroller eklenir).
- Türkçe. Her fazdan sonra `npm run build` + Playwright kontrolü + commit/push + onay.
- Sade ve filtrelenebilir; mevcut bileşen desenleri (FilterBar vb.) yeniden kullanılır.
