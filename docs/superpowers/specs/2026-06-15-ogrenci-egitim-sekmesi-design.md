# Öğrenci-Merkezli "Eğitim" Sekmesi — Tasarım

**Tarih:** 2026-06-15
**Durum:** Onaylandı

## Problem

Bir öğrenciye ait eğitim verileri (seviye tespit sınavları, ders/eğitim geçmişi + raporlar, Google Meet bağlantıları, onaylanmış randevular) şu an **booking-merkezli** olarak dağılmış durumda. Bu kayıtlara çoğunlukla "Rezervasyonlar" ve "Ödeme" ekranları üzerinden ulaşılıyor; bu da hem veli hem öğretmen için karmaşık ve dolambaçlı.

İkinci bir eksik: kayıt listelerinde sıralama/filtreleme yok. Tarih, ödeme durumu, kayıt türü ve öğrenci/branş bazında düzenleme yapılamıyor.

## Hedef

Hem **veli** hem **öğretmen** paneline, **öğrenci-merkezli** tek bir "Eğitim" sekmesi eklemek. Bu sekmede her öğrencinin tüm eğitim verisi tek yerde toplanır. Ayrıca tüm kayıt listelerine yeniden kullanılabilir bir sıralama/filtreleme çubuğu eklenir.

## Onaylanan Kararlar

1. **Sekme yapısı:** Öğrenci kartı → detay sayfası (sekmeli/bölümlü tek ekran).
2. **Mevcut sayfalar:** "Rezervasyonlar" ve "Ödemeler" aynen kalır; "Eğitim" sekmesi bunlara EK olarak gelir (mevcut ödeme/onay akışı bozulmaz).
3. **Öğretmen test erişimi:** Öğretmen, kendisinden ders alan öğrencinin seviye testi sonuçlarını görebilir.
4. **Sıralama/filtreleme:** Dört boyut da kapsanır — tarihe göre sıralama, ödeme durumu filtresi, veri türü/durum filtresi, öğrenci/branş filtresi.

## Mimari

### Navigasyon

- **Veli menüsü** (`app/(dashboard)/parent/layout.tsx`): mevcut linkler korunur, yeni `{ href: "/parent/egitim", label: "Eğitim", icon: "egitim" }` eklenir.
- **Öğretmen menüsü** (`app/(dashboard)/educator/layout.tsx`): mevcut linkler korunur, yeni `{ href: "/educator/egitim", label: "Eğitim", icon: "egitim" }` eklenir.
- `components/layout/NavIcon.tsx`: yeni `egitim` ikonu (mezuniyet şapkası / açık kitap) eklenir.

### Erişim Kuralı (kimin hangi öğrenciyi gördüğü)

- **Veli:** kendi çocuklarının tümü (`parent.students`).
- **Öğretmen:** kendisinden **onaylanmış randevusu** olan öğrenciler — yani `Booking.status ∈ {CONFIRMED, COMPLETED}` olan farklı öğrenciler. PENDING/CANCELLED rezervasyonlar öğrenciyi listeye sokmaz. (BookingStatus enum: PENDING, CONFIRMED, CANCELLED, COMPLETED.)

### Eğitim Ana Ekranı — Öğrenci Kartları

`StudentEducationHub` bileşeni öğrenci kartlarını ızgara olarak gösterir. Her kart:

- Öğrenci adı + sınıf (GRADE_LABELS)
- Özet rozetler: tamamlanan/bekleyen seviye testi sayısı, ders sayısı, sonraki yaklaşan randevu tarihi
- Veli için: o öğrencide ödeme bekleyen ders varsa rozet
- Karta tıklayınca detay sayfasına gider

Üstte `RecordFilterBar` (öğrenci/branş filtresi, sıralama).

### Öğrenci Detay Sayfası — `…/egitim/[studentId]`

`StudentEducationDetail` bileşeni, üç bölümü sekmeli olarak sunar:

