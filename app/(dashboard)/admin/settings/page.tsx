export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ayarlar</h1>
        <p className="text-gray-500">Platform ayarlarını yönetin</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">iyzico Ödeme Entegrasyonu</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm font-medium">⚙️ iyzico API anahtarları henüz tanımlanmamış</p>
          <p className="text-yellow-700 text-sm mt-1">
            Canlı ödemeleri aktif etmek için <code className="bg-yellow-100 px-1 rounded">.env.local</code> dosyasına
            IYZICO_API_KEY ve IYZICO_SECRET_KEY değerlerini ekleyin.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Platform Bilgileri</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex justify-between py-2 border-b">
            <span>Platform Adı</span>
            <span className="font-medium text-gray-900">Öğretmen Yanımda</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span>Versiyon</span>
            <span className="font-medium text-gray-900">1.0.0</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Veritabanı</span>
            <span className="text-green-600 font-medium">✅ Bağlı (Supabase)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
