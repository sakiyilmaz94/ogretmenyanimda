import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (session) {
    const role = session.user.role;
    if (role === "ADMIN") redirect("/admin");
    if (role === "EDUCATOR") redirect("/educator");
    if (role === "PARENT") redirect("/parent");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-xl font-bold text-blue-700">Öğretmen Yanımda</div>
          <div className="flex gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-blue-700">
              Giriş Yap
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Kayıt Ol
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Çocuğunuzun Yanında <span className="text-blue-600">Uzman Öğretmen</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
          İlkokul ve ortaokul öğrencileri için bireysel ve grup dersleri.
          Alanında uzman öğretmenlerle randevu alın, çocuğunuzun başarısını takip edin.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
          >
            Hemen Başla
          </Link>
          <Link
            href="/egitmen-basvurusu"
            className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition"
          >
            Eğitmen Başvurusu
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Bireysel Dersler",
              desc: "Öğrencinin ihtiyacına göre özelleştirilmiş birebir eğitim.",
              icon: "👨‍🏫",
            },
            {
              title: "Grup Dersleri",
              desc: "Sosyal öğrenmeyi teşvik eden küçük gruplarla kaliteli eğitim.",
              icon: "👥",
            },
            {
              title: "Öğrenci Koçluğu",
              desc: "Motivasyon ve çalışma becerilerini geliştiren koçluk seansları.",
              icon: "🎯",
            },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
