import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const GRADE2_MATH_QUESTIONS = [
  {
    tema: 1,
    temaadiı: "Nesnelerin Geometrisi",
    sorular: [
      {
        soru: "Küp görseline benzeyen nesnelere çevrenizden bir örnek veriniz.",
        cevap: "Zekâ küpü, hediye paketi, zar vb.",
        zorluk: "easy"
      },
      {
        soru: "0, 1, 3 ve 0 numaralı noktaları sırasıyla birleştirdiğimizde, 3 köşesi olan hangi geometrik şekil oluşur?",
        cevap: "Üçgen şekli oluşur.",
        zorluk: "medium"
      },
      {
        soru: "Kare prizma görseline benzeyen bir nesne yazınız.",
        cevap: "İlaç kutusu, zeytinyağı kutusu, buzdolabı vb.",
        zorluk: "easy"
      },
      {
        soru: "Sıvıları ölçmek için kullanılan standart olmayan ölçme araçlarına (kaplara) üç örnek veriniz.",
        cevap: "Bardak, sürahi, kova, kepçe, fincan.",
        zorluk: "medium"
      },
      {
        soru: "İçi su dolu bir sürahideki suyu, bir bardağa mı yoksa bir kovaya mı boşaltırsak su taşabilir?",
        cevap: "Bardak gibi küçük kaplara koyarsak su taşabilir.",
        zorluk: "medium"
      },
      {
        soru: "Dikdörtgen prizma görseline benzeyen nesnelere bir örnek veriniz.",
        cevap: "Kibrit kutusu, silgi, kitap vb.",
        zorluk: "easy"
      },
      {
        soru: "15, 20, 25, 30 ve 15 noktalarını sırasıyla birleştirerek dört kenarı olan bir şekil elde edilmektedir. Bu şekil ne olabilir?",
        cevap: "Kare veya dikdörtgen.",
        zorluk: "hard"
      },
      {
        soru: "Üçgen prizma görseline benzeyen bir eşya örneği veriniz.",
        cevap: "Çadır, üçgen peynir kutusu, çatı vb.",
        zorluk: "easy"
      },
      {
        soru: "Eş büyüklükteki iki boş kovadan birini su dolu bir bardakla, diğerini ise su dolu bir kepçeyle doldurmaya çalışıyoruz. Kepçe daha büyük olduğuna göre, hangi kova daha çabuk dolar?",
        cevap: "Kepçe ile doldurulan kova daha çabuk dolar çünkü kepçe bardaktan büyüktür.",
        zorluk: "hard"
      },
      {
        soru: "Sıvı miktarını tahmin ederken, büyük bir şişedeki suyun mu yoksa küçük bir şişedeki suyun mu daha fazla bardak dolduracağını söyleriz?",
        cevap: "Büyük şişedeki su daha fazla bardak doldurur.",
        zorluk: "medium"
      }
    ]
  },
  {
    tema: 2,
    temaadiı: "Sayılar",
    sorular: [
      {
        soru: "80 ile 100 arasında olan ve okunuşu altı harfli ('doksan') olan bir sayı yazınız.",
        cevap: "Doksan (90)",
        zorluk: "medium"
      },
      {
        soru: "4 onluk ve 6 birlikten oluşan sayı kaçtır?",
        cevap: "46 (Kırk altı)",
        zorluk: "easy"
      },
      {
        soru: "45 sayısı onluğa yuvarlandığında 40'a mı yoksa 50'ye mi daha yakındır?",
        cevap: "50'ye daha yakındır (Sonu 5 olan sayılar bir sonraki onluğa yuvarlanır).",
        zorluk: "medium"
      },
      {
        soru: "18 ile 22 arasında bulunan ve okunuşu beş harfli ('yirmi') olan sayı hangisidir?",
        cevap: "20 (Yirmi)",
        zorluk: "easy"
      },
      {
        soru: "5, 10, 15, ... şeklinde devam eden beşer ritmik saymada 15'ten sonra hangi sayı gelir?",
        cevap: "20",
        zorluk: "easy"
      },
      {
        soru: "Rüzgâr, kumbarasına pazartesi günü 3 TL, salı günü 5 TL, çarşamba günü 7 TL koymuştur. Bu örüntüye göre Rüzgâr perşembe günü kumbarasına kaç TL koymalıdır?",
        cevap: "9 TL (Sayılar 2'şer artmaktadır: 3, 5, 7, 9)",
        zorluk: "hard"
      },
      {
        soru: "10, 20, 30, 40, ... şeklinde ileriye doğru onar ritmik saydığımızda 40'tan sonra hangi sayı gelir?",
        cevap: "50",
        zorluk: "easy"
      },
      {
        soru: "4'ten başlayıp 28'e kadar ileriye doğru üçer ritmik sayarken 13'ten sonra hangi sayıyı söyleriz?",
        cevap: "16",
        zorluk: "hard"
      },
      {
        soru: "72 sayısının içinde kaç onluk ve kaç birlik vardır?",
        cevap: "7 onluk, 2 birlik vardır.",
        zorluk: "medium"
      },
      {
        soru: "25'ten başlayıp 1'e kadar geriye doğru üçer ritmik saydığımızda, 25'ten hemen sonra hangi sayıyı söyleriz?",
        cevap: "22",
        zorluk: "medium"
      }
    ]
  },
  {
    tema: 3,
    temaadiı: "İşlemlerden Cebirsel Düşünmeye",
    sorular: [
      {
        soru: "Ali'nin 8 bilyesi vardır. 7 bilye daha alırsa toplam kaç bilyesi olur?",
        cevap: "8 + 7 = 15 bilyesi olur.",
        zorluk: "easy"
      },
      {
        soru: "Esra'nın 5 portakalı vardı. 4 portakalını arkadaşlarına verdi. Esra'nın kaç portakalı kaldı?",
        cevap: "5 - 4 = 1 portakalı kaldı.",
        zorluk: "easy"
      },
      {
        soru: "Semih 10 yaşındadır. Kardeşi Semih'ten 4 yaş küçük olduğuna göre kardeşinin yaşı kaçtır?",
        cevap: "10 - 4 = 6 yaşındadır.",
        zorluk: "easy"
      },
      {
        soru: "Atatürk İlkokulundan 38, Cumhuriyet İlkokulundan 25 öğrenci Anıtkabir'e ziyarete gitmiştir. İki okuldan toplam kaç öğrenci gitmiştir?",
        cevap: "38 + 25 = 63 öğrenci.",
        zorluk: "medium"
      },
      {
        soru: "Seda'nın 58 TL'si vardır. Tanesi 22 TL olan kedi mamalarından 2 paket alırsa, Seda'nın geriye kaç lirası kalır?",
        cevap: "İki paket mama: 22 + 22 = 44 TL. Kalan para: 58 - 44 = 14 TL.",
        zorluk: "hard"
      },
      {
        soru: "Feyyaz, kumbarasındaki 32 TL'nin 27 TL'sine kalem almıştır. Feyyaz'ın kumbarasında kaç lirası kalmıştır?",
        cevap: "32 - 27 = 5 TL'si kalmıştır.",
        zorluk: "medium"
      },
      {
        soru: "Gönül, 3 düzine çiçek fidesi satın aldı. Bu fidelerin bir destesini bahçesine dikti. Gönül'ün henüz dikmediği kaç fidesi kaldı?",
        cevap: "3 düzine = 36 fide. 1 deste = 10 fide. Dikilmeyen fide: 36 - 10 = 26 fide.",
        zorluk: "hard"
      },
      {
        soru: "Merve'nin doğum günü pastasında 13 mavi, 16 kırmızı mum vardı. Merve üfleyince mumların 18 tanesi söndü. Sönmeyen kaç mum kaldı?",
        cevap: "Toplam mum: 13 + 16 = 29. Sönmeyen mum: 29 - 18 = 11 mum.",
        zorluk: "hard"
      },
      {
        soru: "Bir toplama işleminde birinci toplanan 15, toplam (sonuç) 49 ise ikinci toplananı bulmak için hangi işlemi yapmalıyız?",
        cevap: "Toplamdan birinci toplananı çıkarmalıyız (49 - 15 = 34).",
        zorluk: "hard"
      },
      {
        soru: "Bir çıkarma işleminde eksileni (en baştaki sayıyı) bulmak için, çıkan sayı ile fark (sonuç) arasında hangi işlemi yapmamız gerekir?",
        cevap: "Çıkan sayı ile farkı (sonucu) toplamalıyız.",
        zorluk: "hard"
      }
    ]
  }
];

