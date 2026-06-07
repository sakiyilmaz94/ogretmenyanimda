# UI/UX Tarama Raporu — Uyumsuzluklar & Görsel Önerileri

> Hazırlayan: UI/UX Pro Max skill + kod taraması · Tarih: 2026-06-07
> Kapsam: `app/`, `components/` · Tema: Material Design 3 türevi, **açık tema**, indigo (#4648d4) + yeşil (#00714d) + amber aksanlar.

---

## 0. Özet (TL;DR)

İki ana sorun kümesi var:

1. **Tanımsız tema tokenları (KÖK NEDEN).** Tasarım, tam bir Material Design 3 token setiyle (ör. `inverse-surface`, `inverse-on-surface`, `primary-container`, `on-primary-fixed-variant`) yazılmış; ama `globals.css` + `tailwind.config.ts` bu setin yalnızca bir **alt kümesini** tanımlamış. Tanımsız token → Tailwind hiç CSS üretmiyor → o öğe "kırık" render oluyor. **"Koyu alanda koyu metin"** ve **"soluk/boş görünen koyu bölümler"** şikâyetinin teknik kaynağı budur.
2. **Görsel boşluğu.** Tüm projede `public/` içinde **tek görsel** var (`hero.png`) ve hiç `next/image` kullanılmıyor. Birçok bölüm metin + emoji ile dolduruldu; "büyük boşluklar" bunlar.

---

## 1. Kontrast & Tutarsızlık Bulguları

### 1.1 🔴 KRİTİK — Tanımsız tema tokenları (kök neden)

`tailwind.config.ts` ve `globals.css`'de **tanımlı olmayan** ama kodda kullanılan tokenlar:

| Token | Kullanım sayısı | Beklenen (M3) | Şu anki sonuç |
|-------|----------------:|---------------|----------------|
| `text-inverse-on-surface` | 30 | açık/beyaz metin | renk üretilmiyor → koyu miras alır |
| `bg-inverse-surface` | 11 | **koyu** zemin (~#1e2733) | zemin üretilmiyor → şeffaf/açık |
| `text-on-primary-fixed-variant` | 21 | orta-koyu mor | renk yok → miras |
| `bg/text-primary-container` | 5 | açık lavanta zemin | zemin yok → şeffaf |
| `bg-secondary-fixed` | 2 | açık yeşil | üretilmiyor (blob görünmez) |
| `bg-surface-container-high` | 1 | açık gri-mavi | üretilmiyor |
| `text-on-surface`, `text-outline`, `text-error`, `bg-error` | birkaç | — | üretilmiyor |

**Neden önemli:** `bg-inverse-surface` koyu olması gereken hero bölümleri (aşağıda) **şeffaf** kalıyor; sayfa arka planı (#f8f9ff açık) görünüyor. Üstüne konan `text-inverse-on-surface` (açık olması gereken) renk üretmediği için koyu metni miras alıyor → tasarım "soluk" görünüyor.

**Etkilenen koyu-hero bölümleri** (hepsi `bg-inverse-surface`):
- `app/egitmen-basvurusu/page.tsx:21`
- `app/egitmenlerimiz/page.tsx:63` ve `app/egitmenlerimiz/[id]/page.tsx:60`
- `app/hizmetler/page.tsx:21`
- `app/iletisim/page.tsx:73`
- `app/sss/page.tsx:70`

### 1.2 🔴 KRİTİK — Onaylanmış "koyu metin / koyu zemin" örneği

**Yer:** `app/page.tsx` — *"Nasıl Ücretlendirilir?"* fiyatlandırma bölümü (`bg-primary` #4648d4 indigo zemin), **vurgulu kart** (satır ~413-445).

Kart zemini `bg-on-primary-fixed` = **#07006c (çok koyu mor)**, ama içindeki metinler:
- Başlık: `text-on-background` = **#0b1c30 (çok koyu lacivert)** → koyu/koyu = **görünmez**
- Adım etiketi & açıklama: `text-on-surface-variant` = **#464554 (koyu gri)** → düşük kontrast

Bu kart açık zemin için tasarlanmış (koyu metinler), ama koyu zemin token'ı verilmiş → klasik dark-on-dark. Aynı bölümün diğer kartları `bg-primary-container` (tanımsız→şeffaf→indigo) üstüne `text-on-primary` (beyaz) ile **tesadüfen** çalışıyor; bu da kırılgan.

### 1.3 🟡 ORTA — Emoji'lerin ikon olarak kullanımı

`app/page.tsx` ve birkaç panelde emoji'ler ikon olarak kullanılıyor (ör. trust-bar `{stat.icon}` 🎒/📋/💳, `text-3xl` emoji). UI/UX Pro Max kuralı `no-emoji-icons`: emojiler platforma göre farklı render olur, profesyonel durmaz. **Heroicons/Lucide SVG** ile değiştirilmeli (zaten projede çoğu yerde SVG var — tutarlılık için her yerde SVG).

### 1.4 🟢 SORUN DEĞİL (doğrulandı)

`bg-on-background/55` ve `bg-on-background/40` kullanımları — bunlar `hero.png` üstünde **koyu overlay** ve modal arka planı; üzerine beyaz (`text-on-primary`) metin geliyor. Doğru ve erişilebilir. (`app/dersler/page.tsx:46`, `StudentManager.tsx:94` vb.)

### Önerilen düzeltme (kök neden, ~15 satır)

`globals.css` `:root` içine eksik M3 tokenlarını ekleyip `tailwind.config.ts`'e map'lemek tüm 1.1 + 1.2 sorununu tek seferde çözer:

```css
/* globals.css :root içine eklenecek (M3 açık tema değerleri) */
--color-inverse-surface:           #1f2733; /* koyu zemin */
--color-inverse-on-surface:        #eef1f7; /* açık metin */
--color-on-primary-fixed-variant:  #3a3aa0;
--color-primary-container:         #e1e0ff;
--color-on-primary-container:      #07006c;
--color-secondary-fixed:           #6cf8bb;
--color-surface-container-high:    #dce6f7;
--color-surface:                   #f8f9ff;
--color-on-surface:                #0b1c30;
--color-outline:                   #76748b;
--color-error:                     #ba1a1a;
```
+ `tailwind.config.ts` `colors` bloğuna karşılık gelen `"inverse-surface": "var(--color-inverse-surface)"` vb. satırlar.

**Ayrıca 1.2 kartı:** vurgulu kartın zemini `bg-on-primary-fixed` yerine `bg-surface-container-lowest` (beyaz) yapılırsa, mevcut koyu metinler (on-background / on-surface-variant) doğru kontrastla görünür.

---

## 2. Görsel Boşlukları (image gaps)

**Mevcut durum:** `public/` = sadece `hero.png`; `next/image` kullanımı = 0. `hero.png` birkaç iç sayfada `bg-[url('/hero.png')]` olarak tekrar kullanılıyor.

| Bölüm (dosya) | Şu an | Görsel fırsatı |
|---------------|-------|----------------|
| Ana sayfa **hero** (`page.tsx:37`) | Sadece metin + blur "blob"; sağ taraf boş | Sağ/merkeze **ana görsel** (öğretmen-öğrenci illüstrasyonu veya cihaz mockup'ı) |
| **3 Adımda Ders Al** (`:185`) | Köşede `opacity-40` dev rakam + SVG | Her adıma küçük spot illüstrasyon |
| **Kişiye Özel Eğitim** (`:240`) | Metin kartları | Ders/sınıf temalı görsel şerit |
| **Uzman Kadromuzla Tanışın** (`:323`) | Avatar yer tutucu | Gerçek/temsili öğretmen görselleri (izinli) |
| **Fiyatlandırma** (`:363`) | Emoji/SVG | Güven veren küçük 3B/illüstrasyon ikonlar |
| Koyu hero'lar (1.1) | Soluk/şeffaf | Token düzeldikten sonra koyu zemine **soft illüstrasyon/desen** |

---

## 3. Görsel Tarzı Önerileri (asıl talep)

### Değerlendirme kriterleri
Hedef kitle: **ilkokul/ortaokul velileri + öğrencileri (K-12), Türkiye**. Marka tonu: *güvenilir, sıcak, samimi, profesyonel*. Mevcut tema: yumuşak indigo+yeşil, `Quicksand` başlık fontu, "squishy" butonlar, blob'lar, 16-24px yuvarlatmalar → **dostane & oyuncu ama ciddi**.

### Seçeneklerin karşılaştırması

| Tarz | Uyum | Artı | Eksi / Risk |
|------|:----:|------|-------------|
| **Flat vektör illüstrasyon** (Humaaans/Open Peeps/Storyset tarzı) | ⭐⭐⭐⭐⭐ | Markaya birebir uyar; renk paletine boyanabilir; hafif (SVG); telifsiz kaynak bol; KVKK-güvenli (gerçek çocuk fotoğrafı yok) | Özgünlük için biraz özelleştirme gerekir |
| **3B "claymorphism" / yumuşak 3B ikon** (3D characters) | ⭐⭐⭐⭐ | "Squishy" butonlar + yuvarlak dille çok uyumlu; modern, premium | Dosya boyutu büyür; üretimi maliyetli |
| **Stok fotoğraf (gerçek çocuk/öğretmen)** | ⭐⭐ | Gerçeklik/güven | **KVKK + telif riski yüksek** (reşit olmayan birey görüntüsü, izin); tutarlı stil yakalamak zor; klişe stok hissi |
| **Ghibli tarzı** (sulu boya, sıcak, doğa) | ⭐⭐⭐ | Sıcak/duygusal; ebeveyne "şefkat" hissi | Eğitim-teknoloji platformunda fazla sinematik/nostaljik; tutarlı üretim zor; telif/üslup taklidi hassasiyeti |
| **Pixar tarzı** (parlak 3B karakter) | ⭐⭐⭐ | Çocuklara çekici, neşeli | "Ciddi/güvenilir veli" tonundan uzaklaşabilir; ağır; üslup taklidi hassasiyeti |
| **Lottie/SVG mikro-animasyon** | ⭐⭐⭐⭐ | Hero ve adımlarda canlılık; çok hafif | İçeriği değil, hareketi sağlar — illüstrasyonla birlikte kullanılmalı |

### ✅ Önerim: **Flat vektör illüstrasyon (ana dil) + seçici yumuşak 3B ikonlar + Lottie mikro-animasyon**

**Gerekçe:**
- Mevcut tasarım dili (yumuşak indigo/yeşil, yuvarlak, blob'lar, Quicksand) **flat illüstrasyonla** birebir örtüşüyor; markayı bozmadan boşlukları doldurur.
- SVG olduğu için **performans + erişilebilirlik** kazançlı (skill `image-optimization` kuralı), retina'da net.
- **KVKK/telif açısından en güvenli yol**: gerçek çocuk fotoğrafı kullanımı Türkiye'de açık rıza ve velayet izni gerektirir; illüstrasyon bu riski tamamen ortadan kaldırır.
- Ghibli/Pixar "tarzı" üretimler hem üslup-taklidi açısından hassas hem de "güvenilir veli platformu" tonundan uzak; tek tük **hero**'da sıcaklık için ilham alınabilir ama ana dil olmamalı.

**Uygulama önerileri:**
- **Kaynaklar (telifsiz/ücretsiz, ticari kullanım):** Storyset (by Freepik — renk özelleştirilebilir), unDraw (tek renk → `#4648d4`'e boyanır), Humaaans, Open Peeps, Lottiefiles (animasyon), icons: Heroicons/Lucide (emoji yerine).
- **Tutarlılık kuralı:** Tek illüstrasyon ailesi seç, hepsini marka paletine (indigo+yeşil+amber) boya, çizgi kalınlığı/gölge dilini sabit tut.
- **Teknik:** SVG'leri inline veya `next/image` ile; foto kullanılırsa **WebP + `srcset` + lazy-load** (skill `image-optimization`), tüm görsellere **anlamlı `alt`** (skill `alt-text`), `prefers-reduced-motion` ile Lottie'yi durdur.
- **AI ile üretim istenirse prompt yönü:** "flat vector editorial illustration, friendly Turkish primary-school teacher and student, soft rounded shapes, indigo #4648d4 + emerald #00714d palette, minimal, white background, no text" — tutarlı set için aynı stil cümlesini sabit tut.

### Bölüm-bazlı görsel yerleşimi (öneri)
1. **Hero:** sağda öğretmen+öğrenci flat illüstrasyon (veya hafif Lottie); arka blob'lar korunur.
2. **3 Adımda Ders Al:** her adıma tek-renk spot illüstrasyon (ara, seç, öğren).
3. **Kişiye Özel Eğitim:** ders temalı küçük illüstrasyon ikon seti (emoji yerine).
4. **Koyu hero'lar (token düzeldikten sonra):** koyu zemine düşük-opaklık çizgi-desen/illüstrasyon.

---

## 4. Önerilen iş sırası

1. **(Kök neden) Eksik tema tokenlarını tanımla** → 1.1 + 1.2'deki tüm kırık koyu bölümler/dark-on-dark tek hamlede düzelir. *(düşük risk, ~15 satır)*
2. **Fiyatlandırma vurgulu kartını** açık zemine çevir (veya metinleri açık token'a). 
3. **Emoji ikonları SVG'ye** taşı (tutarlılık).
4. **Görsel dili** kararını uygula: flat illüstrasyon seti + Lottie; `next/image` + WebP + alt.

> Not: Bu rapor yalnızca **tespit + öneridir**; kod değişikliği yapılmadı. Onayınla 1–2. maddeleri (token + kontrast düzeltmesi) hemen uygulayabilirim.
