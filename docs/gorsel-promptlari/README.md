# Görsel Prompt Paketi — İndeks

Bu klasör, **Öğretmen Yanımda** için Nano 2 Pro'da üretilecek flat vektör illüstrasyonların prompt dosyalarıdır. Önce **[00-ORTAK-STIL-REHBERI.md](00-ORTAK-STIL-REHBERI.md)**'yi oku (tüm görseller için ortak marka kuralları).

## Nasıl kullanılır
1. İlgili prompt dosyasını aç, **Prompt (İngilizce)** bloğunu kopyala → Nano 2 Pro'ya yapıştır.
2. Üreteni indir, **"Çıktı dosyası"** kısmındaki adla **`public/illustrations/`** klasörüne koy.
3. Hepsi hazır olunca bana haber ver → JSX'e `next/image` ile bağlayıp `alt` metinlerini ekleyeyim.

> İpucu: 01'i ürettikten sonra sonraki promptlara "same flat vector style/palette as previous image" ekleyerek tutarlılığı artırabilirsin.

## Görsel listesi

| # | Dosya | Hedef alan | Çıktı (`public/illustrations/`) | Oran |
|---|-------|-----------|----------------------------------|------|
| 01 | [01-hero-ana-gorsel.md](01-hero-ana-gorsel.md) | Ana sayfa hero (`page.tsx:37`) | `hero-ana-gorsel.png` | 4:3 |
| 02 | [02-adim-ogretmen-bul.md](02-adim-ogretmen-bul.md) | 3 Adım · 1 (`page.tsx:185`) | `adim-ogretmen-bul.png` | 1:1 |
| 03 | [03-adim-randevu-ode.md](03-adim-randevu-ode.md) | 3 Adım · 2 | `adim-randevu-ode.png` | 1:1 |
| 04 | [04-adim-ders-al.md](04-adim-ders-al.md) | 3 Adım · 3 | `adim-ders-al.png` | 1:1 |
| 05 | [05-secenek-bireysel-dersler.md](05-secenek-bireysel-dersler.md) | Kişiye Özel · Bireysel (`page.tsx:240`) | `secenek-bireysel-dersler.png` | 1:1 |
| 06 | [06-secenek-veli-takip.md](06-secenek-veli-takip.md) | Kişiye Özel · Veli Takip | `secenek-veli-takip.png` | 1:1 |
| 07 | [07-secenek-ogrenci-koclugu.md](07-secenek-ogrenci-koclugu.md) | Kişiye Özel · Koçluk | `secenek-ogrenci-koclugu.png` | 1:1 |
| 08 | [08-cta-kayit.md](08-cta-kayit.md) | Alt CTA, indigo zemin (`page.tsx:514`) | `cta-kayit.png` | 16:9 |
| 09 | [09-koyu-hero-deseni.md](09-koyu-hero-deseni.md) | 6 koyu iç-sayfa hero'su | `koyu-hero-deseni.png` | 16:9 |
| 10 | [10-dersler-hero.md](10-dersler-hero.md) | Dersler hero (stock foto yerine) | `dersler-hero.png` | 16:9 |

**Toplam: 9 görsel.** (3 Adım ve Kişiye Özel setleri kendi içinde tutarlı üçlü olmalı.)

## Kapsam dışı bıraktıklarım (bilerek)
- **Trust bar** (Onaylı Öğretmenler / Şeffaf Fiyatlandırma / Veli Takip Raporu): zaten SVG ikon var, görsel üretmeye gerek yok — sadece emoji kullanılan yerler SVG'ye çevrilecek (kod işi).
- **"Uzman Kadromuzla Tanışın"**: burada **gerçek öğretmen** kartları olmalı (illüstrasyon değil); ileride öğretmen profil fotoğrafları (izinli) eklenebilir.

## Sonraki adımlar (görseller hazır olduğunda)
1. `public/illustrations/` altına 9 PNG yerleştir.
2. Bana haber ver → `next/image` ile bağlama + `alt` metinleri + responsive boyutlandırma.
3. Ardından **tema-token düzeltmesi** (raporun 1. maddesi) ile koyu hero'lar düzgün koyu render olur ve 09 deseni yerine oturur.