| Bölüm | İçerik | Veri kaynağı |
|---|---|---|
| **Randevular** | Onaylı yaklaşan + geçmiş dersler: tarih, saat, branş, durum, ödeme durumu, yaklaşan dersler için "Derse Katıl" (Google Meet) butonu | `Booking` + `slot` + `payment` + `meetingUrl` |
| **Seviye Testleri** | `LevelAssessment` kayıtları: branş, tarih, durum (PENDING/COMPLETED), sonuç görüntüleyici | `LevelAssessment` + `responses`, mevcut `AssessmentResultViewer` ile |
| **Eğitim Geçmişi** | Tamamlanan derslerin rapor detayları (konular, katılım, anlama, özgüven, hakimiyet, ödev, veli tavsiyesi) | `LessonReport` |

Meet bağlantıları ayrı bölüm değildir; "Randevular" bölümünde yaklaşan onaylı derslerde "Derse Katıl" butonu olarak görünür.

Her bölümün listesi `RecordFilterBar` ile sıralanabilir/filtrelenebilir.

### Sıralama & Filtreleme — `RecordFilterBar`

Tek, yeniden kullanılabilir istemci bileşeni. Props ile hangi filtrelerin görüneceği kontrol edilir:

- **Tarih sıralama:** en yeni → en eski / en eski → en yeni
- **Ödeme durumu:** Tümü / Ödendi / Bekliyor / İptal
- **Tür & durum:** kayıt türü (test, ders, rapor, randevu) ve durum (onaylı, bekleyen, tamamlanan)
- **Öğrenci / branş:** belirli öğrenci veya branş (Subject)

Filtreleme **istemci tarafında**, sunucudan zaten yüklenmiş veri üzerinde yapılır (listeler küçük; ekstra API çağrısı gerekmez). Bileşen filtrelenmiş/sıralanmış sonucu callback veya render-prop ile döner.

### Mevcut Sayfalara Entegrasyon

`RecordFilterBar` ayrıca şu mevcut listelere eklenir:

- `ParentBookingsView` (Rezervasyonlarım)
- Veli Ödemelerim listesi (`parent/payments`)
- `EducatorBookingsView` (Öğretmen Rezervasyonlar)

## Bileşen Sınırları

- **`RecordFilterBar`** — saf sunum + filtre durumu; veriyi tanımaz, sadece jenerik kayıt dizisi üzerinde sıralama/filtre uygular. Bağımsız test edilebilir.
- **`StudentEducationHub`** — öğrenci özet kartları; veriyi sayfadan (server component) alır, sadece gösterir.
- **`StudentEducationDetail`** — tek öğrencinin bölümlü detayı; `AssessmentResultViewer` ve rapor render mantığını yeniden kullanır.

## Veri Akışı

1. Server component (`page.tsx`) oturumdan rolü/kullanıcıyı alır, Prisma ile öğrenci + ilişkili booking/assessment/report verisini çeker.
2. Veri serileştirilebilir DTO'ya dönüştürülüp istemci bileşenine geçilir (Decimal → number, Date → ISO string).
3. İstemci bileşeni `RecordFilterBar` ile kullanıcının seçtiği sıralama/filtreyi uygular ve listeyi render eder.

## Hata Durumları

- Öğretmen/veli, kendine ait olmayan `studentId`'ye erişmeye çalışırsa `notFound()`.
- Öğrenci hiç randevu/test/rapora sahip değilse her bölümde boş-durum mesajı gösterilir.
- Meet linki henüz üretilmemiş yaklaşan ders için "Derse Katıl" yerine "Bağlantı ders saatine yakın aktifleşecek" bilgisi.

## Test Stratejisi

- `RecordFilterBar` filtre/sıralama mantığı için birim testleri (saf fonksiyon: girdi dizisi + filtre durumu → çıktı dizisi).
- Erişim kuralı testleri: öğretmen yalnızca CONFIRMED/COMPLETED öğrencileri görür; veli yalnızca kendi çocuklarını.
- Detay sayfası yetki testi: yabancı `studentId` → `notFound()`.

## Şema Değişikliği

**Yok.** Tüm gerekli veri mevcut modellerde var: `Booking` (slot, status, meetingUrl, payment), `LevelAssessment` (+ `AssessmentResponse`), `LessonReport`, `Student`.

## Kapsam Dışı

- Yeni ödeme/onay akışı değişikliği yok.
- Seviye testi oluşturma/atama akışında değişiklik yok (mevcut akış korunur).
- Sunucu tarafı sayfalama/arama (listeler küçük olduğu için istemci filtreleme yeterli).
