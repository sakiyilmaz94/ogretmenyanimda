# Tasarım: Ünite/Tema + Kapsadığı Konular ile Sınav Seçimi

**Tarih:** 2026-06-09
**Durum:** Onaylandı (kullanıcı: açık kartlar + temiz replace)

## Sorun / Amaç

Veli rezervasyon sihirbazında ders konusu seçerken yalnızca ünite/tema adını
görüyor. Yeni hazırlanan `sinavlar/uniteler.json` + sınıf soru dosyaları her
ünite/tema için **kapsadığı konuları** (alt başlıklar) içeriyor. Veli, bir
ünite/tema seçerken bu konuları da görebilmeli ki neyi seçtiğini anlasın. Seçtiği
ünite/temaya göre **doğru sınav** (o ünitenin soruları) yönlendirilmeli.

## Veri Kaynağı (girdi)

- `sinavlar/uniteler.json` — ana eşleme:
  - `siniflar[].sinif`, `.soruDosyasi`, `.gruplamaAlani` ("tema" | "unit"), `.toplamSoru`
  - `.dersler[].ders` (TR etiket), `.uniteler[].ad`, `.soruSayisi`, `.konular[]`
- `sinavlar/<N sınıf matematik>` — her sınıfın TÜM derslerini içeren soru dizisi.
  Her soru: `grade, subject, tema|unit, question, option1..4, correctAnswer, difficulty, explanation`.
  Gruplama alanı (tema/unit) değerleri `uniteler.json`'daki `ad` ile **birebir eşleşiyor** (doğrulandı).

Kapsam: Matematik (2-8), Fen Bilimleri (3-8), Sosyal Bilgiler (4-7),
T.C. İnkılap Tarihi (8). **Türkçe değişmez** (ayrı docx kaynağından, zaten yüklü).

## Ders etiketi → Prisma Subject enum

| uniteler.json `ders` | enum |
|---|---|
| Matematik | MATEMATIK |
| Fen Bilimleri | FEN_BILIMLERI |
| Sosyal Bilgiler | SOSYAL_BILGILER |
| T.C. İnkılap Tarihi ve Atatürkçülük | INKILAP_TARIHI |

## Veri Modeli (mevcut şema, değişiklik yok)

- `CurriculumTopic` = bir ünite/tema. Alanlar kullanımı:
  - `name` = ünite `ad`
  - `learningObjects String[]` = **kapsadığı konular** (`konular`)
  - `unit` = ünite `ad` (referans)
- `LevelAssessmentQuestion.topicId` → CurriculumTopic (her soru ait olduğu üniteye bağlı).
- FK güvenliği: `Booking.topicId` ve `LevelAssessment.topicId` `onDelete: SetNull`;
  `LevelAssessmentQuestion.topicId` `onDelete: Cascade`. Bu yüzden konu silmek güvenli:
  eski rezervasyon/sınav `topicId`'leri null olur, sınav route'u zaten fallback yapıyor.

## Çözüm

### 1. Seed pipeline — `scripts/seed-from-uniteler.js`
- 4 ders (MATEMATIK, FEN_BILIMLERI, SOSYAL_BILGILER, INKILAP_TARIHI) için tüm
  mevcut `CurriculumTopic` kayıtlarını sil (cascade ile sorular da gider). Türkçe'ye dokunma.
- `uniteler.json`'dan her sınıf/ders/ünite için CurriculumTopic oluştur
  (`name=ad`, `learningObjects=konular`, `unit=ad`).
- Her sınıf soru dosyasını oku; her soruyu `subject` + gruplama değeri (`ad`) ile
  ilgili topic'e bağlayıp LevelAssessmentQuestion ekle.
- Eşleşmeyen gruplama değeri / bilinmeyen subject → uyarı logla + say.
- Sonunda sınıf/ders bazında konu ve soru sayılarını raporla.

### 2. API — `app/api/curriculum/topics/route.ts`
- `learningObjects` ve soru sayısı (`_count.questions`) de dön.
- Mevcut `questions: { some: {} }` filtresi kalır (boş ünite gizli).

### 3. UI — `components/dashboard/TopicSelector.tsx` (açık kart tasarımı)
- Dikey kart listesi (mobil 1, masaüstü 2 sütun). Her kart:
  - Ünite adı (kalın) + "N soru" rozeti
  - Kapsadığı konular: madde/etiket listesi (her zaman görünür)
  - Seçili durumda vurgulu kenarlık/arka plan
- Tıklayınca `onSelect(id, name)`.
- Yükleniyor / boş / hata durumları korunur.

### 4. Sınav yönlendirme
- Zaten `fetchAssessmentQuestions(grade, subject, topicId)` ile çalışıyor.
- Yeni veride her ünitenin ~10 sorusu topicId ile bağlı → seçilen üniteye göre doğru
  10 soru gelir. Değişiklik gerekmez, sadece doğrulanır.

## Test / Doğrulama
1. Seed çıktısı: her sınıf/ders için beklenen ünite ve soru sayısı.
2. DB kontrol: örnek (grade 2 MATEMATIK = 6 tema × ~10 soru; learningObjects dolu).
3. API: birkaç grade/subject için topics → name + learningObjects + soru sayısı.
4. Sınav: bir üniteye bağlı assessment GET → tam 10 soru, doğru üniteden.
5. `npm run build` temiz.

## Kapsam Dışı (YAGNI)
- Konuların ayrı ayrı seçilebilmesi (sadece bilgi amaçlı gösterilir).
- Türkçe verisinin yeniden yüklenmesi.
- Şema değişikliği (mevcut alanlar yetiyor).
