export interface Question {
  question: string;
  options: [string, string, string, string];
  correct: number; // 0-3
}

type QuestionBank = Record<string, Question[]>;

// ─────────────────────────────────────────────
// MEB MÜFREDAti — Sınıf bazlı soru bankası
// Her sınıf için o yılın kazanımlarına özgü sorular
// ─────────────────────────────────────────────

const questions: QuestionBank = {

  // ══════════════════════════════════════════
  // MATEMATİK
  // ══════════════════════════════════════════

  // 1. Sınıf: Sayılar 1–20, toplama/çıkarma, şekil tanıma
  "MATEMATIK_ILKOKUL_1": [
    { question: "7 + 5 kaç eder?", options: ["11", "12", "13", "10"], correct: 1 },
    { question: "15 - 8 kaç eder?", options: ["6", "7", "8", "9"], correct: 1 },
    { question: "Aşağıdakilerden hangisi en büyük sayıdır?", options: ["14", "9", "17", "11"], correct: 2 },
    { question: "6 + ☐ = 10 ise ☐ kaçtır?", options: ["3", "4", "5", "6"], correct: 1 },
    { question: "Hangi şeklin 3 köşesi vardır?", options: ["Kare", "Daire", "Üçgen", "Dikdörtgen"], correct: 2 },
    { question: "9 sayısından 1 fazlası kaçtır?", options: ["8", "10", "11", "7"], correct: 1 },
    { question: "3 + 3 + 3 kaç eder?", options: ["6", "9", "12", "7"], correct: 1 },
    { question: "20 sayısı hangi iki sayının toplamıdır?", options: ["8+10", "9+10", "10+10", "7+10"], correct: 2 },
    { question: "Hangi sayı 12 ile 15 arasındadır?", options: ["11", "13", "16", "17"], correct: 1 },
    { question: "5 elma var, 2 tanesi yenildi. Kaç elma kaldı?", options: ["2", "3", "4", "7"], correct: 1 },
  ],

  // 2. Sınıf: 3 basamaklı sayılar, çarpma kavramı, uzunluk ölçme
  "MATEMATIK_ILKOKUL_2": [
    { question: "345 sayısında '4' rakamı hangi basamaktadır?", options: ["Birler", "Onlar", "Yüzler", "Binler"], correct: 1 },
    { question: "37 + 48 kaç eder?", options: ["75", "85", "84", "76"], correct: 1 },
    { question: "4 × 3 kaç eder?", options: ["7", "12", "11", "9"], correct: 1 },
    { question: "82 - 35 kaç eder?", options: ["47", "57", "43", "37"], correct: 0 },
    { question: "Hangi sayı 5'in 4 katıdır?", options: ["9", "15", "20", "25"], correct: 2 },
    { question: "1 m kaç cm'dir?", options: ["10 cm", "100 cm", "1000 cm", "50 cm"], correct: 1 },
    { question: "245 sayısında yüzler basamağındaki rakam kaçtır?", options: ["2", "4", "5", "24"], correct: 0 },
    { question: "2 × 6 kaç eder?", options: ["8", "10", "12", "14"], correct: 2 },
    { question: "Hangisi çift sayıdır?", options: ["13", "17", "22", "25"], correct: 2 },
    { question: "Bir haftada kaç gün vardır?", options: ["5", "6", "7", "8"], correct: 2 },
  ],

  // 3. Sınıf: Çarpım tablosu, bölme, basit kesirler, alan/çevre
  "MATEMATIK_ILKOKUL_3": [
    { question: "7 × 8 kaç eder?", options: ["54", "56", "64", "49"], correct: 1 },
    { question: "48 ÷ 6 kaç eder?", options: ["6", "7", "8", "9"], correct: 2 },
    { question: "1/2 ile 1/4 kesirleri karşılaştırıldığında hangisi büyüktür?", options: ["1/4", "1/2", "Eşittir", "Bilinemez"], correct: 1 },
    { question: "9 × 9 kaç eder?", options: ["72", "81", "90", "63"], correct: 1 },
    { question: "63 ÷ 7 kaç eder?", options: ["7", "8", "9", "6"], correct: 2 },
    { question: "Kenar uzunluğu 5 cm olan bir karenin çevresi kaç cm'dir?", options: ["10", "15", "20", "25"], correct: 2 },
    { question: "12'nin yarısı kaçtır?", options: ["4", "5", "6", "8"], correct: 2 },
    { question: "5 × 6 kaç eder?", options: ["25", "30", "35", "11"], correct: 1 },
    { question: "Bir günde kaç saat vardır?", options: ["12", "20", "24", "48"], correct: 2 },
    { question: "36 ÷ 4 kaç eder?", options: ["7", "8", "9", "6"], correct: 2 },
  ],

  // 4. Sınıf: Büyük sayılar, dört işlem, kesirler, ondalık sayı tanıma
  "MATEMATIK_ILKOKUL_4": [
    { question: "4.526 sayısında binler basamağındaki rakam kaçtır?", options: ["4", "5", "2", "6"], correct: 0 },
    { question: "3/4 ile 1/4 toplandığında sonuç kaçtır?", options: ["2/4", "3/8", "4/4", "1"], correct: 3 },
    { question: "256 × 4 kaç eder?", options: ["824", "1.024", "1.024", "924"], correct: 1 },
    { question: "0,5 ondalık sayısı kesir olarak nedir?", options: ["1/4", "1/2", "3/4", "1/5"], correct: 1 },
    { question: "Hangisi en büyük kesirdir?", options: ["1/3", "1/6", "1/2", "1/4"], correct: 2 },
    { question: "Bir dikdörtgenin uzun kenarı 8 cm, kısa kenarı 5 cm ise çevresi kaç cm'dir?", options: ["13", "26", "40", "24"], correct: 1 },
    { question: "5.000 + 300 + 40 + 7 = ?", options: ["5.347", "5.437", "5.374", "5.473"], correct: 0 },
    { question: "2/5 ile 3/5 toplandığında sonuç kaçtır?", options: ["5/10", "5/5", "6/10", "1/1"], correct: 1 },
    { question: "720 ÷ 8 kaç eder?", options: ["80", "90", "70", "85"], correct: 1 },
    { question: "Kenar uzunluğu 6 cm olan bir karenin alanı kaç cm²'dir?", options: ["24", "12", "36", "48"], correct: 2 },
  ],

  // 5. Sınıf: Tam sayılar, kesir işlemleri, oran, çokgenler
  "MATEMATIK_ORTAOKUL_5": [
    { question: "(-5) + 3 kaç eder?", options: ["-2", "2", "-8", "8"], correct: 0 },
    { question: "3/4 × 2/3 kaç eder?", options: ["6/7", "1/2", "5/7", "6/12"], correct: 1 },
    { question: "2,4 sayısının 10 katı kaçtır?", options: ["0,24", "240", "24", "2400"], correct: 2 },
    { question: "3 : 4 oranında bulunan 2 sayıdan büyük olanı 12 ise küçük olanı kaçtır?", options: ["6", "8", "9", "16"], correct: 2 },
    { question: "(-3) - (-7) kaç eder?", options: ["-10", "4", "-4", "10"], correct: 1 },
    { question: "Bir üçgenin iç açıları toplamı kaç derecedir?", options: ["90°", "180°", "270°", "360°"], correct: 1 },
    { question: "5/6 - 1/3 kaç eder?", options: ["4/6", "1/2", "4/3", "3/6"], correct: 1 },
    { question: "%50 olan 80 sayısının kaçta kaçı nedir?", options: ["20", "30", "40", "50"], correct: 2 },
    { question: "Beşgen kaç köşeye sahiptir?", options: ["4", "5", "6", "8"], correct: 1 },
    { question: "(-4) × (-3) kaç eder?", options: ["-12", "7", "12", "-7"], correct: 2 },
  ],

  // 6. Sınıf: Tam sayı işlemleri, oran-orantı, yüzdeler, denklem temeli
  "MATEMATIK_ORTAOKUL_6": [
    { question: "3/4 = x/20 denkleminde x kaçtır?", options: ["12", "15", "16", "5"], correct: 1 },
    { question: "(-8) × 5 kaç eder?", options: ["40", "-40", "3", "-3"], correct: 1 },
    { question: "2x + 6 = 14 denkleminde x kaçtır?", options: ["3", "4", "5", "10"], correct: 1 },
    { question: "%25 indirim yapılan 120 TL'lik ürünün indirimli fiyatı kaçtır?", options: ["30 TL", "80 TL", "90 TL", "95 TL"], correct: 2 },
    { question: "4 : 6 oranı ile aşağıdakilerden hangisi denktir?", options: ["2:4", "6:9", "8:10", "3:6"], correct: 1 },
    { question: "(-12) ÷ (-4) kaç eder?", options: ["-3", "3", "-8", "8"], correct: 1 },
    { question: "Koordinat düzleminde (3, -2) noktası hangi bölgededir?", options: ["I. Bölge", "II. Bölge", "III. Bölge", "IV. Bölge"], correct: 3 },
    { question: "150'nin %40'ı kaçtır?", options: ["40", "50", "60", "75"], correct: 2 },
    { question: "Bir sayının 3/5'i 12 ise sayı kaçtır?", options: ["15", "18", "20", "24"], correct: 2 },
    { question: "(-5)² kaç eder?", options: ["-25", "25", "-10", "10"], correct: 1 },
  ],

  // 7. Sınıf: Rasyonel sayılar, üslü ifadeler, denklemler, üçgenler, istatistik
  "MATEMATIK_ORTAOKUL_7": [
    { question: "(-2/3) + (1/4) kaç eder?", options: ["-5/12", "5/12", "-1/12", "1/12"], correct: 0 },
    { question: "2³ × 2² kaç eder?", options: ["2⁵", "4⁵", "2⁶", "4⁶"], correct: 0 },
    { question: "3x - 5 = 10 denkleminde x kaçtır?", options: ["3", "4", "5", "6"], correct: 2 },
    { question: "Bir üçgende iki açı 60° ve 80° ise üçüncü açı kaç derecedir?", options: ["30°", "40°", "50°", "60°"], correct: 1 },
    { question: "5, 8, 3, 7, 7 sayı dizisinin modu kaçtır?", options: ["5", "6", "7", "8"], correct: 2 },
    { question: "3x + 7 = 2x + 12 denkleminde x kaçtır?", options: ["3", "4", "5", "6"], correct: 2 },
    { question: "(-3/4) × (-8/9) kaç eder?", options: ["-2/3", "2/3", "-24/36", "1/3"], correct: 1 },
    { question: "5 sayısının kübü kaçtır?", options: ["15", "25", "100", "125"], correct: 3 },
    { question: "5, 8, 3, 7, 2 sayı dizisinin ortalaması kaçtır?", options: ["4", "5", "6", "7"], correct: 1 },
    { question: "İki komşu açının toplamı 180° ise bu açılar nasıl adlandırılır?", options: ["Tümler açı", "Bütünler açı", "Dikey açı", "Karşılıklı açı"], correct: 1 },
  ],

  // 8. Sınıf: Çarpanlara ayırma, denklem sistemleri, Pisagor, olasılık, LGS hazırlık
  "MATEMATIK_ORTAOKUL_8": [
    { question: "x² - 9 ifadesi çarpanlarına ayrılırsa sonuç nedir?", options: ["(x-3)(x+3)", "(x-3)²", "(x+3)²", "(x-9)(x+1)"], correct: 0 },
    { question: "3x + 2y = 12 ve x = 2 ise y kaçtır?", options: ["2", "3", "4", "5"], correct: 1 },
    { question: "Dik üçgende dik kenarlar 3 ve 4 cm ise hipotenüs kaç cm'dir?", options: ["5", "6", "7", "√7"], correct: 0 },
    { question: "Bir paranın atılmasında 'yazı' gelme olasılığı nedir?", options: ["1/4", "1/3", "1/2", "2/3"], correct: 2 },
    { question: "a² + 2ab + b² = ?", options: ["(a-b)²", "(a+b)²", "a²+b²", "(a+b)(a-b)"], correct: 1 },
    { question: "2x - y = 5 ve x + y = 4 denklem sistemini sağlayan x değeri kaçtır?", options: ["2", "3", "4", "5"], correct: 1 },
    { question: "Bir zarın atılmasında çift sayı gelme olasılığı nedir?", options: ["1/6", "1/3", "1/2", "2/3"], correct: 2 },
    { question: "√(3² + 4²) kaç eder?", options: ["3", "4", "5", "7"], correct: 2 },
    { question: "x² - 5x + 6 = 0 denkleminin kökleri hangileridir?", options: ["2 ve 3", "1 ve 6", "2 ve -3", "-2 ve -3"], correct: 0 },
    { question: "Bir torba içinde 3 kırmızı, 2 mavi top var. Rastgele çekilen topun kırmızı olma olasılığı nedir?", options: ["2/5", "3/5", "1/5", "3/2"], correct: 1 },
  ],

  // ══════════════════════════════════════════
  // TÜRKÇE
  // ══════════════════════════════════════════

  // 1. Sınıf: Harf/hece tanıma, basit kelimeler, cümle sonu işareti
  "TURKCE_ILKOKUL_1": [
    { question: "'Araba' kelimesinde kaç harf vardır?", options: ["4", "5", "6", "3"], correct: 1 },
    { question: "Hangisi bir hayvan ismidir?", options: ["Elma", "Masa", "Kedi", "Kalem"], correct: 2 },
    { question: "Cümlenin sonuna hangi işaret konur?", options: ["Virgül ,", "Nokta .", "İki nokta :", "Tire -"], correct: 1 },
    { question: "'Top' kelimesi kaç heceden oluşur?", options: ["1", "2", "3", "4"], correct: 0 },
    { question: "Hangisi büyük harfle başlamalıdır?", options: ["masa", "kalem", "ankara", "kitap"], correct: 2 },
    { question: "'Anne' kelimesinde kaç sesli harf vardır?", options: ["1", "2", "3", "4"], correct: 1 },
    { question: "Hangisi bir meyve değildir?", options: ["Elma", "Armut", "Havuç", "Kiraz"], correct: 2 },
    { question: "'Okul' kelimesini hecelerine ayırırsak hangisi doğrudur?", options: ["ok-ul", "o-kul", "oku-l", "ok-u-l"], correct: 1 },
    { question: "Bir cümlede 'kim?' sorusunun cevabı ne olur?", options: ["Nesne", "Özne", "Yüklem", "Tümleç"], correct: 1 },
    { question: "'Kar yağıyor.' cümlesinde kaç kelime vardır?", options: ["1", "2", "3", "4"], correct: 1 },
  ],

  // 2. Sınıf: Hece, eş/zıt anlam, büyük harf, paragraf anlama
  "TURKCE_ILKOKUL_2": [
    { question: "'Mutlu' kelimesinin zıt anlamlısı hangisidir?", options: ["Sevinçli", "Neşeli", "Mutsuz", "Huzurlu"], correct: 2 },
    { question: "'Güzel' kelimesinin eş anlamlısı hangisidir?", options: ["Çirkin", "Hoş", "Kötü", "Büyük"], correct: 1 },
    { question: "'Arkadaş' kelimesi kaç heceden oluşur?", options: ["2", "3", "4", "5"], correct: 1 },
    { question: "Özel isimler nasıl yazılır?", options: ["Küçük harfle", "Büyük harfle başlanarak", "Tamamen büyük harfle", "Çizgi ile"], correct: 1 },
    { question: "'Kitap' kelimesinin çoğulu hangisidir?", options: ["Kitaplar", "Kitapı", "Kitaplar", "Kitapes"], correct: 0 },
    { question: "Hangisi bir renk değildir?", options: ["Kırmızı", "Büyük", "Mavi", "Sarı"], correct: 1 },
    { question: "'Hızlı' kelimesinin zıt anlamlısı hangisidir?", options: ["Koşan", "Yavaş", "Güçlü", "Hızlanan"], correct: 1 },
    { question: "Soru cümlesinin sonuna hangi işaret konur?", options: ["Nokta .", "Virgül ,", "Soru işareti ?", "Ünlem !"], correct: 2 },
    { question: "Aşağıdaki cümlelerden hangisinde büyük harf yanlış kullanılmıştır?", options: ["Ali okula gitti.", "Türkiye güzel bir ülkedir.", "bugün hava güzel.", "Ankara başkentimizdir."], correct: 2 },
    { question: "'Sıcak' kelimesinin zıt anlamlısı hangisidir?", options: ["Soğuk", "Ilık", "Nemli", "Kuru"], correct: 0 },
  ],

  // 3. Sınıf: Sözcük türleri (isim/fiil), çoğul eki, metin anlama, noktalama
  "TURKCE_ILKOKUL_3": [
    { question: "'Koşmak' kelimesi hangi sözcük türündedir?", options: ["İsim", "Sıfat", "Fiil", "Zamir"], correct: 2 },
    { question: "'Evler' kelimesindeki '-ler' eki ne işlevi görür?", options: ["Küçültme", "Çoğul yapma", "Soru", "Olumsuzluk"], correct: 1 },
    { question: "Noktalı virgül (;) nerede kullanılır?", options: ["Cümle sonunda", "Sıralı cümleleri birbirinden ayırmada", "Soru cümlelerinde", "Ünlem cümlelerinde"], correct: 1 },
    { question: "'Güzel çiçek' ifadesinde 'güzel' hangi sözcük türündedir?", options: ["İsim", "Fiil", "Sıfat", "Zarf"], correct: 2 },
    { question: "Hangisi isim değildir?", options: ["Masa", "Kalem", "Koşmak", "Elma"], correct: 2 },
    { question: "'Ben, sen, o' kelimeleri hangi sözcük türüdür?", options: ["İsim", "Sıfat", "Zamir", "Fiil"], correct: 2 },
    { question: "Bir metnin konusu nedir?", options: ["Metnin yazarı", "Metnin ne hakkında olduğu", "Metnin kaç sayfadan oluştuğu", "Metnin sonucu"], correct: 1 },
    { question: "Ünlem işareti (!) hangi cümlelerin sonuna konur?", options: ["Soru cümleleri", "Haber cümleleri", "Emir ve ünlem cümleleri", "Tüm cümlelerin"], correct: 2 },
    { question: "'Çiçek' kelimesine '-ler' eki getirilirse hangisi olur?", options: ["Çiçekler", "Çiçeklar", "Çiçekler", "Çiçeklar"], correct: 0 },
    { question: "Hangisi eylem (fiil) bildiren kelimedir?", options: ["Hızlı", "Araba", "Yemek yemek", "Güzel"], correct: 2 },
  ],

  // 4. Sınıf: Sözcük türleri, deyimler, metin türleri
  "TURKCE_ILKOKUL_4": [
    { question: "'Hızlı koştu.' cümlesinde 'hızlı' hangi sözcük türündedir?", options: ["Sıfat", "Zarf", "İsim", "Zamir"], correct: 1 },
    { question: "'Kulağına küpe olmak' deyimi ne anlama gelir?", options: ["Küpe takmak", "Ders almak, ibret almak", "Duymamak", "Dikkatli olmak"], correct: 1 },
    { question: "Hikâye türünün temel özelliği nedir?", options: ["Gerçek olayları belgeler", "Olay örgüsü, kişi, mekân, zaman unsurları içerir", "Bilgi verir", "Şiir gibi uyaklıdır"], correct: 1 },
    { question: "'O, kitabı okudu.' cümlesinde 'O' hangi sözcük türündedir?", options: ["İsim", "Sıfat", "Zamir", "Fiil"], correct: 2 },
    { question: "'Gözden düşmek' deyiminin anlamı nedir?", options: ["Gözü kaybetmek", "İtibar kaybetmek", "Düşmek", "Göz ağrımak"], correct: 1 },
    { question: "Bir şiirde her satıra ne denir?", options: ["Paragraf", "Dize", "Bölüm", "Kıta"], correct: 1 },
    { question: "'Güzel araba' ifadesinde 'güzel' hangi görevi üstlenmiştir?", options: ["İsim tamlaması", "Sıfat tamlaması", "Zarf tümleci", "Özne"], correct: 1 },
    { question: "Hangisi bir atasözüdür?", options: ["Gözden ırak olan gönülden de ırak olur", "El ele tutuşmak", "Dağ başını duman almış", "Ağlayarak gezmek"], correct: 0 },
    { question: "Masal türünün temel özelliği nedir?", options: ["Gerçek kişileri anlatır", "Olağanüstü olaylar ve kişiler içerir", "Bilimsel bilgi verir", "Seyahat anılarını aktarır"], correct: 1 },
    { question: "'Çok çalışan başarıya ulaşır.' cümlesinin yüklemi hangisidir?", options: ["Çok çalışan", "başarıya", "ulaşır", "çalışan"], correct: 2 },
  ],

  // 5. Sınıf: Sözcük türleri tümü, cümle ögeleri, deyim/atasözü, fiil çekimi
  "TURKCE_ORTAOKUL_5": [
    { question: "'Gitmek' fiilinin geniş zaman 3. tekil şahsı hangisidir?", options: ["Gitti", "Gider", "Gidecek", "Gitmiş"], correct: 1 },
    { question: "'Ali kitabı okudu.' cümlesinde özne hangisidir?", options: ["kitabı", "okudu", "Ali", "Cümlenin tamamı"], correct: 2 },
    { question: "'Ayağını yorganına göre uzatmak' atasözünün anlamı nedir?", options: ["Uzun boylu olmak", "Geliriyle orantılı harcamak", "Uyumak", "Yorgan almak"], correct: 1 },
    { question: "Aşağıdakilerden hangisi fiilimsi değildir?", options: ["Koşarak", "Gidecek (sıfat olarak)", "Okumak", "Güzel"], correct: 3 },
    { question: "'Çiçekler bahçede açmış.' cümlesinde yüklem hangisidir?", options: ["Çiçekler", "bahçede", "açmış", "Çiçekler açmış"], correct: 2 },
    { question: "Sözcüklerin gerçek anlamı dışında kullanılmasına ne denir?", options: ["Eş anlam", "Zıt anlam", "Mecaz anlam", "Terim anlam"], correct: 2 },
    { question: "'Yazmak' fiilinin şimdiki zaman 1. tekil şahsı hangisidir?", options: ["Yazdım", "Yazıyorum", "Yazacağım", "Yazmışım"], correct: 1 },
    { question: "'Hızlı koştu.' cümlesinde 'hızlı' hangi cümle ögesini oluşturur?", options: ["Özne", "Nesne", "Zarf tümleci", "Dolaylı tümleç"], correct: 2 },
    { question: "Bilgi vermek amacıyla yazılan yazı türü hangisidir?", options: ["Şiir", "Hikâye", "Ansiklopedi maddesi", "Roman"], correct: 2 },
    { question: "'Çocuk parka gitti.' cümlesinde dolaylı tümleç hangisidir?", options: ["Çocuk", "parka", "gitti", "Yok"], correct: 1 },
  ],

  // 6. Sınıf: Fiilimsi, cümle ögeleri, mecaz anlam, anlatım biçimleri
  "TURKCE_ORTAOKUL_6": [
    { question: "'Koşarak geldi.' cümlesinde 'koşarak' hangi fiilimsinin örneğidir?", options: ["İsim-fiil", "Sıfat-fiil", "Zarf-fiil (ulaç)", "Eylemsi değil"], correct: 2 },
    { question: "'Gözleri yıldız gibi parladı.' cümlesinde hangi anlatım özelliği vardır?", options: ["Gerçek anlam", "Mecaz anlam", "Terim anlam", "Yan anlam"], correct: 1 },
    { question: "Nesnel anlatımın temel özelliği nedir?", options: ["Duygu ve düşünce içerir", "Kanıtlanabilir bilgi verir", "Abartı içerir", "Kişisel yorum içerir"], correct: 1 },
    { question: "'Okuduğum kitap çok güzeldi.' cümlesinde 'okuduğum' hangi fiilimsidir?", options: ["İsim-fiil", "Sıfat-fiil", "Zarf-fiil", "Fiilimsi değil"], correct: 1 },
    { question: "'Arkadaşım bana bir kitap verdi.' cümlesinde nesne hangisidir?", options: ["Arkadaşım", "bana", "bir kitap", "verdi"], correct: 2 },
    { question: "Betimleme (tasvir) ne anlama gelir?", options: ["Olay anlatmak", "Varlıkları ayrıntılı tanımlamak", "Bilgi vermek", "İkna etmek"], correct: 1 },
    { question: "'Çok çalışmak başarıyı getirir.' cümlesinde 'çalışmak' hangi fiilimsinin örneğidir?", options: ["Sıfat-fiil", "Zarf-fiil", "İsim-fiil", "Fiilimsi değil"], correct: 2 },
    { question: "Öznel anlatımın temel özelliği nedir?", options: ["Kanıtlanabilirlik", "Kişisel yargı içermesi", "Bilimsel veri sunması", "Nesnel olmak"], correct: 1 },
    { question: "Anlatıcının bakış açısı dışarıdan olduğunda hangi anlatıcı türüdür?", options: ["1. kişi anlatıcı", "3. kişi anlatıcı", "Gözlemci anlatıcı", "İlahi anlatıcı"], correct: 2 },
    { question: "'Taş gibi uyudu.' cümlesinde hangi söz sanatı vardır?", options: ["Kişileştirme", "Abartma", "Benzetme (teşbih)", "Tezat"], correct: 2 },
  ],

  // 7. Sınıf: Söz sanatları, anlatım bozuklukları, yazı türleri, paragraf
  "TURKCE_ORTAOKUL_7": [
    { question: "'Dağlar kucakladı bizi.' cümlesinde hangi söz sanatı vardır?", options: ["Benzetme", "Abartma", "Kişileştirme", "Tezat"], correct: 2 },
    { question: "Ana fikir nedir?", options: ["Yazarın adı", "Metnin iletmek istediği temel mesaj", "Metindeki kişiler", "Metnin geçtiği yer"], correct: 1 },
    { question: "'Bin kere söyledim sana!' cümlesinde hangi söz sanatı vardır?", options: ["Benzetme", "Kişileştirme", "Abartma (mübalağa)", "Tezat"], correct: 2 },
    { question: "Anlatım bozukluğu olan cümle hangisidir?", options: ["Ali kitap okudu.", "Bu meseleyi konuştuk hakkında.", "Hava güzeldi.", "Arkadaşım geldi."], correct: 1 },
    { question: "Makale türünün temel amacı nedir?", options: ["Eğlendirmek", "Bir görüşü kanıtlamak", "Olay anlatmak", "Duygu aktarmak"], correct: 1 },
    { question: "'Güldü ağladı, ağladı güldü.' dizesinde hangi söz sanatı vardır?", options: ["Abartma", "Benzetme", "Tezat (zıtlık)", "Kişileştirme"], correct: 2 },
    { question: "Destansı şiirin konusu genellikle nedir?", options: ["Aşk", "Kahramanlık ve savaş", "Doğa", "Ölüm"], correct: 1 },
    { question: "Deneme türünün özelliği nedir?", options: ["Olay anlatır", "Yazarın kişisel görüşlerini kesin dille sunar", "Yazarın görüşlerini kanıtlamaya gerek duymadan yazar", "Bilimsel veri içerir"], correct: 2 },
    { question: "Paragrafta yardımcı fikir ne işlev görür?", options: ["Ana fikri destekler", "Ana fikrin yerini alır", "Yazara ait bilgi verir", "Konuyu değiştirir"], correct: 0 },
    { question: "Fıkra (köşe yazısı) türünün temel özelliği nedir?", options: ["Uzun olay anlatımı", "Güncel konuların kişisel yorumla ele alınması", "Şiirsel anlatım", "Bilimsel içerik"], correct: 1 },
  ],

  // 8. Sınıf: LGS düzeyinde metin anlama, söz sanatları, dil bilgisi
  "TURKCE_ORTAOKUL_8": [
    { question: "Aşağıdakilerden hangisi söz sanatı değildir?", options: ["Teşbih", "Istiare", "Teşhis", "Redif"], correct: 3 },
    { question: "'Kitap bir insanın en iyi arkadaşıdır.' cümlesinde hangi söz sanatı vardır?", options: ["Abartma", "Kişileştirme", "İstiare (açık)", "Tezat"], correct: 2 },
    { question: "Bağlaç görevindeki sözcüğü içeren cümle hangisidir?", options: ["Çok çalıştı, başardı.", "Ali ve Veli okula gitti.", "Koşarak geldi.", "Güzel bir kız gördüm."], correct: 1 },
    { question: "'Şu uzaktaki dağlara bak.' cümlesinde 'şu' hangi sözcük türüdür?", options: ["Kişi zamiri", "İşaret sıfatı", "Belgisiz sıfat", "İyelik zamiri"], correct: 1 },
    { question: "Aşağıdaki cümlelerden hangisinde anlatım bozukluğu vardır?", options: ["Seni çok özledim.", "Bu konuyu yarın tartışacağız hakkında.", "Hava bugün çok güzel.", "Yarın erken kalkacağım."], correct: 1 },
    { question: "Söylevde (nutuk) temel amaç nedir?", options: ["Eğlendirmek", "Bilgi vermek", "Toplumu etkilemek ve harekete geçirmek", "Olay anlatmak"], correct: 2 },
    { question: "Karşılaştırmalı anlatım hangi yazı türünde sıkça kullanılır?", options: ["Hikâye", "Makale", "Şiir", "Masal"], correct: 1 },
    { question: "'Ah, bu yağmur bir türlü dinmiyor!' cümlesinde hangi anlatım biçimi vardır?", options: ["Açıklama", "Tartışma", "Duygu yüklü (coşkulu) anlatım", "Betimleme"], correct: 2 },
    { question: "Şiirde her bölüme (dörtlük, üçlük vb.) ne denir?", options: ["Dize", "Kıta (bent)", "Kafiye", "Redif"], correct: 1 },
    { question: "Aşağıdakilerden hangisi eleştiri (tenkit) yazısının özelliğidir?", options: ["Yalnızca övgü içerir", "Bir eseri veya görüşü gerekçeli olarak değerlendirir", "Olay anlatır", "Atasözleri içerir"], correct: 1 },
  ],

  // ══════════════════════════════════════════
  // FEN BİLİMLERİ (3. Sınıftan itibaren MEB müfredatında)
  // ══════════════════════════════════════════

  // 3. Sınıf: Canlı-cansız, beş duyu, madde halleri, hava
  "FEN_BILIMLERI_ILKOKUL_3": [
    { question: "Hangisi canlı varlıktır?", options: ["Taş", "Su", "Ağaç", "Toprak"], correct: 2 },
    { question: "Hangi duygu organı ile sesleri algılarız?", options: ["Göz", "Burun", "Kulak", "Dil"], correct: 2 },
    { question: "Suyun sıvı hâlden katı hâle geçmesine ne denir?", options: ["Erime", "Donma", "Buharlaşma", "Yoğunlaşma"], correct: 1 },
    { question: "Hangisi bitkinin parçası değildir?", options: ["Kök", "Gövde", "Yaprak", "Kanat"], correct: 3 },
    { question: "Güneş ışığı olmadan bitkiler fotosentez yapabilir mi?", options: ["Evet, yapabilir", "Hayır, yapamaz", "Bazen yapabilir", "Sadece geceleri yapar"], correct: 1 },
    { question: "Hangisi hayvanların ihtiyaç duyduğu şeyler arasında değildir?", options: ["Besin", "Su", "Işık (güneş)", "Barınak"], correct: 2 },
    { question: "Hava kirliliğine neden olan hangisidir?", options: ["Ağaç dikmek", "Fabrika dumanı", "Yürüyüş yapmak", "Bisiklet sürmek"], correct: 1 },
    { question: "Magnetin çekebildiği madde hangisidir?", options: ["Plastik", "Cam", "Demir", "Tahta"], correct: 2 },
    { question: "Suyun buharlaşıp tekrar yağmur olarak yere dönmesine ne denir?", options: ["Fotosentez", "Su döngüsü", "Erozyon", "Rüzgar"], correct: 1 },
    { question: "Hangisi memelilere örnektir?", options: ["Kartal", "Kurbağa", "Balina", "Kertenkele"], correct: 2 },
  ],

  // 4. Sınıf: Besinler, madde-enerji, elektrik temelleri
  "FEN_BILIMLERI_ILKOKUL_4": [
    { question: "Hangi besin grubu vücudumuza en çok enerji sağlar?", options: ["Proteinler", "Yağlar", "Karbonhidratlar", "Vitaminler"], correct: 2 },
    { question: "Elektrik akımının geçtiği yola ne denir?", options: ["Elektrik devesi", "Elektrik devresi", "Elektrik kaynağı", "Elektrik pili"], correct: 1 },
    { question: "Işığı geçiren maddeler nasıl adlandırılır?", options: ["Opak", "Yarı saydam", "Saydam", "Yansıtan"], correct: 2 },
    { question: "Hangisi yenilenebilir enerji kaynağıdır?", options: ["Kömür", "Petrol", "Doğalgaz", "Güneş enerjisi"], correct: 3 },
    { question: "Besinlerin sindirimi ilk nerede başlar?", options: ["Mide", "Yemek borusu", "Ağız", "İnce bağırsak"], correct: 2 },
    { question: "Ses titreşimin nerede yayılamaz?", options: ["Suda", "Havada", "Katta (katı cisim)", "Boşlukta (vakum)"], correct: 3 },
    { question: "Elektriği ileten madde hangisidir?", options: ["Plastik", "Cam", "Bakır tel", "Kauçuk"], correct: 2 },
    { question: "Gölge nasıl oluşur?", options: ["Işığın yansımasıyla", "Işığın geçemediği cismin arkasında", "Havanın kararmasıyla", "Suyun buharlaşmasıyla"], correct: 1 },
    { question: "Hangisi protein açısından zengin besindir?", options: ["Pirinç", "Ekmek", "Et", "Şeker"], correct: 2 },
    { question: "Elektrik devresinde pil ne görevi görür?", options: ["Işık sağlar", "Elektrik enerjisi üretir (kaynak)", "Akımı keser", "Isı üretir"], correct: 1 },
  ],

  // 5. Sınıf: Hücre, canlılar sistematigi, madde ve değişim
  "FEN_BILIMLERI_ORTAOKUL_5": [
    { question: "Canlıların en küçük yapı birimi nedir?", options: ["Doku", "Hücre", "Organ", "Sistem"], correct: 1 },
    { question: "Bitki hücresinde hayvan hücresinde bulunmayan yapı hangisidir?", options: ["Hücre zarı", "Sitoplazma", "Hücre duvarı", "Çekirdek"], correct: 2 },
    { question: "Klorofil hangi organel içinde bulunur?", options: ["Mitokondri", "Ribozom", "Kloroplast", "Koful"], correct: 2 },
    { question: "Fiziksel değişime örnek hangisidir?", options: ["Kağıdın yanması", "Suyun donması", "Demirin paslanması", "Şekerin yanması"], correct: 1 },
    { question: "Canlılar hangi özelliklerine göre sınıflandırılmaz?", options: ["Renk", "Beslenme biçimi", "Hareket etme", "Hücre sayısı"], correct: 0 },
    { question: "Kimyasal değişime örnek hangisidir?", options: ["Suyun buharlaşması", "Şekerin suda çözünmesi", "Demirin paslanması", "Buzun erimesi"], correct: 2 },
    { question: "Mantar hangi canlı grubundadır?", options: ["Bitkiler", "Hayvanlar", "Mantarlar", "Bakteriler"], correct: 2 },
    { question: "Fotosentez sonucu açığa çıkan gaz hangisidir?", options: ["Karbondioksit", "Azot", "Oksijen", "Hidrojen"], correct: 2 },
    { question: "Hangisi tek hücreli canlıdır?", options: ["Mantar", "Amoeba", "Karides", "Solucan"], correct: 1 },
    { question: "Maddenin tanecikli yapısına göre hangisi yanlıştır?", options: ["Tanecikler hareket eder", "Tanecikler arası boşluk vardır", "Gaz tanecikleri en serbestçe hareket eder", "Katı tanecikleri hareket etmez"], correct: 3 },
  ],

  // 6. Sınıf: Vücudumuzdaki sistemler, kuvvet, madde döngüleri
  "FEN_BILIMLERI_ORTAOKUL_6": [
    { question: "Kanda oksijen taşıyan kan hücreleri hangileridir?", options: ["Akyuvarlar", "Trombositler", "Alyuvarlar", "Plazma"], correct: 2 },
    { question: "Newton'un 2. Hareket Yasası hangi formülle ifade edilir?", options: ["F = m + a", "F = m × a", "F = m - a", "F = m / a"], correct: 1 },
    { question: "Karbonun atmosferde döngüsünde fotosentez ve solunum hangi rol oynar?", options: ["Her ikisi CO₂ üretir", "Fotosentez CO₂ tüketir, solunum CO₂ üretir", "Her ikisi O₂ tüketir", "Fotosentez O₂ tüketir, solunum O₂ üretir"], correct: 1 },
    { question: "Hangisi sindirim sistemine ait değildir?", options: ["Mide", "İnce bağırsak", "Karaciğer", "Böbrek"], correct: 3 },
    { question: "Sürtünme kuvveti hakkında hangisi doğrudur?", options: ["Her zaman hareketi hızlandırır", "Her zaman harekete zıt yönde etki eder", "Yalnızca sıvılarda oluşur", "Kütleyle ilgisi yoktur"], correct: 1 },
    { question: "Sinir sistemi hakkında hangisi doğrudur?", options: ["Yalnızca beyinden oluşur", "Beyin, omurilik ve sinirlerden oluşur", "Sadece isteğe bağlı hareketleri kontrol eder", "Kalp atışını kontrol etmez"], correct: 1 },
    { question: "Azot döngüsünde toprağa azot bağlayan canlılar hangileridir?", options: ["Bitkiler", "Hayvanlar", "Baklagil köklerindeki bakteriler", "Mantarlar"], correct: 2 },
    { question: "Hangisi kaldıraç çeşididir?", options: ["Makas", "Çekiç", "Balta", "Hepsi kaldıraçtır"], correct: 3 },
    { question: "Üriner sistemde idrar hangi organda üretilir?", options: ["Mesane", "Üretra", "Böbrek", "Üreter"], correct: 2 },
    { question: "Işık hızı havada yaklaşık kaç km/s'dir?", options: ["300.000", "30.000", "3.000.000", "150.000"], correct: 0 },
  ],

  // 7. Sınıf: Hücre bölünmesi, kuvvet-enerji, elektrik, güneş sistemi
  "FEN_BILIMLERI_ORTAOKUL_7": [
    { question: "Mitoz bölünmede oluşan yeni hücre sayısı kaçtır?", options: ["1", "2", "4", "8"], correct: 1 },
    { question: "Mayoz bölünme sonucunda oluşan hücrelerin kromozom sayısı nasıldır?", options: ["Ana hücreyle aynı", "Ana hücrenin 2 katı", "Ana hücrenin yarısı", "Değişkendir"], correct: 2 },
    { question: "Elektrik enerjisini ısı enerjisine dönüştüren araç hangisidir?", options: ["Lamba (ışık)", "Elektrikli fırın", "Motor", "Hoparlör"], correct: 1 },
    { question: "Güneş sistemimizde Güneş'e en yakın gezegen hangisidir?", options: ["Venüs", "Dünya", "Merkür", "Mars"], correct: 2 },
    { question: "DNA'nın temel görevi nedir?", options: ["Enerji üretmek", "Kalıtsal bilgiyi taşımak", "Protein sindirmek", "Oksijen taşımak"], correct: 1 },
    { question: "Seri bağlı devrede pil sayısı artarsa akım nasıl değişir?", options: ["Azalır", "Artar", "Değişmez", "Sıfırlanır"], correct: 1 },
    { question: "Ay tutulması nasıl oluşur?", options: ["Ay, Güneş ile Dünya arasına girer", "Dünya, Güneş ile Ay arasına girer", "Güneş Ay'ı karartır", "Ay kendi etrafında döner"], correct: 1 },
    { question: "Hangisi kalıtsal hastalıklara örnek değildir?", options: ["Renk körlüğü", "Orak hücreli anemi", "Grip", "Down sendromu"], correct: 2 },
    { question: "Ohm Kanunu'na göre direnç sabitken gerilim iki katına çıkarsa akım ne olur?", options: ["Değişmez", "İki katına çıkar", "Yarıya iner", "Dörde katlanır"], correct: 1 },
    { question: "Kendi ışığıyla parlayan gök cisimleri nasıl adlandırılır?", options: ["Gezegen", "Uydu", "Yıldız", "Asteroid"], correct: 2 },
  ],

  // 8. Sınıf: Atomun yapısı, kimyasal tepkimeler, basınç, kalıtım, LGS hazırlık
  "FEN_BILIMLERI_ORTAOKUL_8": [
    { question: "Atom numarası 8 olan elementin atom çekirdeğindeki proton sayısı kaçtır?", options: ["6", "7", "8", "10"], correct: 2 },
    { question: "Bir kimyasal tepkimede kütlenin korunumu kanununa göre hangisi doğrudur?", options: ["Ürünlerin kütlesi reaktiflerden fazladır", "Reaktiflerin kütlesi ürünlerden fazladır", "Reaktiflerin ve ürünlerin kütleleri eşittir", "Kütle değişkendir"], correct: 2 },
    { question: "Asit ve baz karıştırıldığında oluşan tepkimeye ne denir?", options: ["Yanma", "Çözünme", "Nötralleşme", "Ayrışma"], correct: 2 },
    { question: "Mendel'in kalıtım kanununa göre Aa × Aa çaprazlamasında Aa oranı nedir?", options: ["1/4", "1/2", "3/4", "1"], correct: 1 },
    { question: "Basınç formülü nedir?", options: ["P = m × g", "P = F / A", "P = F × A", "P = m / V"], correct: 1 },
    { question: "İyon nedir?", options: ["Nötron kaybeden atom", "Elektron alıp vererek yük kazanan atom", "Proton kazanan atom", "Nötr atom"], correct: 1 },
    { question: "Suyun kaldırma kuvvetini ifade eden kanun hangisidir?", options: ["Newton Kanunu", "Ohm Kanunu", "Arşimet Kanunu", "Bernoulli Kanunu"], correct: 2 },
    { question: "İnsan vücudunda 46 kromozom vardır. Üreme hücrelerinde kaç kromozom bulunur?", options: ["46", "92", "23", "12"], correct: 2 },
    { question: "Endotermik tepkimede enerji nasıldır?", options: ["Enerji açığa çıkar", "Enerji soğurulur", "Enerji değişmez", "Enerji yok olur"], correct: 1 },
    { question: "Hangisi pH < 7 olan maddedir?", options: ["Saf su", "Sabun suyu", "Sirke", "Kabartma tozu"], correct: 2 },
  ],

  // ══════════════════════════════════════════
  // SOSYAL BİLGİLER (4-7. Sınıf)
  // ══════════════════════════════════════════

  // 4. Sınıf: Aile, komşuluk, Türkiye'nin coğrafyası temelleri
  "SOSYAL_BILGILER_ILKOKUL_4": [
    { question: "Türkiye'nin başkenti neresidir?", options: ["İstanbul", "İzmir", "Ankara", "Bursa"], correct: 2 },
    { question: "Türkiye kaç komşu ülkeyle sınır paylaşır?", options: ["5", "6", "8", "9"], correct: 2 },
    { question: "Cumhuriyetimiz hangi tarihte ilan edilmiştir?", options: ["29 Ekim 1923", "23 Nisan 1920", "19 Mayıs 1919", "30 Ağustos 1922"], correct: 0 },
    { question: "Haritada mavi renk neyi gösterir?", options: ["Dağlar", "Ovalar", "Su kütleleri", "Çöller"], correct: 2 },
    { question: "Atatürk hangi şehirde doğmuştur?", options: ["Ankara", "İstanbul", "Selanik", "Samsun"], correct: 2 },
    { question: "Türkiye'nin en uzun akarsuyu hangisidir?", options: ["Sakarya", "Kızılırmak", "Fırat", "Dicle"], correct: 1 },
    { question: "Türkiye'de en fazla hangi iklim çeşidi görülür?", options: ["Ekvatoral", "Kutup", "Akdeniz ve karasal", "Tropikal"], correct: 2 },
    { question: "Millî Egemenlik ve Çocuk Bayramı hangi tarihtir?", options: ["29 Ekim", "23 Nisan", "19 Mayıs", "30 Ağustos"], correct: 1 },
    { question: "Hangisi Türkiye'nin komşusu değildir?", options: ["Yunanistan", "İran", "Irak", "Mısır"], correct: 3 },
    { question: "Türkiye hangi kıtada yer alır?", options: ["Yalnızca Asya'da", "Yalnızca Avrupa'da", "Hem Asya hem Avrupa'da", "Afrika'da"], correct: 2 },
  ],

  // 5. Sınıf: Türkiye'nin bölgeleri, tarih, vatandaşlık
  "SOSYAL_BILGILER_ORTAOKUL_5": [
    { question: "Türkiye kaç coğrafi bölgeye ayrılmaktadır?", options: ["5", "6", "7", "8"], correct: 2 },
    { question: "Türklerin Anadolu'ya kesin olarak yerleşmesini sağlayan savaş hangisidir?", options: ["Çaldıran", "Malazgirt", "Mohaç", "Mercidabık"], correct: 1 },
    { question: "Hangisi Ege Bölgesi'nin özelliğidir?", options: ["En soğuk bölge", "Zeytinlik alanları geniştir", "En kurak bölge", "Orman örtüsü yoktur"], correct: 1 },
    { question: "Türkiye Büyük Millet Meclisi hangi tarihte açılmıştır?", options: ["29 Ekim 1923", "23 Nisan 1920", "19 Mayıs 1919", "30 Ağustos 1922"], correct: 1 },
    { question: "Doğu Anadolu Bölgesi hakkında hangisi doğrudur?", options: ["Deniz etkisinde kalır", "En yüksek ve en soğuk bölgedir", "Nüfus yoğunluğu yüksektir", "Tarıma elverişli geniş ovaları vardır"], correct: 1 },
    { question: "Osmanlı Devleti hangi yılda kurulmuştur?", options: ["1071", "1299", "1453", "1517"], correct: 1 },
    { question: "Türkiye'de demokratik seçimler ilk kez ne zaman yapılmıştır?", options: ["1923", "1946", "1950", "1960"], correct: 2 },
    { question: "Karadeniz Bölgesi'nin öne çıkan tarım ürünü nedir?", options: ["Pamuk", "Zeytin", "Fındık", "Portakal"], correct: 2 },
    { question: "Temel insan hakları arasında hangisi yer almaz?", options: ["Yaşam hakkı", "Eğitim hakkı", "Başkalarına zarar verme hakkı", "Sağlık hakkı"], correct: 2 },
    { question: "Anadolu'daki ilk Türk devleti olarak kabul edilen hangisidir?", options: ["Osmanlı Devleti", "Anadolu Selçuklu Devleti", "Karamanoğulları", "İlhanlılar"], correct: 1 },
  ],

  // 6. Sınıf: Tarih çağları, coğrafi keşifler, yönetim
  "SOSYAL_BILGILER_ORTAOKUL_6": [
    { question: "Yazının bulunmasıyla başlayan tarih dönemi hangisidir?", options: ["Taş Devri", "Tarih Çağları", "Bronz Çağı", "Demir Çağı"], correct: 1 },
    { question: "Coğrafi Keşiflerin temel nedeni nedir?", options: ["Bilim yapmak", "Yeni ticaret yolları bulmak", "Eğlenmek", "Savaşmak"], correct: 1 },
    { question: "İlk yazı hangi uygarlık tarafından bulunmuştur?", options: ["Mısırlılar", "Romalılar", "Sümerler", "Yunanlılar"], correct: 2 },
    { question: "Amerika kıtasını Avrupalılar adına ilk keşfeden kişi kimdir?", options: ["Magellan", "Vasco Da Gama", "Kristof Kolomb", "Cabot"], correct: 2 },
    { question: "Feodalizm hangi dönemin özelliğidir?", options: ["Antik Çağ", "Orta Çağ", "Yeni Çağ", "Yakın Çağ"], correct: 1 },
    { question: "Fransız İhtilali'nin temel sonuçlarından biri nedir?", options: ["Soylulara ayrıcalık tanındı", "Milliyetçilik akımı güçlendi", "Monarşi güçlendi", "Kölelik yaygınlaştı"], correct: 1 },
    { question: "Hangisi Orta Çağ'ın özelliğidir?", options: ["Bilimsel gelişme", "Kilise egemenliği ve feodal düzen", "Demokratik yönetim", "Sanayi devrimi"], correct: 1 },
    { question: "İstanbul'un fethinin gerçekleştiği yıl hangisidir?", options: ["1299", "1453", "1517", "1683"], correct: 1 },
    { question: "Rönesans hareketi nerede başlamıştır?", options: ["Fransa", "Almanya", "İtalya", "İspanya"], correct: 2 },
    { question: "Sanayi Devrimi hangi ülkede başlamıştır?", options: ["Fransa", "Almanya", "İngiltere", "ABD"], correct: 2 },
  ],

  // 7. Sınıf: Türk İslam Tarihi, Osmanlı, ülkeler coğrafyası
  "SOSYAL_BILGILER_ORTAOKUL_7": [
    { question: "Türklerin İslamiyet'i toplu olarak kabul ettiği dönem hangisidir?", options: ["8. yüzyıl", "10. yüzyıl", "12. yüzyıl", "14. yüzyıl"], correct: 1 },
    { question: "Osmanlı'nın en geniş sınırlarına ulaştığı dönem hangi padişah zamanındadır?", options: ["Fatih Sultan Mehmet", "Yavuz Sultan Selim", "Kanuni Sultan Süleyman", "II. Mehmet"], correct: 2 },
    { question: "Hangisi nüfus yoğunluğu en fazla olan kıtadır?", options: ["Amerika", "Afrika", "Asya", "Avrupa"], correct: 2 },
    { question: "Kapitülasyonlar nedir?", options: ["Osmanlı'nın diğer devletlere verdiği ticari ayrıcalıklar", "Osmanlı'nın aldığı topraklar", "Osmanlı'nın kurduğu kuruluşlar", "Osmanlı kültür mirası"], correct: 0 },
    { question: "Tanzimat Fermanı hangi yılda ilan edilmiştir?", options: ["1808", "1839", "1856", "1876"], correct: 1 },
    { question: "Hangisi çöl ikliminin yaşandığı bölgede yer alır?", options: ["İskandinav ülkeleri", "Sahra Çölü ülkeleri", "Ekvator ülkeleri", "Kuzey Kutbu"], correct: 1 },
    { question: "I. Dünya Savaşı hangi yılda başlamıştır?", options: ["1912", "1914", "1918", "1920"], correct: 1 },
    { question: "Dünyanın en yüksek dağı hangisidir?", options: ["K2", "Kilimanjaro", "Everest", "Elbrus"], correct: 2 },
    { question: "Birinci Dünya Savaşı'nda Osmanlı hangi cephede İngilizlere karşı büyük zafer kazandı?", options: ["Suriye Cephesi", "Çanakkale Cephesi", "Hicaz Cephesi", "Kafkasya Cephesi"], correct: 1 },
    { question: "Hangisi G20 ülkesi değildir?", options: ["Türkiye", "Brezilya", "Yeni Zelanda", "Hindistan"], correct: 2 },
  ],

  // ══════════════════════════════════════════
  // İNGİLİZCE
  // ══════════════════════════════════════════

  // 2. Sınıf: Temel kelimeler, renkler, sayılar, selamlaşma
  "INGILIZCE_ILKOKUL_2": [
    { question: "What color is the sky?", options: ["Red", "Green", "Blue", "Yellow"], correct: 2 },
    { question: "How do you say 'Merhaba' in English?", options: ["Goodbye", "Hello", "Thank you", "Please"], correct: 1 },
    { question: "What is 'elma' in English?", options: ["Banana", "Orange", "Apple", "Grape"], correct: 2 },
    { question: "How many days are in a week?", options: ["5", "6", "7", "8"], correct: 2 },
    { question: "What is 'kedi' in English?", options: ["Dog", "Cat", "Bird", "Fish"], correct: 1 },
    { question: "What color is grass?", options: ["Blue", "Red", "Green", "White"], correct: 2 },
    { question: "How do you say 'Teşekkür ederim' in English?", options: ["Sorry", "Please", "Thank you", "Excuse me"], correct: 2 },
    { question: "What number comes after 9?", options: ["8", "11", "10", "12"], correct: 2 },
    { question: "What is 'araba' in English?", options: ["Truck", "Bus", "Bicycle", "Car"], correct: 3 },
    { question: "Which is a school item?", options: ["Apple", "Pencil", "Cat", "Door"], correct: 1 },
  ],

  // 3-4. Sınıf: Basit cümleler, hayvanlar, aile, günler
  "INGILIZCE_ILKOKUL_3": [
    { question: "What is the English of 'köpek'?", options: ["Cat", "Bird", "Dog", "Fish"], correct: 2 },
    { question: "Which is a day of the week?", options: ["January", "Monday", "Summer", "Spring"], correct: 1 },
    { question: "I ___ a student. (am/is/are)", options: ["is", "are", "am", "be"], correct: 2 },
    { question: "What is the plural of 'book'?", options: ["Bookes", "Books", "Bookies", "Booker"], correct: 1 },
    { question: "What is 'anne' in English?", options: ["Father", "Sister", "Brother", "Mother"], correct: 3 },
    { question: "How many months are in a year?", options: ["10", "11", "12", "13"], correct: 2 },
    { question: "What does 'big' mean?", options: ["Küçük", "Büyük", "Hızlı", "Yavaş"], correct: 1 },
    { question: "She ___ to school every day. (go)", options: ["go", "goes", "going", "gone"], correct: 1 },
    { question: "What is 'kırmızı' in English?", options: ["Blue", "Green", "Red", "Yellow"], correct: 2 },
    { question: "Which is a family member?", options: ["Table", "Chair", "Brother", "School"], correct: 2 },
  ],

  "INGILIZCE_ILKOKUL_4": [
    { question: "What is the opposite of 'hot'?", options: ["Warm", "Cold", "Cool", "Wet"], correct: 1 },
    { question: "They ___ playing football now. (is/are)", options: ["is", "am", "are", "be"], correct: 2 },
    { question: "What does 'hungry' mean?", options: ["Mutlu", "Yorgun", "Aç", "Üzgün"], correct: 2 },
    { question: "Which sentence is correct?", options: ["She have a cat.", "She has a cat.", "She haves a cat.", "She is have a cat."], correct: 1 },
    { question: "What is 'okul' in English?", options: ["Hospital", "Market", "School", "Park"], correct: 2 },
    { question: "How do you ask someone's name?", options: ["How are you?", "What is your name?", "Where are you?", "How old are you?"], correct: 1 },
    { question: "What does 'beautiful' mean?", options: ["Çirkin", "Hızlı", "Güzel", "Yavaş"], correct: 2 },
    { question: "I ___ eating breakfast. (am/is/are)", options: ["is", "are", "am", "be"], correct: 2 },
    { question: "Which word means 'kitap' in English?", options: ["Pen", "Book", "Bag", "Desk"], correct: 1 },
    { question: "What season comes after winter?", options: ["Summer", "Autumn", "Spring", "Rainy"], correct: 2 },
  ],

  // 5. Sınıf: Basit geçmiş zaman, sıfatlar, günlük diyaloglar
  "INGILIZCE_ORTAOKUL_5": [
    { question: "Yesterday, I ___ to the park. (go)", options: ["go", "goes", "went", "gone"], correct: 2 },
    { question: "What does 'always' mean?", options: ["Hiçbir zaman", "Bazen", "Her zaman", "Nadiren"], correct: 2 },
    { question: "She ___ not like coffee. (do/does)", options: ["do", "does", "did", "is"], correct: 1 },
    { question: "'Faster than a car' — what is 'faster'?", options: ["Noun", "Verb", "Comparative adjective", "Adverb"], correct: 2 },
    { question: "We ___ a film last night. (watch)", options: ["watch", "watches", "watched", "watching"], correct: 2 },
    { question: "What does 'sometimes' mean?", options: ["Her zaman", "Hiçbir zaman", "Bazen", "Genellikle"], correct: 2 },
    { question: "Which question is correct?", options: ["Where he lives?", "Where does he live?", "Where is he live?", "Does he where live?"], correct: 1 },
    { question: "The Nile is ___ river in the world. (long)", options: ["longer", "more long", "the longest", "the most long"], correct: 2 },
    { question: "What does 'expensive' mean?", options: ["Ucuz", "Pahalı", "Yeni", "Eski"], correct: 1 },
    { question: "I ___ my homework yet. (not finish)", options: ["didn't finished", "haven't finished", "don't finished", "wasn't finished"], correct: 1 },
  ],

  // 6. Sınıf: Present Perfect, modal verbs, karşılaştırma
  "INGILIZCE_ORTAOKUL_6": [
    { question: "She ___ to Paris twice. (be)", options: ["was", "is", "has been", "have been"], correct: 2 },
    { question: "You ___ wear a seatbelt. It's the law. (must/should)", options: ["should", "must", "can", "might"], correct: 1 },
    { question: "Which sentence uses Present Perfect correctly?", options: ["I see that film yesterday.", "I have seen that film.", "I saw that film now.", "I am see that film."], correct: 1 },
    { question: "What does 'although' mean?", options: ["Çünkü", "Bu yüzden", "Her ne kadar / Ancak", "Eğer"], correct: 2 },
    { question: "He ___ speak three languages. (ability)", options: ["must", "should", "can", "will"], correct: 2 },
    { question: "We have lived here ___ 2010.", options: ["for", "since", "ago", "in"], correct: 1 },
    { question: "Choose the passive: 'The cake ___ by my mother.'", options: ["was made", "made", "is making", "make"], correct: 0 },
    { question: "What does 'however' mean?", options: ["Ayrıca", "Bunun için", "Bununla birlikte / Ancak", "Sonuç olarak"], correct: 2 },
    { question: "I've known her ___ ten years.", options: ["since", "for", "ago", "from"], correct: 1 },
    { question: "You ___ smoke here. It's forbidden.", options: ["can", "should", "mustn't", "might"], correct: 2 },
  ],

  // 7. Sınıf: İleri dilbilgisi, metin anlama
  "INGILIZCE_ORTAOKUL_7": [
    { question: "If I ___ rich, I would travel the world. (be)", options: ["am", "was", "were", "be"], correct: 2 },
    { question: "She said she ___ tired. (be — reported speech)", options: ["is", "was", "were", "be"], correct: 1 },
    { question: "The book ___ by Tolstoy. (write — passive)", options: ["wrote", "was written", "is wrote", "write"], correct: 1 },
    { question: "He asked me where I ___ (live — reported speech)", options: ["live", "lived", "was living", "Both B and C"], correct: 3 },
    { question: "If she ___ harder, she would pass. (study)", options: ["studies", "studied", "will study", "study"], correct: 1 },
    { question: "What does 'consequently' mean?", options: ["Aksine", "Sonuç olarak", "Ayrıca", "Örneğin"], correct: 1 },
    { question: "The movie ___ before we arrived. (finish — Past Perfect)", options: ["finished", "has finished", "had finished", "was finishing"], correct: 2 },
    { question: "Despite ___ tired, she continued working.", options: ["being", "be", "to be", "been"], correct: 0 },
    { question: "What does 'furthermore' mean?", options: ["Ancak", "Bunun yanı sıra / Ayrıca", "Dolayısıyla", "Örneğin"], correct: 1 },
    { question: "By the time he arrived, we ___. (eat — Past Perfect)", options: ["ate", "have eaten", "had eaten", "were eating"], correct: 2 },
  ],

  // 8. Sınıf: LGS düzeyi İngilizce
  "INGILIZCE_ORTAOKUL_8": [
    { question: "Which sentence is in Past Simple?", options: ["I am running.", "She has gone.", "They played football.", "We will study."], correct: 2 },
    { question: "Choose the correct form: 'He ___ TV when I called.'", options: ["watched", "was watching", "is watching", "watches"], correct: 1 },
    { question: "What is the superlative of 'good'?", options: ["Gooder", "More good", "Goodest", "Best"], correct: 3 },
    { question: "'I wish I ___ fly.' (ability wish)", options: ["can", "could", "would", "should"], correct: 1 },
    { question: "Which word is a noun?", options: ["Beautiful", "Quickly", "Happiness", "Run"], correct: 2 },
    { question: "She ___ her keys, so she couldn't get in. (lose — past perfect)", options: ["lost", "has lost", "had lost", "loses"], correct: 2 },
    { question: "Which is correct? (Reported speech)", options: ["He said he will come.", "He said he would come.", "He said he comes.", "He said he is come."], correct: 1 },
    { question: "What does 'in contrast' mean?", options: ["Benzer şekilde", "Buna karşın / Aksine", "Bunun için", "Örneğin"], correct: 1 },
    { question: "The project ___ by Friday. (complete — passive future)", options: ["completes", "will complete", "will be completed", "is completing"], correct: 2 },
    { question: "She is the ___ student in the class. (intelligent — superlative)", options: ["more intelligent", "intelligenter", "most intelligent", "intelligent"], correct: 2 },
  ],
};

