# Veli Paneli İyileştirme — Tasarım

Tarih: 20 Kasım 2026 · Durum: öneri, onay bekliyor

## Bağlam
- Ders satışı henüz kapalı ("yakında" modu açık). Kayıt olan veliler (18 Kasım'da 5 kişi) paneli boş buluyor.
- Trafik %70+ mobil. Veliler Instagram'dan geliyor.
- Veli şikâyeti: oyunlar/kaynaklar sitede yok → artık `/oyunlar` ve `/kaynaklar` var ama panelden ulaşılmıyor.
- Sahip kararları: sayaç kartları kalsın; "Yeni ders al" / "Öğretmen bul" kalsın; rezervasyon sistemi
  deneme/test için **kapatılmayacak**.

## Mevcut durum (kodda doğrulandı)
Menü: Ana Sayfa · Çocuklarım · Ders Al · Rezervasyonlarım · Eğitim · Ödemelerim · Hesabım

| Sayfa | İçerik |
|---|---|
| Ana Sayfa | 4 sayaç, hızlı işlemler (Yeni ders al / Öğrenci ekle / Öğretmen bul), Çocuklarım, Yaklaşan Dersler |
| Çocuklarım | çocuk ekle/düzenle |
| Ders Al | rezervasyon sihirbazı (öğretmen → saat) |
| Rezervasyonlarım | ders listesi, ödeme durumu, Meet linki, ders raporu |
| Eğitim | çocuk başına seviye testleri, ders geçmişi, sonraki ders |
| Ödemelerim | ödeme geçmişi |
| Hesabım | ad, telefon, bildirim tercihleri |

## Sorunlar
1. **Menü adları belirsiz.** "Eğitim" neyi ifade ediyor belli değil (içinde test sonuçları ve ders geçmişi var).
   "Ders Al" / "Rezervasyonlarım" / "Yeni Rezervasyon" aynı şey için üç farklı sözcük.
2. **Ücretsiz içeriklere (Kaynaklar, Oyunlar) panelden ulaşılmıyor.**
3. **Yönlendirme yok.** Yeni veli ilk girişte ne yapacağını bilmiyor.
4. **Sayfa alt başlıkları açıklayıcı değil** ("Tüm ders rezervasyonlarınız" gibi).
5. **İade bilgisi yok.** Veli paneli ders iptalinde iadenin nereye yapılacağını bilmiyor.
   Ödeme artık IBAN/havale ile; iade de IBAN'a yapılacak. `Payment.status = REFUNDED` var ama iade akışı yok.
6. **Sitedeki metinler eski ödeme modelini anlatıyor.** SSS: "iade kart hesabınıza yansıtılır 3–5 iş günü",
   anasayfa SSS: "Ödemeler iyzico ile… kart bilgileriniz saklanmaz". Gerçekte ödeme IBAN + admin onaylı.
   Veliye çelişkili bilgi veriyor.

## Öneri

### A. Menü (sıra ve adlar)
Ana Sayfa · Çocuklarım · Ders Al · **Derslerim** (eski Rezervasyonlarım) · Ödemelerim ·
**Gelişim Takibi** (eski Eğitim) · **Kaynaklar & Oyunlar** · Hesabım

- Her sayfanın altına tek cümlelik, ne işe yaradığını anlatan açıklama.
- "Kaynaklar & Oyunlar" ayrı bir sayfa yerine hızlı bağlantı olarak `/kaynaklar` ve `/oyunlar`'a gider.

### B. Ana Sayfa
- Sayaçlar kalır (karar).
- "Yeni ders al" / "Öğretmen bul" kalır (karar). Yanlarına **Ücretsiz Kaynaklar** ve **Eğitim Oyunları** kartları eklenir.
- **Başlangıç rehberi** kartı (çocuk yoksa veya hiç ders yoksa görünür): 1) Çocuğunu ekle → 2) Öğretmen ve saat seç →
  3) Ödemeyi yap ve ders kesinleşsin. Her adım ilgili sayfaya bağlanır, tamamlanan adım işaretlenir.
- Ders satışı kapalıyken en üstte "Dersler çok yakında" bandı (Admin → Ayarlar'daki satış anahtarına bağlı).

### C. Hesabım → İade Bilgileri
- Yeni kart: **IBAN** + **Hesap sahibinin adı soyadı**. Zorunlu değil, veli sonradan ekleyebilir/değiştirebilir.
- Alanın altında: *"Olası bir ders iptalinde ücret iadesi için gereklidir."* + KVKK cümlesi (yalnızca iade için kullanılır).
- Doğrulama: `TR` + 24 hane, IBAN mod-97 sağlama; boşluklar temizlenir; kayıtlıysa maskeli gösterilir (`TR12 •••• •••• 1234`), "Değiştir" ile güncellenir.
- Veritabanı: `Parent.iban String?`, `Parent.ibanHolderName String?`.
- Admin: Veli detayında ve iptal edilen/ödenmiş derste iade için IBAN görünür. (Aşama 2: "İade edildi" işaretleme + veliye e-posta.)
- Güvenlik: yalnızca ilgili veli ve admin okuyabilir; API'de rol kontrolü; log'a yazılmaz.

### D. Rezervasyon (karar: kapatılmaz)
Test için rezervasyon çalışmaya devam eder. Açık soru: gerçek veliler satış kapalıyken rezervasyon yapabilsin mi?
Seçenek: veli bazında "test hesabı" işareti (Admin → Veli detayı); işaretsiz veliler `/parent/book`'ta "çok yakında" mesajı görür.

### E. Site metinleri (tutarlılık)
SSS, ana sayfa SSS, fiyatlandırma ve iptal/iade sayfalarındaki "kart / iyzico / kartınıza iade" ifadeleri
IBAN/havale modeline göre düzeltilir. İade süresi için gerçekçi bir ifade (sahip belirler).

## Kapsam dışı (satış açılınca)
Ödeme ekranı iyileştirmeleri, ders geçmişi/rapor ekranı yeniden tasarımı, iptal talebi akışı (veli tarafından),
gerçek kullanım verisiyle yapılacak her şey.

## Doğrulama
- Tip kontrol + lint; yeni veli hesabıyla (telefon ekranı genişliğinde) her sayfayı gezme.
- IBAN: geçerli/geçersiz/boş/değiştirme/silme senaryoları; başka velinin IBAN'ına erişilemediği.
