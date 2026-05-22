export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="font-display text-headline-md text-on-background">Ayarlar</h1>
        <p className="text-label-md text-on-surface-variant mt-0.5">Platform ayarlarını yönetin</p>
      </div>

      <div className="bg-surface-container-lowest rounded-md soft-card-static border border-outline-variant/20 p-6 space-y-4">
        <h2 className="font-display text-headline-md text-on-background">iyzico Ödeme Entegrasyonu</h2>
        <div className="bg-tertiary-fixed/60 border border-outline-variant/20 rounded-lg p-4">
          <p className="text-body-md text-on-tertiary-fixed font-medium">iyzico API anahtarları henüz tanımlanmamış</p>
          <p className="text-body-md text-on-tertiary-fixed mt-1">
            Canlı ödemeleri aktif etmek için <code className="bg-tertiary-fixed px-1 rounded font-mono text-caption">.env.local</code> dosyasına
            IYZICO_API_KEY ve IYZICO_SECRET_KEY değerlerini ekleyin.
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-md soft-card-static border border-outline-variant/20 p-6 space-y-4">
        <h2 className="font-display text-headline-md text-on-background">Platform Bilgileri</h2>
        <div className="space-y-0 text-body-md divide-y divide-outline-variant/20">
          <div className="flex justify-between py-3">
            <span className="text-on-surface-variant">Platform Adı</span>
            <span className="font-medium text-on-background">Öğretmen Yanımda</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-on-surface-variant">Versiyon</span>
            <span className="font-medium text-on-background">1.0.0</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-on-surface-variant">Veritabanı</span>
            <span className="bg-secondary-container text-on-secondary-container px-3 py-0.5 rounded-full text-caption font-semibold">Bağlı (Supabase)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
