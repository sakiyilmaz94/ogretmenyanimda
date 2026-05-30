# Grade 2 Müfredat Yükleme — Tasarım Spec

**Tarih:** 2026-05-30  
**Aşama:** Brainstorming → Spec  
**Görev:** 2. sınıf Türkçe + Matematik konularını Supabase'e yükle  

---

## 1. Problem Tanımı

Öğretmen Yanımda platformunda sınıf bazında (class-based) müfredat sistemi kurulmasına ihtiyaç var. İlk aşama olarak:

- **Grade 2 (2. sınıf)** için **Türkçe** ve **Matematik** konularını veritabanına ekle
- Grade 1 atla (seviye belirleme testi yok)
- **Kritik kısıt:** Aynı konusu başka sınıflarda tekrar edilirse asla karıştırma
  - Örnek: "Sayılar" 2. sınıfta, 3. sınıfta tekrar — **ayrı DB entries** olmalı, farklı difficulty

---

## 2. Teknik Gereksinimler

### 2.1 Database Schema
**Tablo:** `curriculum_topic`  
**Uniqueness Constraint:** `(gradeLevel, subject, topicName)` tuple

```prisma
model CurriculumTopic {
  id          String   @id @default(cuid())
  gradeLevel  Int      // 2 = 2. sınıf
  subject     String   // "TÜRKÇE" | "MATEMATIK"
  name        String   // Konu adı
  description String?  // Açıklama
  createdAt   DateTime @default(now())

  @@unique([gradeLevel, subject, name])
}
```

### 2.2 API Query Pattern
**Endpoint:** `GET /api/curriculum/topics?subject=TURKCE&gradeLevel=2`  
**Dual-filter mechanism:** WHERE clause hem subject hem gradeLevel'i kontrol eder  
**Amacı:** Cross-grade contamination'ı önle

**Critical code lokasyonu:**  
`app/api/curriculum/topics/route.ts:47-51`
```typescript
const topics = await db.curriculumTopic.findMany({
  where: {
    subject: dbSubject,
    gradeLevel: gradeLevelNum,  // ← Dual filter
  },
});
```

### 2.3 Parent Selection Flow
**Hiyerarşi:** Sınıf (Grade) → Ders (Subject) → Konu (Topic)

1. Parent, Grade 2'yi seçer
2. Sistem: "Hangi ders? TÜRKÇE / MATEMATIK"
3. Parent, TÜRKÇE seçer
4. Sistem: `GET /api/curriculum/topics?subject=TURKCE&gradeLevel=2` → Grade 2 Türkçe konuları listesini döndür
5. Parent konu seçer → Assessment başla

---

## 3. Veri Kaynağı

**Format:** PDF dosyaları (Türkçe ve Matematik müfredatı)  
**Kaynak:** Kullanıcı tarafından upload edilecek (yeni sekmede)

### Beklenen Yapı

#### Grade 2 Türkçe (TURKCE)
Örnek konular:
- Harf ve Ses Tanıma
- Basit Kelimeleri Okuma
- Ses ve Ritim
- Yazma Becerisi
- Anlama Becerisi
- vs...

#### Grade 2 Matematik (MATEMATIK)
Örnek konular:
- Sayılar (0-100)
- Toplama İşlemi
- Çıkarma İşlemi
- Paralar
- Geometri
- vs...

---

## 4. İşleme Adımları

### Adım 1: PDF Parsing (Yeni Sekmede)
- PDF'leri upload et → `/tmp/` ya da Cloud Storage
- Konu listesini extract et (manual ya da OCR)
- Yapılandırılmış format'a dönüştür (JSON/CSV)

### Adım 2: Data Validation
- Her konu için: gradeLevel, subject, name fields mevcut mi?
- Constraint kontrolü: Aynı (grade, subject, name) tuple'ı yoksa?
- Subject enum'ı doğru mu? (TURKCE / MATEMATIK)

### Adım 3: Database Insertion
```typescript
const topics = [
  { gradeLevel: 2, subject: "TÜRKÇE", name: "Harf ve Ses Tanıma" },
  { gradeLevel: 2, subject: "TÜRKÇE", name: "Basit Kelimeleri Okuma" },
  // ...
  { gradeLevel: 2, subject: "MATEMATIK", name: "Sayılar (0-100)" },
  // ...
];

await db.curriculumTopic.createMany({ data: topics });
```

### Adım 4: Verification
- `GET /api/curriculum/topics?subject=TURKCE&gradeLevel=2` → 8-12 konu dönmeli
- `GET /api/curriculum/topics?subject=MATEMATIK&gradeLevel=2` → 8-12 konu dönmeli
- Grade 3 konularını sor → Grade 2 konuları KARIŞMAMALI

---

## 5. Hata Yönetimi

**Kritik kura:** "Kesinlikle hata olmasın"

### Kontrol Noktaları
1. **Duplicate Check:** Aynı topic yeniden insert edilemez (constraint hatası → skip ve log)
2. **Loop Detection:** Eğer batch insert sonsuz döngüye girerse → durur ve error logla
3. **Transaction Safety:** Tüm konular birlikte insert ya da hepsi rollback (all-or-nothing)

### Error Scenarios
| Scenario | Handling |
|----------|----------|
| PDF parse başarısız | Dosya format'ı kontrol, manual extraction yaz |
| Duplicate topic | Veritabanında zaten var → warn, skip continue |
| Subject enum mismatch | Dönüştürülmüş subject'i kontrol, log at |
| Network timeout | Retry logic (3x), sonra fail |
| Constraint violation | Transaction rollback, hata detayı logla |

---

## 6. Success Criteria

✅ Grade 2 Türkçe konuları DB'de (8+ entries)  
✅ Grade 2 Matematik konuları DB'de (8+ entries)  
✅ Uniqueness constraint enforced  
✅ API dual-filter çalışıyor (grade + subject)  
✅ Parent selection flow: Grade → Subject → Topic hiyerarşisi bozulmadı  
✅ Grade 3 konuları (eğer varsa) Grade 2 konuları ile karışmadı  
✅ Assessment soru üretimi: Sadece seçilen topic'i test ediyor (Claude API)  
✅ Sıfır hata, sıfır loop

---

## 7. Sonraki Etaplar (Future)

- Grade 3-8 konularını aynı pattern'le yükle
- Öğretmen tarafından topic-specific ders notları eklemesi
- Assessment question bank optimize'i (Claude cache)
- Curriculum updates workflow (admin panel)