export async function POST(req: Request) {
  try {
    console.log("🚀 2. Sınıf Matematik Soruları Insert Başladı");

    let insertedCount = 0;
    let skippedCount = 0;

    for (const tema of GRADE2_MATH_QUESTIONS) {
      // Topic'i bul veya oluştur
      let topic = await db.curriculumTopic.findFirst({
        where: {
          gradeLevel: 2,
          subject: "MATEMATIK",
          name: tema.temaadiı
        }
      });

      if (!topic) {
        console.log(`⊘ Tema '${tema.temaadiı}' bulunamadı. Konu oluşturuluyor...`);
        // Otomatik konu oluştur
        topic = await db.curriculumTopic.create({
          data: {
            gradeLevel: 2,
            subject: "MATEMATIK",
            name: tema.temaadiı,
            description: `${tema.temaadiı} - Tema ${tema.tema}`
          }
        });

        console.log(`✓ Tema ${tema.tema} konusu oluşturuldu.`);
      }

      // Soruları insert et
      for (let i = 0; i < tema.sorular.length; i++) {
        const q = tema.sorular[i];
        try {
          await db.levelAssessmentQuestion.create({
            data: {
              topicId: topic.id,
                gradeLevel: 2,
                subject: "MATEMATIK",
                topicName: tema.temaadiı,
                question: q.soru,
                option1: q.cevap,
                option2: "",
                option3: "",
                option4: "",
                correctAnswer: 0, // Cevap option1'de
                difficulty: q.zorluk
              }
            });
        insertedCount++;
        console.log(`   ✓ Soru ${i + 1}: "${q.soru.substring(0, 40)}..."`);
      } catch (e) {
        console.log(`   ⊘ Soru ${i + 1} hata: ${(e as Error).message}`);
        skippedCount++;
      }
    }

    console.log(`✓ Tema '${tema.temaadiı}' - ${tema.sorular.length} soru işlendi`);
    }

    console.log("\n" + "=".repeat(60));
    console.log(`✅ INSERT TAAAAMAMLANDı!`);
    console.log(`   Başarı: ${insertedCount} soru`);
    console.log(`   Hata: ${skippedCount} soru`);

    return NextResponse.json({
      success: true,
      inserted: insertedCount,
      skipped: skippedCount,
      message: `${insertedCount} soru sisteme eklendi`
    });
  } catch (error) {
    console.error("❌ Hata:", error);
    return NextResponse.json(
      { error: "Insert sırasında hata oluştu", details: String(error) },
      { status: 500 }
    );
  }
}
