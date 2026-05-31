const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

const QUESTIONS_DATA = [
  {
    tema: 1,
    temaAdi: "Nesnelerin Geometrisi",
    sorular: [
      { soru: "Küp görseline benzeyen nesnelere çevrenizden bir örnek veriniz.", cevap: "Zekâ küpü, hediye paketi, zar vb.", zorluk: "easy" },
      { soru: "0, 1, 3 ve 0 numaralı noktaları sırasıyla birleştirdiğimizde, 3 köşesi olan hangi geometrik şekil oluşur?", cevap: "Üçgen şekli oluştur.", zorluk: "medium" },
      { soru: "Kare prizma görseline benzeyen bir nesne yazınız.", cevap: "İlaç kutusu, zeytinyağı kutusu, buzdolabı vb.", zorluk: "easy" },
      { soru: "Sıvıları ölçmek için kullanılan standart olmayan ölçme araçlarına (kaplara) üç örnek veriniz.", cevap: "Bardak, sürahi, kova, kepçe, fincan.", zorluk: "medium" },
      { soru: "İçi su dolu bir sürahideki suyu, bir bardağa mı yoksa bir kovaya mı boşaltırsak su taşabilir?", cevap: "Bardak gibi küçük kaplara koyarsak su taşabilir.", zorluk: "medium" },
      { soru: "Dikdörtgen prizma görseline benzeyen nesnelere bir örnek veriniz.", cevap: "Kibrit kutusu, silgi, kitap vb.", zorluk: "easy" },
      { soru: "15, 20, 25, 30 ve 15 noktalarını sırasıyla birleştirerek dört kenarı olan bir şekil elde edilmektedir. Bu şekil ne olabilir?", cevap: "Kare veya dikdörtgen.", zorluk: "hard" },
      { soru: "Üçgen prizma görseline benzeyen bir eşya örneği veriniz.", cevap: "Çadır, üçgen peynir kutusu, çatı vb.", zorluk: "easy" },
      { soru: "Eş büyüklükteki iki boş kovadan birini su dolu bir bardakla, diğerini ise su dolu bir kepçeyle doldurmaya çalışıyoruz. Kepçe daha büyük olduğuna göre, hangi kova daha çabuk dolar?", cevap: "Kepçe ile doldurulan kova daha çabuk dolar çünkü kepçe bardaktan büyüktür.", zorluk: "hard" },
      { soru: "Sıvı miktarını tahmin ederken, büyük bir şişedeki suyun mu yoksa küçük bir şişedeki suyun mu daha fazla bardak dolduracağını söyleriz?", cevap: "Büyük şişedeki su daha fazla bardak doldurur.", zorluk: "medium" }
    ]
  },
  {
    tema: 2,
    temaAdi: "Sayılar",
    sorular: [
      { soru: "80 ile 100 arasında olan ve okunuşu altı harfli ('doksan') olan bir sayı yazınız.", cevap: "Doksan (90)", zorluk: "medium" },
      { soru: "4 onluk ve 6 birlikten oluşan sayı kaçtır?", cevap: "46 (Kırk altı)", zorluk: "easy" },
      { soru: "45 sayısı onluğa yuvarlandığında 40'a mı yoksa 50'ye mi daha yakındır?", cevap: "50'ye daha yakındır", zorluk: "medium" },
      { soru: "18 ile 22 arasında bulunan ve okunuşu beş harfli olan sayı hangisidir?", cevap: "20 (Yirmi)", zorluk: "easy" },
      { soru: "5, 10, 15, ... şeklinde devam eden beşer ritmik saymada 15'ten sonra hangi sayı gelir?", cevap: "20", zorluk: "easy" },
      { soru: "Rüzgâr, kumbarasına pazartesi günü 3 TL, salı günü 5 TL, çarşamba günü 7 TL koymuştur. Perşembe günü kaç TL koymalıdır?", cevap: "9 TL", zorluk: "hard" },
      { soru: "10, 20, 30, 40, ... şeklinde ileriye doğru onar ritmik saydığımızda 40'tan sonra hangi sayı gelir?", cevap: "50", zorluk: "easy" },
      { soru: "4'ten başlayıp 28'e kadar ileriye doğru üçer ritmik sayarken 13'ten sonra hangi sayıyı söyleriz?", cevap: "16", zorluk: "hard" },
      { soru: "72 sayısının içinde kaç onluk ve kaç birlik vardır?", cevap: "7 onluk, 2 birlik", zorluk: "medium" },
      { soru: "25'ten başlayıp 1'e kadar geriye doğru üçer ritmik saydığımızda, 25'ten hemen sonra hangi sayıyı söyleriz?", cevap: "22", zorluk: "medium" }
    ]
  },
  {
    tema: 3,
    temaAdi: "İşlemlerden Cebirsel Düşünmeye",
    sorular: [
      { soru: "Ali'nin 8 bilyesi vardır. 7 bilye daha alırsa toplam kaç bilyesi olur?", cevap: "15 bilye", zorluk: "easy" },
      { soru: "Esra'nın 5 portakalı vardı. 4 portakalını arkadaşlarına verdi. Kaç portakalı kaldı?", cevap: "1 portakal", zorluk: "easy" },
      { soru: "Semih 10 yaşındadır. Kardeşi Semih'ten 4 yaş küçük olduğuna göre kardeşinin yaşı kaçtır?", cevap: "6 yaş", zorluk: "easy" },
      { soru: "Atatürk İlkokulundan 38, Cumhuriyet İlkokulundan 25 öğrenci ziyarete gitmiştir. Toplam kaç öğrenci gitmiştir?", cevap: "63 öğrenci", zorluk: "medium" },
      { soru: "Seda'nın 58 TL'si vardır. Tanesi 22 TL olan mamalarından 2 paket alırsa, geriye kaç lirası kalır?", cevap: "14 TL", zorluk: "hard" },
      { soru: "Feyyaz'ın kumbarasındaki 32 TL'nin 27 TL'sine kalem almıştır. Kumbarasında kaç lirası kalmıştır?", cevap: "5 TL", zorluk: "medium" },
      { soru: "Gönül, 3 düzine çiçek fidesi satın aldı. Bir destesini dikte. Henüz dikmediği kaç fidesi kaldı?", cevap: "26 fide", zorluk: "hard" },
      { soru: "Merve'nin pastasında 13 mavi, 16 kırmızı mum vardı. 18 tanesi söndü. Sönmeyen kaç mum kaldı?", cevap: "11 mum", zorluk: "hard" },
      { soru: "Birinci toplanan 15, toplam 49 ise ikinci toplananı bulmak için hangi işlemi yapmalıyız?", cevap: "49 - 15 = 34", zorluk: "hard" },
      { soru: "Çıkarma işleminde eksileni bulmak için, çıkan ile fark arasında hangi işlemi yapmamız gerekir?", cevap: "Toplama", zorluk: "hard" }
    ]
  }
];

