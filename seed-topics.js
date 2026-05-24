const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const curriculumData = [
  // MATEMATIK - 1. Sınıf
  { subject: "MATEMATIK", grade: 1, name: "Doğal Sayılar (0-10)", description: "10'a kadar sayıları tanır ve yazılı şekilleri bilir" },
  { subject: "MATEMATIK", grade: 1, name: "Toplama İşlemi", description: "10'a kadar toplama yapar" },
  { subject: "MATEMATIK", grade: 1, name: "Çıkarma İşlemi", description: "10'a kadar çıkarma yapar" },
  { subject: "MATEMATIK", grade: 2, name: "Doğal Sayılar (0-100)", description: "100'e kadar sayıları tanır ve basamak değerini bilir" },
  { subject: "MATEMATIK", grade: 2, name: "İki Basamaklı Sayılar", description: "İki basamaklı sayılarda onlar ve birler basamağını ayırır" },
  { subject: "MATEMATIK", grade: 2, name: "Toplama ve Çıkarma", description: "100'e kadar toplama ve çıkarma yapar" },
  { subject: "MATEMATIK", grade: 3, name: "Doğal Sayılar (0-1000)", description: "1000'e kadar sayıları tanır ve basamak değerini bilir" },
  { subject: "MATEMATIK", grade: 3, name: "Üç Basamaklı Sayılar", description: "Sayıları yüzler, onlar ve birler basamağına ayırır" },
  { subject: "MATEMATIK", grade: 3, name: "Çarpma İşlemi", description: "10'a kadar çarpma işlemi yapar" },
  { subject: "MATEMATIK", grade: 4, name: "Dört Basamaklı Sayılar", description: "10000'e kadar sayıları tanır ve basamak değerini bilir" },
  { subject: "MATEMATIK", grade: 4, name: "Çarpma ve Bölme", description: "Doğal sayılarla çarpma ve bölme işlemi yapar" },
  { subject: "MATEMATIK", grade: 5, name: "Kesirler", description: "Kesri tanır ve kesir modelleri oluşturur" },
  { subject: "MATEMATIK", grade: 5, name: "Ondalık Sayılar", description: "Ondalık gösterimleri açıklayıp okur ve yazar" },
  { subject: "MATEMATIK", grade: 6, name: "Oran ve Orantı", description: "Oran ve orantı ilişkisini açıklayıp problemleri çözer" },
  { subject: "MATEMATIK", grade: 6, name: "Yüzde Hesaplaması", description: "Yüzde konusu ve işlemleri" },
  { subject: "MATEMATIK", grade: 7, name: "Tam Sayılar", description: "Tam sayıların tanısı ve işlemleri" },
  { subject: "MATEMATIK", grade: 7, name: "Cebirsel İfadeler", description: "Cebirsel ifadeleri açıklayıp basitleştirir" },
  { subject: "MATEMATIK", grade: 8, name: "Üslü İfadeler", description: "Üslü ifadeleri açıklayıp işlem yapar" },
  { subject: "MATEMATIK", grade: 8, name: "Köklü Sayılar", description: "Karekök kavramını açıklayıp işlem yapar" },
  // TÜRKÇE
  { subject: "TURKCE", grade: 1, name: "Harf Tanıma", description: "Harfleri tanır ve yazılı şekilleri bilir" },
  { subject: "TURKCE", grade: 1, name: "Hece Oluşturma", description: "Heceler oluşturup kelimeler yazabilir" },
  { subject: "TURKCE", grade: 1, name: "Basit Okuma", description: "Basit metinleri okur ve anlar" },
  { subject: "TURKCE", grade: 2, name: "Kelime Öğrenme", description: "Yeni kelimeleri öğrenir ve kullanır" },
  { subject: "TURKCE", grade: 2, name: "Basit Metin Anlama", description: "Metni okur ve soruları cevaplar" },
  { subject: "TURKCE", grade: 3, name: "Okuma Anlama", description: "Metni okur, anlar ve sorulara cevap verir" },
  { subject: "TURKCE", grade: 3, name: "Kelime Türleri", description: "İsim, fiil gibi kelime türlerini tanır" },
  { subject: "TURKCE", grade: 4, name: "Metin Çeşitleri", description: "Farklı metin türlerini tanır ve inceler" },
  { subject: "TURKCE", grade: 4, name: "Yazılı Anlatım", description: "Basit yazılar yazar ve kontrol eder" },
  { subject: "TURKCE", grade: 5, name: "Metin Analizi", description: "Metni analiz eder ve yorum yapabilir" },
  { subject: "TURKCE", grade: 5, name: "Cümle Yapısı", description: "Cümle türlerini ve yapısını öğrenir" },
  { subject: "TURKCE", grade: 6, name: "Edebiyat Türleri", description: "Şiir, hikaye, roman gibi edebiyat türlerini inceler" },
  { subject: "TURKCE", grade: 6, name: "Yazım Kuralları", description: "Türkçe yazım ve noktalama kuralları" },
  { subject: "TURKCE", grade: 7, name: "İmla ve Dilbilgisi", description: "Geniş imla ve dilbilgisi konuları" },
  { subject: "TURKCE", grade: 7, name: "Edebi Sanat", description: "Metafor, benzetme gibi edebi sanat öğeleri" },
  { subject: "TURKCE", grade: 8, name: "Edebiyat Tarihi", description: "Türk edebiyatı tarihinin dönemleri" },
  { subject: "TURKCE", grade: 8, name: "Metin Yorumlama", description: "Edebiyat metinlerini derinlemesine inceler" },
  // FEN BİLİMLERİ
  { subject: "FEN_BILIMLERI", grade: 1, name: "Canlı Olmayan Varlıklar", description: "Taş, toprak gibi canlı olmayan varlıkları tanır" },
  { subject: "FEN_BILIMLERI", grade: 1, name: "Canlı Varlıklar", description: "Bitki ve hayvanları tanır ve fark eder" },
  { subject: "FEN_BILIMLERI", grade: 2, name: "Canlı Türleri", description: "Çeşitli canlı türlerini sınıflandırır" },
  { subject: "FEN_BILIMLERI", grade: 2, name: "Doğa Olayları", description: "Mevsimler ve hava olaylarını gözlemler" },
  { subject: "FEN_BILIMLERI", grade: 3, name: "Yaşayan Organizmalar", description: "Canlıların yapısını ve yaşam döngüsünü tanır" },
  { subject: "FEN_BILIMLERI", grade: 3, name: "Madde Türleri", description: "Katı, sıvı ve gaz halini tanır" },
  { subject: "FEN_BILIMLERI", grade: 4, name: "Isı ve Işık", description: "Isı ve ışık olaylarını gözlemler" },
  { subject: "FEN_BILIMLERI", grade: 4, name: "Elektrik", description: "Basit elektrik devreleri oluşturur" },
  { subject: "FEN_BILIMLERI", grade: 5, name: "Hücre Yapısı", description: "Hücrenin yapısını ve görevini öğrenir" },
  { subject: "FEN_BILIMLERI", grade: 5, name: "Kuvvet ve Hareket", description: "Kuvvet, hız ve ivme kavramlarını tanır" },
  { subject: "FEN_BILIMLERI", grade: 6, name: "Biyoloji", description: "Yaşayan varlıkların ortak özellikleri" },
  { subject: "FEN_BILIMLERI", grade: 6, name: "Kimya Temelleri", description: "Elementler ve bileşikleri tanır" },
  { subject: "FEN_BILIMLERI", grade: 7, name: "Genetik ve Evrim", description: "Genetik kalıtım ve evrim teorisi" },
  { subject: "FEN_BILIMLERI", grade: 7, name: "Fizyoloji", description: "İnsan vücudunun yapısı ve fonksiyonları" },
  { subject: "FEN_BILIMLERI", grade: 8, name: "Kimya", description: "Kimyasal reaksiyonlar ve denge" },
  { subject: "FEN_BILIMLERI", grade: 8, name: "Fizik", description: "Enerji, basınç ve hareket gibi konular" },
  // SOSYAL BİLGİLER
  { subject: "SOSYAL_BILGILER", grade: 1, name: "Aile ve Ev", description: "Aile yapısı ve ev ortamını tanır" },
  { subject: "SOSYAL_BILGILER", grade: 1, name: "Okul", description: "Okul ortamını ve okuldaki görevleri tanır" },
  { subject: "SOSYAL_BILGILER", grade: 2, name: "Toplum Tanıtımı", description: "Yaşadığı toplumu ve farklı meslekleri tanır" },
  { subject: "SOSYAL_BILGILER", grade: 2, name: "Yerel Yönetim", description: "Muhtarı ve yerel yönetimi tanır" },
  { subject: "SOSYAL_BILGILER", grade: 3, name: "Türkiye Coğrafyası", description: "Türkiye'nin coğrafyasını tanır" },
  { subject: "SOSYAL_BILGILER", grade: 3, name: "Türkiye Tarihi", description: "Türkiye tarihinin önemli olayları" },
  { subject: "SOSYAL_BILGILER", grade: 4, name: "Osmanlı Tarihi", description: "Osmanlı İmparatorluğunun tarihçesi" },
  { subject: "SOSYAL_BILGILER", grade: 4, name: "Harita Okuma", description: "Harita türlerini tanır ve okur" },
  { subject: "SOSYAL_BILGILER", grade: 5, name: "Coğrafya Temelleri", description: "Dünya coğrafyasının temel konuları" },
  { subject: "SOSYAL_BILGILER", grade: 5, name: "Insanlık Tarihi", description: "İnsanlık tarihinin genel akışı" },
  { subject: "SOSYAL_BILGILER", grade: 6, name: "Eski Medeniyetler", description: "Eski Mısır, Mezopotamya gibi medeniyetler" },
  { subject: "SOSYAL_BILGILER", grade: 6, name: "Ortaçağ", description: "Ortaçağ döneminin tarihi" },
  { subject: "SOSYAL_BILGILER", grade: 7, name: "Yeniçağ", description: "Yeniçağ dönemi ve gelişmeleri" },
  { subject: "SOSYAL_BILGILER", grade: 7, name: "Coğrafya Bölgeleri", description: "Dünya'nın coğrafyasında bölgeler" },
  { subject: "SOSYAL_BILGILER", grade: 8, name: "Modern Tarih", description: "19. yüzyıl ve modern dönem tarihçesi" },
  { subject: "SOSYAL_BILGILER", grade: 8, name: "İnsanlar ve Kaynaklar", description: "Doğal kaynaklar ve insan faaliyetleri" },
  // İNGİLİZCE
  { subject: "INGILIZCE", grade: 1, name: "Alphabet", description: "İngilizce alfabesini tanır" },
  { subject: "INGILIZCE", grade: 1, name: "Greeting", description: "Selamlaşma ifadeleri" },
  { subject: "INGILIZCE", grade: 2, name: "Numbers", description: "Sayıları İngilizce öğrenir" },
  { subject: "INGILIZCE", grade: 2, name: "Family", description: "Aile üyelerini İngilizce tanır" },
  { subject: "INGILIZCE", grade: 3, name: "Colors", description: "Renkleri İngilizce tanır" },
  { subject: "INGILIZCE", grade: 3, name: "Animals", description: "Hayvanları İngilizce öğrenir" },
  { subject: "INGILIZCE", grade: 4, name: "Simple Present", description: "Simple Present tense yapısı" },
  { subject: "INGILIZCE", grade: 4, name: "Vocabulary", description: "Günlük kelimeler ve ifadeler" },
  { subject: "INGILIZCE", grade: 5, name: "Present Continuous", description: "Şimdiki zaman yapısı" },
  { subject: "INGILIZCE", grade: 5, name: "Past Simple", description: "Geçmiş zaman yapısı" },
  { subject: "INGILIZCE", grade: 6, name: "Future Tense", description: "Gelecek zaman yapısı" },
  { subject: "INGILIZCE", grade: 6, name: "Reading Comprehension", description: "Metin okuma ve anlama" },
  { subject: "INGILIZCE", grade: 7, name: "Modal Verbs", description: "Can, could, will, would gibi yardımcı fiiller" },
  { subject: "INGILIZCE", grade: 7, name: "Complex Sentences", description: "Karmaşık cümle yapıları" },
  { subject: "INGILIZCE", grade: 8, name: "Advanced Grammar", description: "İleri seviye dilbilgisi" },
  { subject: "INGILIZCE", grade: 8, name: "Writing Skills", description: "Yazılı anlatım becerisi" },
];

async function main() {
  console.log("🌱 Curriculum topics seed başladı...");

  try {
    const deleted = await prisma.curriculumTopic.deleteMany({});
    console.log(`Deleted ${deleted.count} existing topics`);

    for (const topic of curriculumData) {
      await prisma.curriculumTopic.create({
        data: {
          subject: topic.subject,
          gradeLevel: topic.grade,
          name: topic.name,
          description: topic.description,
        },
      });
    }

    const count = await prisma.curriculumTopic.count();
    console.log(`✅ ${count} konu başarıyla eklendi!`);
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
