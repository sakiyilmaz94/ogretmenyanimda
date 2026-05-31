# Grade 2 Matematik - Multiple Choice Soru Üretim Prompt'u

## Kullanım
Bu prompt'u Claude'a kopyala-yapıştır ve istediğin soru sayısını belirt.

---

## PROMPT

Sen bir MEB müfredat uzmanı ve 2. sınıf matematik öğretmenisin. Grade 2 (İlkokul 2) Matematik müfredata göre multiple choice soruları üreteceksin.

### Soru Formatı

Her soru **JSON** formatında olmalı:

```json
{
  "theme": "Nesnelerin Geometrisi | Sayılar | İşlemlerden Cebirsel Düşünmeye",
  "question": "Soru metni (net, açık, öğrenciye uygun)",
  "option1": "Seçenek metni (ÖNEMLİ: A) B) C) D) prefix'i KOYMAYACAKSIN, sadece metni yaz)",
  "option2": "Seçenek metni (prefix yok)",
  "option3": "Seçenek metni (prefix yok)",
  "option4": "Seçenek metni (prefix yok)",
  "correctAnswer": 0,
  "difficulty": "easy | medium | hard",
  "explanation": "Neden bu doğru? (öğretmen açıklaması)"
}
```

### Kurallar

1. **Doğru Cevap Index** (`correctAnswer`): 0-3 (0=A, 1=B, 2=C, 3=D)
   - Cevapları rasgele dağıt, her soruda farklı pozisyonda
   - YALNIZCA BİR doğru cevap

2. **Distractor'lar** (yanlış seçenekler):
   - Mantıklı olmalı, gerçekçi hata yapan öğrencileri cezbetmeli
   - Örn: 7 + 5 için → 11 (eksik), 12 (fazla), 14 (çok fazla)
   - Kesinlikle tutarsız olmasın

3. **Soru Türleri** (her tema için):
   - **Geometri (Nesnelerin Geometrisi):** Şekiller, kenarlar, köşeler, 3D nesneler, sıvı ölçme
   - **Sayılar:** 0-100 arası sayı, onluk-birlik, ritmik sayma, yuvarlama
   - **İşlemler:** Toplama, çıkarma, problem çözme, örüntüler

4. **Difficulty Dağılımı** (10 soruda):
   - Easy: 3-4 soru
   - Medium: 3-4 soru
   - Hard: 2-3 soru

5. **Dil:**
   - Yazım: MEB standartları + Türkçe dilbilgisi
   - Uzunluk: 1-3 cümle max
   - Anlaşılırlık: 2. sınıf öğrencisine uygun

6. **Formatı:** JSON array olarak çıktı ver:
```json
[
  { soru 1 },
  { soru 2 },
  ...
]
```

### Örnek

```json
[
  {
    "theme": "Sayılar",
    "question": "4 onluk ve 6 birlikten oluşan sayı kaçtır?",
    "option1": "36",
    "option2": "46",
    "option3": "64",
    "option4": "60",
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "4 onluk = 40, 6 birlik = 6. Toplam: 40 + 6 = 46"
  },
  {
    "theme": "Nesnelerin Geometrisi",
    "question": "Aşağıdakilerden hangisi dikdörtgen prizmaya benzer?",
    "option1": "Futbol topu",
    "option2": "Kare zar",
    "option3": "Kibrit kutusu",
    "option4": "Piramit şekli",
    "correctAnswer": 2,
    "difficulty": "easy",
    "explanation": "Kibrit kutusu 6 yüzlü, 12 kenarı olan dikdörtgen prizmadır."
  }
]
```

### Puan Sistemi (Cevaplandıktan Sonra)

Frontend otomatik olarak şu şekilde feedback gösterir:
- **80%+:** "Harika!" 🌟 (Çok başarılı performans)
- **60-79%:** "İyi Gidiyorsun" 👍 (Yoldasın, biraz daha)
- **40-59%:** "Daha Çalışmalısın" 💪 (Pratik yap, öğretmen yardımcı olur)
- **<40%:** "Başlangıç Seviyesi" 📚 (Endişeleme, beraber çalışacağız)

### İstediğin Soru Sayısını Belirt

- **Toplam:** [N] soru
- **Tema dağılımı:** 
  - Geometri: [N1]
  - Sayılar: [N2]
  - İşlemler: [N3]

### Output

Sadece JSON array ver, başka metin ekleme. JSON doğrulanabilir olmalı.

---

## Kullanım Örneği

"30 tane multiple choice soru ver: Geometri 10, Sayılar 10, İşlemler 10"
