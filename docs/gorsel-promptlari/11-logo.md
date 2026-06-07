# 11 — Logo Tasarımı (Öğretmen Yanımda)

> Bu, marka logosu için tam bir brief + Nano 2 Pro prompt'larıdır. Ortak kurallar: [00-ORTAK-STIL-REHBERI.md](00-ORTAK-STIL-REHBERI.md).
> **Not (önemli):** AI görsel üreticileri çoğu zaman raster ve kusurlu logo üretir. Buradaki prompt'ları **konsept keşfi** için kullan; beğendiğin yönü seçince onu **temiz SVG**'ye dönüştürmek gerekir (istersen ben kodda SVG olarak yeniden çizerim). Logoda **metin (yazı) üretme** — yazıyı (wordmark) ayrı, net fontla ekleyeceğiz.

## Marka künyesi
- **İsim:** Öğretmen Yanımda
- **Ne yapar:** Türkiye'de ilkokul–ortaokul (K-12) öğrencileri için online birebir özel ders platformu.
- **Ton:** güvenilir, sıcak, samimi, profesyonel, çocuk dostu ama veliye güven veren.
- **İsmin anlamı (logo fikri için altın anahtar):** "Yanımda" = *yanı başımda / hep yanımda / bana yakın*. Bu yüzden logo, **"yakınlık / yanında olma / şefkatli destek"** hissini taşımalı.
- **Mevcut görsel dil:** yumuşak yuvarlatılmış formlar, "squishy" butonlar, Quicksand başlık fontu, aydınlık tema.

## Renk paleti (HEX — birebir kullan)
| Rol | Hex |
|-----|-----|
| Indigo (ana) | `#4648D4` |
| Açık lavanta | `#E1E0FF` |
| Zümrüt yeşil | `#00714D` |
| Parlak nane | `#6CF8BB` |
| Şeftali/amber | `#FFDDB8` |
| Kırık beyaz | `#F8F9FF` |
| Koyu lacivert (mürekkep) | `#0B1C30` |

## Konsept yönleri (önce A'yı öneririm)

**A) Konum pini + eğitim (ÖNERİLEN):**
"Yanımda" → harita **konum pini** formu; pinin iç negatif boşluğu bir **açık kitap** veya **mezuniyet kepi** oluşturur. "Eğitim hep yanında/yakında" mesajı. Modern, akılda kalıcı, app-icon'a çok uygun.

**B) Yan yana iki figür:**
Yuvarlak, sıcak iki form (öğretmen + öğrenci) yan yana — biri hafifçe diğerine yönelmiş (destek/şefkat). Soyut, dostane.

**C) Konuşma balonu + kitap/kalp:**
Bir konuşma/iletişim balonu içinde kitap ya da kalp — "ilgi + öğrenme".

**D) "Ö" monogramı:**
Yuvarlak bir "Ö" harfi; iki noktası göz/kıvılcım gibi, içinde ince bir kitap/kep detayı.

## Gerekli çıktılar (set olarak)
1. **İkon mark** (sembol) — kare, **şeffaf arka plan**, 1024×1024 → `public/logo-icon.png`
2. **Yatay kilit (lockup)** — ikon + "Öğretmen Yanımda" yazısı yan yana, şeffaf → `public/logo-lockup.png`
3. **Tek renk (monokrom)** sürüm — koyu lacivert tek renk, açık zeminde → `public/logo-mono.png`
4. **Favicon / app icon** — ikon mark'ın 512×512 sürümü → `app/icon.png`

> Wordmark için font: **Quicksand** (başlık fontumuz) — "Öğretmen" normal, "Yanımda" bold/indigo. Yazıyı AI'a değil, lockup'ı kodda/tasarımda birleştirirken ekleyelim.

## Prompt — Konsept A (İkon mark, Nano 2 Pro)
```
A modern flat vector logo icon (app icon, symbol only, NO text). Concept: a rounded map location pin whose inner negative space forms a friendly open book / graduation cap, symbolizing "education by your side". Geometric, clean, minimal, smooth rounded corners, balanced, memorable, scalable. Strict palette: indigo #4648D4 as the main shape, mint #6CF8BB and peach #FFDDB8 as small accents, off-white #F8F9FF highlights. Centered composition with even padding, flat design (no gradients heavier than a subtle two-tone), soft simple shapes. Plain transparent background. No text, no letters, no words, no watermark, not photorealistic, no 3D, no mockup, single clean icon.
```

## Prompt — Konsept B (alternatif)
```
A modern flat vector logo icon (symbol only, NO text). Concept: two soft rounded abstract figures sitting side by side — a teacher gently leaning toward a smaller student — forming one warm, friendly mark that conveys care and "being by your side". Minimal, geometric, smooth rounded shapes, memorable, scalable. Strict palette: indigo #4648D4 and emerald #00714D as the two figures, mint #6CF8BB / peach #FFDDB8 accents, off-white background highlights. Centered, balanced, flat design, transparent background. No text, no letters, no watermark, not photorealistic, no 3D, single clean icon.
```

## Negatifler / kaçın
`text, letters, words, typography, watermark, photorealistic, 3d render, mockup, business card, multiple variations in one image, gradients overload, drop shadows, realistic photo, clip-art clutter`

## Üretim ipuçları
- Her konsept için 4–6 varyasyon üret, **tek bir sembol** olanları seç (içinde yazı/çoklu örnek olmayan).
- Beğendiğin ikonu seçince: ya **temiz SVG'ye vektörle** (ben kodda yeniden çizebilirim) ya da yüksek çözünürlüklü şeffaf PNG bırak.
- App-icon testi: 32×32'ye küçültünce hâlâ tanınıyor mu? (pin/kitap silüeti net olmalı.)

## Hazır olunca
`public/logo-icon.png` + (varsa) lockup'ı ekle, bana haber ver → navbar/footer/dashboard/sidebar'daki mevcut jenerik ikon + favicon'u yeni logoyla değiştireyim (tüm yerlerde tutarlı). İstersen seçtiğin konsepti **SVG olarak** kodlayıp her boyutta net görünmesini sağlarım.