// ─────────────────────────────────────────────
// Ana fonksiyon: sınıf ve derse göre soruları getir
// ─────────────────────────────────────────────
export function getQuestions(subject: string, gradeLevel: string): Question[] {
  // Önce tam eşleşme dene: MATEMATIK_ILKOKUL_3, TURKCE_ORTAOKUL_7 vb.
  const exactKey = `${subject}_${gradeLevel}`;
  if (questions[exactKey]) return questions[exactKey];

  // gradeLevel: ILKOKUL_1, ILKOKUL_4, ORTAOKUL_7 vb.
  // Kısa anahtar: MATEMATIK_ILKOKUL_1
  const parts = gradeLevel.split("_"); // ["ILKOKUL", "3"] veya ["ORTAOKUL", "7"]
  if (parts.length === 2) {
    const level = parts[0]; // ILKOKUL veya ORTAOKUL
    const gradeNum = parts[1]; // 1..8
    const key = `${subject}_${level}_${gradeNum}`;
    if (questions[key]) return questions[key];
  }

  // Bulunamazsa genel seviye soruları (fallback)
  const isIlkokul = gradeLevel.startsWith("ILKOKUL");
  const fallbackKey = `${subject}_${isIlkokul ? "ILKOKUL_4" : "ORTAOKUL_5"}`;
  return questions[fallbackKey] ?? [];
}
