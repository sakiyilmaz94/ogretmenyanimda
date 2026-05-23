export interface Question {
  question: string;
  options: [string, string, string, string];
  correct: number; // 0-3
}

type QuestionBank = Partial<Record<string, Question[]>>;

const questions: QuestionBank = {
  // İlkokul Matematik
  "MATEMATIK_ILKOKUL": [
    { question: "15 + 27 kaç eder?", options: ["40", "42", "43", "41"], correct: 1 },
    { question: "56 - 19 kaç eder?", options: ["35", "37", "37", "38"], correct: 1 },
    { question: "6 × 7 kaç eder?", options: ["42", "43", "41", "44"], correct: 0 },
    { question: "48 ÷ 6 kaç eder?", options: ["7", "8", "6", "9"], correct: 1 },
    { question: "Hangisi çift sayıdır?", options: ["13", "17", "24", "31"], correct: 2 },
    { question: "1 kg kaç gramdır?", options: ["100 g", "500 g", "1000 g", "10 g"], correct: 2 },
    { question: "3/4 kesrinin payı kaçtır?", options: ["4", "3", "7", "1"], correct: 1 },
    { question: "Bir dikdörtgenin kaç köşesi vardır?", options: ["3", "5", "6", "4"], correct: 3 },
    { question: "125 sayısının rakamlar toplamı kaçtır?", options: ["7", "8", "9", "6"], correct: 1 },
    { question: "2³ kaç eder?", options: ["6", "8", "9", "4"], correct: 1 },
  ],
  // Ortaokul Matematik
  "MATEMATIK_ORTAOKUL": [
    { question: "2x + 5 = 13 denkleminde x kaçtır?", options: ["3", "4", "5", "6"], correct: 1 },
    { question: "(-3) × (-4) kaç eder?", options: ["-12", "12", "-7", "7"], correct: 1 },
    { question: "√64 kaç eder?", options: ["6", "7", "8", "9"], correct: 2 },
    { question: "3² + 4² kaç eder?", options: ["24", "25", "26", "27"], correct: 1 },
    { question: "%20'si 30 olan sayı kaçtır?", options: ["120", "150", "180", "200"], correct: 1 },
    { question: "a/b = 3/4 ise 4a kaç eder?", options: ["3b", "4b", "12b", "b/3"], correct: 0 },
    { question: "Bir üçgenin iç açıları toplamı kaç derecedir?", options: ["90°", "180°", "270°", "360°"], correct: 1 },
    { question: "0,75 ondalık sayısı kesir olarak nedir?", options: ["1/4", "3/4", "2/3", "3/5"], correct: 1 },
    { question: "3x - 2 > 7 eşitsizliğini sağlayan en küçük tam sayı kaçtır?", options: ["2", "3", "4", "5"], correct: 2 },
    { question: "Bir kare prizma kaç yüze sahiptir?", options: ["4", "5", "6", "8"], correct: 2 },
  ],
  // İlkokul Türkçe
  "TURKCE_ILKOKUL": [
    { question: "'Mutlu' kelimesinin zıt anlamlısı nedir?", options: ["Sevinçli", "Neşeli", "Mutsuz", "Huzurlu"], correct: 2 },
    { question: "'Güzel' kelimesinin eş anlamlısı nedir?", options: ["Çirkin", "Hoş", "Kötü", "Sıradan"], correct: 1 },
    { question: "Hangisi isim değildir?", options: ["Kitap", "Koşmak", "Elma", "Masa"], correct: 1 },
    { question: "Cümle hangi noktalama işareti ile biter?", options: ["Virgül", "Noktalı virgül", "Nokta", "İki nokta"], correct: 2 },
    { question: "'Hızlı' kelimesi cümlede ne görevini üstlenmiştir? ('O hızlı koşuyor')", options: ["İsim", "Fiil", "Sıfat", "Zamir"], correct: 2 },
    { question: "Hangisi heceli doğru yazılmıştır?", options: ["ar-ka-daş", "a-rka-daş", "ark-a-daş", "ar-kad-aş"], correct: 0 },
    { question: "'Ben' kelimesi hangi türde zamirdir?", options: ["İşaret zamiri", "Kişi zamiri", "Belirsizlik zamiri", "Soru zamiri"], correct: 1 },
    { question: "Paragrafın ana fikri nerede bulunur?", options: ["Başında", "Ortasında", "Sonunda", "Her üçünde de olabilir"], correct: 3 },
    { question: "Hangisi büyük harf kuralına göre doğru yazılmıştır?", options: ["türkiye", "Türkiye", "TÜRKİYE", "türKiye"], correct: 1 },
    { question: "'Ev' kelimesine hangi eki getirirsek çoğul olur?", options: ["-de", "-den", "-ler", "-e"], correct: 2 },
  ],
  // Ortaokul Türkçe
  "TURKCE_ORTAOKUL": [
    { question: "'Yüreği ağzına geldi' deyimi ne anlama gelir?", options: ["Çok yorulmak", "Çok korkmak", "Çok sevinmek", "Çok acıkmak"], correct: 1 },
    { question: "Hangisi mecaz anlam içerir?", options: ["Elma kırmızıdır", "Masa ahşaptır", "Gözleri yıldız gibi parladı", "Su akıyor"], correct: 2 },
    { question: "Anlatıcının kendi iç dünyasını anlattığı şiir türü nedir?", options: ["Epik", "Lirik", "Dramatik", "Didaktik"], correct: 1 },
    { question: "Altı çizili sözcük hangi cümle ögesidir? 'Ali kitabı okudu.'", options: ["Özne", "Yüklem", "Nesne", "Dolaylı tümleç"], correct: 2 },
    { question: "Haber kipi eklerinden biri hangisidir?", options: ["-se", "-miş", "-e", "-meli"], correct: 1 },
    { question: "'Dağ başını duman almış' dörtlüğü hangi türdedir?", options: ["Mani", "Türkü", "Ağıt", "Ninni"], correct: 0 },
    { question: "Hangisi bileşik cümledir?", options: ["Ali koştu", "Ali ve Veli oynadı", "Çok çalıştığı için kazandı", "Kitap aldım"], correct: 2 },
    { question: "Yazı türleri arasında 'makale'nin temel amacı nedir?", options: ["Eğlendirmek", "Bir görüşü kanıtlamak", "Öykü anlatmak", "Şiir yazmak"], correct: 1 },
    { question: "Şiirde her satıra ne denir?", options: ["Bölüm", "Paragraf", "Dize", "Kıta"], correct: 2 },
    { question: "Atatürk'ün 'Gençliğe Hitabe' metni hangi tür yazıdır?", options: ["Şiir", "Nutuk / Söylev", "Roman", "Hikâye"], correct: 1 },
  ],
  // İlkokul Fen Bilimleri
  "FEN_BILIMLERI_ILKOKUL": [
    { question: "Güneş sistemi'nin merkezi nedir?", options: ["Dünya", "Ay", "Güneş", "Mars"], correct: 2 },
    { question: "Hangisi bir canlı değildir?", options: ["Ağaç", "Kelebek", "Taş", "Mantar"], correct: 2 },
    { question: "Su hangi sıcaklıkta kaynar?", options: ["50°C", "80°C", "100°C", "120°C"], correct: 2 },
    { question: "Işık kaynağı olan hangisidir?", options: ["Ay", "Mars", "Güneş", "Dünya"], correct: 2 },
    { question: "Hangisi sürüngen değildir?", options: ["Kertenkele", "Yılan", "Timsah", "Kurbağa"], correct: 3 },
    { question: "Hava kirliliğine neden olan hangisidir?", options: ["Ağaç dikmek", "Egzoz gazı", "Güneş enerjisi", "Temiz su kullanmak"], correct: 1 },
    { question: "Bitkiler fotosentez için ne kullanır?", options: ["Oksijen", "Karbondioksit", "Azot", "Hidrojen"], correct: 1 },
    { question: "Besinlerin sindirimi nerede başlar?", options: ["Mide", "İnce bağırsak", "Ağız", "Kalın bağırsak"], correct: 2 },
    { question: "Elektrik akımını ileten madde hangisidir?", options: ["Plastik", "Cam", "Bakır", "Tahta"], correct: 2 },
    { question: "Hangisi yenilenebilir enerji kaynağıdır?", options: ["Kömür", "Petrol", "Doğalgaz", "Güneş"], correct: 3 },
  ],
  // Ortaokul Fen Bilimleri
  "FEN_BILIMLERI_ORTAOKUL": [
    { question: "Atomun merkezindeki parçacık nedir?", options: ["Elektron", "Proton", "Nötron", "Çekirdek"], correct: 3 },
    { question: "F = m × a formülü neyin yasasıdır?", options: ["Newton'un 1. yasası", "Newton'un 2. yasası", "Newton'un 3. yasası", "Arşimet yasası"], correct: 1 },
    { question: "DNA hangi organelde bulunur?", options: ["Mitokondri", "Hücre çekirdeği", "Ribozom", "Lizozom"], correct: 1 },
    { question: "Asit-baz göstergesi olan madde hangisidir?", options: ["Su", "Tuz", "Turnusol", "Şeker"], correct: 2 },
    { question: "Işığın kırılması hangi araçla gözlemlenir?", options: ["Prizma", "Ayna", "Teleskop", "Mikroskop"], correct: 0 },
    { question: "Hangisi element değildir?", options: ["Demir", "Oksijen", "Su", "Altın"], correct: 2 },
    { question: "Fotosentezde açığa çıkan gaz hangisidir?", options: ["Karbondioksit", "Azot", "Oksijen", "Hidrojen"], correct: 2 },
    { question: "1 Watt kaç Joule/saniyedir?", options: ["0,5", "1", "10", "100"], correct: 1 },
    { question: "Kuvvet birimi nedir?", options: ["Joule", "Newton", "Watt", "Pascal"], correct: 1 },
    { question: "Hangisi fiziksel değişimdir?", options: ["Kâğıdın yanması", "Suyun donması", "Demirin paslanması", "Şekerin yanması"], correct: 1 },
  ],
  // İngilizce (ilkokul ve ortaokul aynı)
  "INGILIZCE_ILKOKUL": [
    { question: "What is the English of 'elma'?", options: ["Orange", "Banana", "Apple", "Grape"], correct: 2 },
    { question: "Which is correct? 'I ___ a student.'", options: ["am", "is", "are", "be"], correct: 0 },
    { question: "What is the plural of 'book'?", options: ["Bookes", "Books", "Bookies", "Book"], correct: 1 },
    { question: "What color is the sky?", options: ["Red", "Green", "Yellow", "Blue"], correct: 3 },
    { question: "Which is a day of the week?", options: ["January", "Monday", "Summer", "Spring"], correct: 1 },
    { question: "What does 'big' mean?", options: ["Küçük", "Büyük", "Hızlı", "Yavaş"], correct: 1 },
    { question: "How many days are in a week?", options: ["5", "6", "7", "8"], correct: 2 },
    { question: "Which is an animal?", options: ["Table", "Chair", "Cat", "Door"], correct: 2 },
    { question: "'She ___ to school every day.' (go)", options: ["go", "goes", "going", "gone"], correct: 1 },
    { question: "What is the opposite of 'hot'?", options: ["Warm", "Cool", "Cold", "Wet"], correct: 2 },
  ],
  "INGILIZCE_ORTAOKUL": [
    { question: "Which sentence is in Past Simple?", options: ["I am running", "She has gone", "They played football", "We will study"], correct: 2 },
    { question: "Choose the correct form: 'He ___ TV when I called.'", options: ["watched", "was watching", "is watching", "watches"], correct: 1 },
    { question: "What is the superlative of 'good'?", options: ["Gooder", "More good", "Goodest", "Best"], correct: 3 },
    { question: "Which is a conjunction?", options: ["Quickly", "Beautiful", "Because", "Run"], correct: 2 },
    { question: "'I wish I ___ a car.' (have)", options: ["have", "had", "has", "having"], correct: 1 },
    { question: "Which sentence uses the Present Perfect correctly?", options: ["I see that movie", "I have seen that movie", "I saw that movie yesterday", "I seeing that movie"], correct: 1 },
    { question: "What does 'although' mean?", options: ["Çünkü", "Bu yüzden", "Ancak/Her ne kadar", "Eğer"], correct: 2 },
    { question: "Choose the passive voice: 'The letter ___ by Tom.'", options: ["was written", "wrote", "is writing", "has write"], correct: 0 },
    { question: "Which word is a noun?", options: ["Beautiful", "Quickly", "Happiness", "Run"], correct: 2 },
    { question: "'If I ___ rich, I would travel the world.' (be)", options: ["am", "was", "were", "be"], correct: 2 },
  ],
  // Sosyal Bilgiler
  "SOSYAL_BILGILER_ILKOKUL": [
    { question: "Türkiye'nin başkenti neresidir?", options: ["İstanbul", "İzmir", "Ankara", "Bursa"], correct: 2 },
    { question: "Türk Kurtuluş Savaşı hangi yılda tamamlandı?", options: ["1919", "1920", "1922", "1923"], correct: 3 },
    { question: "Hangisi bir kıta değildir?", options: ["Asya", "Afrika", "Atlantik", "Avrupa"], correct: 2 },
    { question: "Cumhuriyetimiz hangi tarihte ilan edildi?", options: ["29 Ekim 1923", "23 Nisan 1920", "19 Mayıs 1919", "30 Ağustos 1922"], correct: 0 },
    { question: "Atatürk hangi şehirde doğmuştur?", options: ["Ankara", "İstanbul", "Selanik", "Samsun"], correct: 2 },
    { question: "Ekvatora en yakın iklim kuşağı hangisidir?", options: ["Kutup", "Ilıman", "Tropikal", "Çöl"], correct: 2 },
    { question: "Hangisi tarihî bir esere örnektir?", options: ["Gökdelen", "Süleymaniye Camii", "Alışveriş merkezi", "Tren istasyonu"], correct: 1 },
    { question: "Türkiye kaç komşu ülkeyle sınır paylaşır?", options: ["6", "7", "8", "9"], correct: 2 },
    { question: "Haritada mavi renk genellikle neyi gösterir?", options: ["Dağlar", "Ovalar", "Su kütleleri", "Ormanlar"], correct: 2 },
    { question: "Osmanlı Devleti ne zaman kurulmuştur?", options: ["1071", "1299", "1453", "1517"], correct: 1 },
  ],
  "SOSYAL_BILGILER_ORTAOKUL": [
    { question: "Coğrafi Keşiflerin temel nedeni nedir?", options: ["Bilim yapmak", "Yeni ticaret yolları bulmak", "Eğlence", "Savaşmak"], correct: 1 },
    { question: "Sanayi Devrimi hangi ülkede başlamıştır?", options: ["Fransa", "Almanya", "İngiltere", "ABD"], correct: 2 },
    { question: "Dünya'nın dönüş yönü nasıldır?", options: ["Batıdan doğuya", "Doğudan batıya", "Kuzeyden güneye", "Güneyden kuzeye"], correct: 0 },
    { question: "Türkiye'de hangi tarihte çok partili sisteme geçilmiştir?", options: ["1923", "1938", "1946", "1950"], correct: 2 },
    { question: "Hangisi yenilenebilir enerji kaynağıdır?", options: ["Kömür", "Petrol", "Rüzgar", "Doğalgaz"], correct: 2 },
    { question: "BM (Birleşmiş Milletler) kaç yılında kurulmuştur?", options: ["1919", "1939", "1945", "1950"], correct: 2 },
    { question: "Tarihte ilk yazılı kanunlar hangi medeniyete aittir?", options: ["Mısır", "Sümer", "Roma", "Yunan"], correct: 1 },
    { question: "Türkiye hangi iklim kuşakları arasında yer alır?", options: ["Sadece karasal", "Sadece Akdeniz", "Ilıman-karasal-Akdeniz", "Tropikal"], correct: 2 },
    { question: "Demokratik seçimlerde oy kullanma yaşı Türkiye'de kaçtır?", options: ["16", "17", "18", "21"], correct: 2 },
    { question: "Hangi buluş matbaanın yaygınlaşmasını sağlamıştır?", options: ["Arşimet", "Edison", "Gutenberg", "Newton"], correct: 2 },
  ],
};

export function getQuestions(subject: string, gradeLevel: string): Question[] {
  const isIlkokul = gradeLevel.startsWith("ILKOKUL");
  const levelKey = isIlkokul ? "ILKOKUL" : "ORTAOKUL";
  const key = `${subject}_${levelKey}`;
  return questions[key] ?? questions[`${subject}_ILKOKUL`] ?? [];
}
