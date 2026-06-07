# 00 — Ortak Stil Rehberi (TÜM görseller için)

> Bu dosya, `docs/gorsel-promptlari/` altındaki **her prompt dosyasının** uyması gereken ortak marka/stil kurallarıdır. Nano 2 Pro'da üretirken her prompt zaten bu kuralları içeriyor; bu dosya referans/özet içindir.

## Marka kimliği
- **Ürün:** Öğretmen Yanımda — Türkiye'de ilkokul & ortaokul (K-12) öğrencileri için online özel ders platformu.
- **Ton:** güvenilir, sıcak, samimi, profesyonel ama oyuncu. Çocuk dostu ama veliye güven veren.
- **Görsel dil:** **flat vektör editorial illüstrasyon** — yumuşak yuvarlatılmış formlar, hafif gradyanlar, ince tutarlı çizgi, yumuşak gölgeler.

## Renk paleti (HEX — prompt'larda birebir kullan)
| Rol | Hex |
|-----|-----|
| Indigo (ana) | `#4648D4` |
| Açık lavanta | `#E1E0FF` |
| Zümrüt yeşil | `#00714D` |
| Parlak nane yeşili | `#6CF8BB` |
| Şeftali/amber | `#FFDDB8` |
| Koyu amber | `#7C3800` |
| Kırık beyaz (zemin) | `#F8F9FF` |
| Koyu lacivert (mürekkep) | `#0B1C30` |

## Değişmez kurallar (her görselde)
- **Yazı YOK** (illüstrasyonun içinde hiçbir metin/harf/rakam olmasın — başlıkları sayfa zaten veriyor).
- **Watermark / imza YOK.**
- Arka plan: aksi belirtilmedikçe **şeffaf (transparent PNG)**.
- Tutarlı çizgi kalınlığı ve gölge dili — tüm set aynı aileden görünmeli.
- Çeşitlilik: farklı saç/ten tonları, gözlüklü/başörtülü dahil kapsayıcı ama abartısız; Türkiye bağlamı.
- Klişeden kaçın: stok-foto hissi yok, aşırı detay yok, 3B fotogerçekçilik yok.
- Telif: gerçek marka logoları/karakterleri kullanma; özgün illüstrasyon.

## Teknik çıktı
- Format: **PNG, şeffaf arka plan** (CTA ve koyu-hero görselleri hariç — onlarda not var).
- Çözünürlük: en az **2x** (örn. 1600×1200) ki retina'da net olsun.
- Üretilen dosyayı şu klasöre koy: **`public/illustrations/<dosya-adı>.png`**
- Her prompt dosyasındaki **"Çıktı dosyası"** adını birebir kullan (kodla bağlarken o ad bekleniyor).

## Nano 2 Pro ipucu
- Tutarlılık için: ilk görseli ürettikten sonra, sonraki promptlara "**same flat vector style, same palette and line weight as the previous image**" cümlesini ekleyebilirsin.
- 16:9, 1:1, 4:3 gibi oranlar her prompt dosyasında belirtildi.

---
İlgili dosyalar: `01..09` numaralı prompt dosyaları · indeks: [README.md](README.md)
