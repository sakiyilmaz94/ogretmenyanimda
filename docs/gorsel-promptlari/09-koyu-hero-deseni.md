# 09 — Koyu İç-Sayfa Hero Deseni (tekrar kullanılır)

- **Hedef alan:** İç sayfaların koyu hero'ları — `bg-inverse-surface` kullanan **6 sayfa**:
  `egitmen-basvurusu`, `hizmetler`, `iletisim`, `sss`, `egitmenlerimiz`, `egitmenlerimiz/[id]`.
  *(Not: önce token düzeltmesi yapılınca bu hero'lar gerçekten koyu zemin olur — bu desen o koyu zeminin üstünde dekor olarak durur.)*
- **Çıktı dosyası:** `public/illustrations/koyu-hero-deseni.png`
- **Oran / boyut:** 16:9 geniş yatay, ~1920×1080, **şeffaf arka plan**.
- **ÖNEMLİ:** **Koyu lacivert (#1F2733 / #0B1C30) zemin** üzerinde duracak → **açık/ince çizgili, düşük opak** dekoratif desen kullan; doluluk az olsun ki üstündeki beyaz başlık metni okunur kalsın.
- **alt metni:** dekoratif olduğu için kodda `alt=""` (boş) verilir.

## Prompt (Nano 2 Pro — İngilizce)
```
Wide decorative flat vector pattern designed to sit on a dark navy (#1F2733) background. Light, thin line-art doodles related to education — books, pencils, graduation cap, lightbulb, speech bubbles, stars — scattered loosely with lots of empty space, low visual density. Use light strokes only: off-white #EEF1F7 and light lavender #E1E0FF at low opacity, with a few small mint #6CF8BB and peach #FFDDB8 accents. Elegant, calm, not busy. Transparent background. No text, no letters, no numbers, no watermark, not photorealistic, no 3D, no solid filled background.
```

## Negatifler / kaçın
`text, letters, numbers, watermark, solid background, high density, dark strokes, photorealistic, 3d`