async function main() {
  console.log("🚀 2. Sınıf Matematik Soruları Seed Başladı\n");

  let totalInserted = 0;

  for (const data of QUESTIONS_DATA) {
    console.log(`📚 ${data.temaAdi} (Tema ${data.tema})`);

    // Topic bulsa ya da oluştur
    let topic = await db.curriculumTopic.findFirst({
      where: {
        gradeLevel: 2,
        subject: "MATEMATIK",
        name: data.temaAdi
      }
    });

    if (!topic) {
      topic = await db.curriculumTopic.create({
        data: {
          gradeLevel: 2,
          subject: "MATEMATIK",
          name: data.temaAdi,
          description: `${data.temaAdi} - Tema ${data.tema}`
        }
      });
    }

    console.log(`   ✓ Topic: ${topic.id}`);

    // Soruları insert et
    for (let i = 0; i < data.sorular.length; i++) {
      const q = data.sorular[i];
      try {
        await db.levelAssessmentQuestion.create({
          data: {
            topicId: topic.id,
            gradeLevel: 2,
            subject: "MATEMATIK",
            topicName: data.temaAdi,
            question: q.soru,
            option1: q.cevap,
            option2: "",
            option3: "",
            option4: "",
            correctAnswer: 0,
            difficulty: q.zorluk
          }
        });

        totalInserted++;
        console.log(`   ✓ Soru ${i + 1}`);
      } catch (e) {
        console.log(`   ⊘ Soru ${i + 1}: ${e.message}`);
      }
    }

    console.log();
  }

  console.log("=".repeat(60));
  console.log(`✅ SEED TAAAAMAMLANDı! ${totalInserted} soru eklendi`);

  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
