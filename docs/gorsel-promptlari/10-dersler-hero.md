# 10 — Dersler Sayfası Hero Görseli (stock foto yerine)

- **Hedef alan:** `app/dersler/page.tsx` hero bölümü — şu an `bg-[url('/hero.png')]` **stock fotoğraf** + koyu overlay kullanıyor. Bu görsel, diğer illüstrasyonlarla aynı dilde **flat vektör** ile değiştirilecek (sayfa aydınlık temaya çevrilecek).
- **Çıktı dosyası:** `public/illustrations/dersler-hero.png`
- **Oran / boyut:** 16:9 yatay, ~1600×900, **şeffaf arka plan**.
- **Yerleşim:** Aydınlık hero'da, başlığın yanında (sağda) veya altında ortalı.
- **alt metni (kodda):** `"Farklı derslerden seçim yapan öğrenci"`

## Prompt (Nano 2 Pro — İngilizce)
```
Flat vector editorial illustration, friendly and warm, of a happy Turkish primary-school student standing among floating subject symbols — an open book, mathematics numbers, a science beaker, a world map/globe, a paint brush and a music note — choosing what to learn. Cheerful, curious mood. Soft rounded shapes, gentle gradients, consistent thin line weight, soft long shadows. Color palette strictly: indigo #4648D4, light lavender #E1E0FF, emerald green #00714D, mint #6CF8BB, peach #FFDDB8, off-white #F8F9FF, navy ink #0B1C30. Light and airy, suitable for a LIGHT background (do not use dark backgrounds). Generous negative space. Transparent background. No text, no letters, no numbers, no watermark, not photorealistic, no 3D render.
```

## Negatifler / kaçın
`text, letters, numbers, watermark, photorealistic, 3d render, dark background, harsh shadows, cluttered, neon colors`

> Not: Görseli ürettikten sonra `public/illustrations/dersler-hero.png` olarak ekle. Dersler hero'sunu bu görselle **aydınlık** hale getireceğim (stock foto + koyu overlay kaldırılacak).
