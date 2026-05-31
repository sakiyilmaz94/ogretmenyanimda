#!/usr/bin/env python3
import fitz  # PyMuPDF
import json
import re
import os

def extract_text_from_pdf(pdf_path):
    """PDF'i text olarak oku"""
    try:
        doc = fitz.open(pdf_path)
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text
    except Exception as e:
        print(f"❌ PDF okuma hatası: {e}")
        return None

def find_units(text):
    """Tema/Üniteleri tespit et"""
    # "TEMA 1", "Tema 1", "1. TEMA" vb.
    pattern = r'(?:TEMA|Tema|tema)\s*(\d+)|(\d+)\.\s*(?:TEMA|Tema|tema)'
    matches = list(re.finditer(pattern, text, re.IGNORECASE))
    return matches

def extract_exam_section(text, start_idx, end_idx):
    """Sınav bölümünü extract et"""
    unit_text = text[start_idx:end_idx]

    # Sınav bölümünü bul
    exam_pattern = r'(?:Sınav|SINAV|Değerlendirme|DEĞERLENDİRME|Test|TEST|Çalışma Sayfası)[\s\S]*?(?=(?:Ünite|ÜNITE|Unite|UNITE)|\d+\.\s+Sınıf|$)'
    exam_match = re.search(exam_pattern, unit_text, re.IGNORECASE)

    if exam_match:
        return exam_match.group(0)
    return None

def parse_questions(exam_text):
    """Soruları parse et (max 10)"""
    questions = []

    # Soru pattern: "1.", "2.", vb.
    question_pattern = r'(\d+)\.\s*(.+?)(?=\d+\.\s|\Z)'

    for match in re.finditer(question_pattern, exam_text, re.IGNORECASE | re.DOTALL):
        if len(questions) >= 10:
            break

        question_num = int(match.group(1))
        question_text = match.group(2).strip()

        # Şık parsing (A/B/C/D)
        option_pattern = r'([A-D])\)\s*(.+?)(?=[A-D]\)|$)'
        options = []

        for opt_match in re.finditer(option_pattern, question_text, re.IGNORECASE | re.DOTALL):
            letter = opt_match.group(1)
            option_text = opt_match.group(2).strip().split('\n')[0]
            options.append(option_text)

        # Sadece 4 şık olan soruları al
        if len(options) == 4:
            # Soru metni (A/B/C/D öncesi)
            q_text = re.split(r'[A-D]\)', question_text)[0].strip()

            # Zorluk tahmini (basit rule)
            difficulty = "easy" if len(q_text) < 50 else ("hard" if len(q_text) > 100 else "medium")

            questions.append({
                "question": q_text,
                "options": options,
                "correctAnswer": -1,  # Manual review gerekli
                "difficulty": difficulty
            })

    return questions[:10]  # Max 10

def extract_grade2_math(pdf_path, kitap_number):
    """2. Sınıf Matematik soruları çıkar"""
    print(f"\n📖 {os.path.basename(pdf_path)} okunuyor...")

    text = extract_text_from_pdf(pdf_path)
    if not text:
        return []

    print(f"   ✅ PDF okuma başarılı ({len(text)} karakter)")

    units = find_units(text)
    print(f"   📚 Bulunan ünite: {len(units)}")

    results = []

    for i, match in enumerate(units):
        # Group 1 veya 2'deki sayıyı al
        unit_num = int(match.group(1) or match.group(2))
        start_idx = match.start()
        end_idx = units[i+1].start() if i+1 < len(units) else len(text)

        # Sınav bölümünü bul
        exam_text = extract_exam_section(text, start_idx, end_idx)

        if not exam_text:
            print(f"   ⊘ Ünite {unit_num}: Sınav bulunamadı")
            continue

        # Soruları parse et
        questions = parse_questions(exam_text)

        if len(questions) == 0:
            print(f"   ⊘ Ünite {unit_num}: Soru parse edilemedi")
            continue

        results.append({
            "unitNumber": unit_num,
            "kitapNumber": kitap_number,
            "questions": questions
        })

        print(f"   ✓ Ünite {unit_num}: {len(questions)} soru")

    return results

def main():
    print("🚀 2. Sınıf Matematik Soruları Extraction")
    print("=" * 50)

    pdf_files = [
        {
            "path": "Eğitim Kitaplık/ders kitapları/2. Sınıf Matematik Ders Kitabı 1. Kitap .pdf",
            "kitap": 1
        },
        {
            "path": "Eğitim Kitaplık/ders kitapları/2. Sınıf Matematik Ders Kitabı 2. Kitap .pdf",
            "kitap": 2
        }
    ]

    all_units = []

    for file_info in pdf_files:
        pdf_path = file_info["path"]

        if not os.path.exists(pdf_path):
            print(f"\n❌ Dosya bulunamadı: {pdf_path}")
            continue

        units = extract_grade2_math(pdf_path, file_info["kitap"])
        all_units.extend(units)

    # JSON'a kaydet
    output_path = "grade2-math-questions.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(all_units, f, ensure_ascii=False, indent=2)

    print("\n" + "=" * 50)
    print(f"✅ Extraction tamamlandı!")
    print(f"   Toplam ünite: {len(all_units)}")
    print(f"   JSON kaydedildi: {output_path}")
    print("\n⚠️  ÖNEMLİ: JSON dosyasını açıp doğru cevapları (@correctAnswer) kontrol edin!")

if __name__ == "__main__":
    main()
