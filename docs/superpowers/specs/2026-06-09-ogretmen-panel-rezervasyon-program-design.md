# Tasarım: Öğretmen Paneli — Rezervasyon Düzeni + Ders Programı

**Tarih:** 2026-06-09 · **Durum:** Onaylandı

## 1. Rezervasyonlar (yeniden düzen)
Mevcut: tüm durumlar alt alta yığılı, filtre/sıralama yok.

Yeni — üst sekmeli + filtreli (client component `EducatorBookingsView`):
- **Sekmeler** (üstte, sayaçlı): Onay Bekleyen · Ödeme Bekleniyor · Kesinleşti · İptal.
- **Sıralama** (dropdown): Ders tarihi (kronolojik) · Öğrenci A-Z · Talep tarihi (yeni→eski).
- **Gün filtresi** (çip): Tümü · Pzt · Sal · Çar · Per · Cum · Cmt · Paz (slot gününe göre).
- Her sekme kendi kart düzenini gösterir; eylemler duruma göre (onay aksiyonları,
  seviye testi sonucu, Meet linki, ders raporu).
- Sayfa `force-dynamic` kalır; server veriyi çekip serialize eder, client UI filtreler.

## 2. Ders Programı (YENİ sayfa: /educator/ders-programi)
Client component `EducatorSchedule`. Nav'a "Ders Programı" eklenir (yeni `schedule` ikonu).

- **Görünüm**: Haftalık (varsayılan) / Aylık geçişi.
- **Haftalık**: klasik okul programı — sütunlar 7 gün (Pzt→Paz), satırlar ders saatleri
  (görünen derslerin başlangıç saatleri). Hücrede o gün+saatteki ders(ler): öğrenci + ders.
  Hafta ileri/geri gezinme + hafta aralığı başlığı.
- **Aylık**: ay takvimi (Pzt başlangıçlı), her gün hücresinde o günün dersleri (kompakt).
  Ay ileri/geri gezinme.
- **Kapsam**: varsayılan onaylı dersler (CONFIRMED + COMPLETED). "Onay bekleyenleri göster"
  anahtarı açılınca PENDING dersler **soluk renkte** eklenir.
- **Filtreler**: Öğrenci (dropdown: Tümü + öğrenciler). Renk kodu: onaylı=primary,
  kesinleşti=secondary, bekleyen=soluk/kesikli.
- Server sayfa bookings'i (slot + student) çeker, serialize eder.

## 3. Kaynaklarım
Nav'dan kaldırılır (sayfa dosyası durur, ileride tekrar eklenir).

## Veri (serialize edilmiş ortak şekil)
`{ id, status, studentName, parentName, gradeLevel, subject, date, startTime, endTime,
notes, totalPrice, meetingUrl, hasReport, assessment{id,status,responseCount}|null, createdAt }`

## Test
- Build temiz.
- Öğretmen olarak (Playwright): Rezervasyonlar sekmeleri + sıralama/gün filtresi çalışıyor;
  Ders Programı haftalık/aylık + öğrenci filtresi + bekleyen toggle çalışıyor; Kaynaklarım nav'da yok.
