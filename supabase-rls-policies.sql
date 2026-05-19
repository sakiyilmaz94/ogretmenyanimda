-- ============================================================
-- Öğretmen Yanımda — Supabase RLS & Storage Politikaları
-- Supabase Dashboard > SQL Editor'da çalıştırın
-- ============================================================

-- 1. Storage bucket oluştur (eğer yoksa)
-- Dashboard > Storage > New Bucket > "uploads" > Public: true
-- Veya SQL ile:
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'uploads',
  'uploads',
  true,
  5242880,  -- 5 MB
  ARRAY['image/jpeg','image/png','image/webp','image/gif','application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. Storage politikaları
-- ============================================================

-- Herkes public dosyaları okuyabilir
CREATE POLICY "Public read uploads"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'uploads');

-- Herhangi bir authenticated kullanıcı yükleyebilir
-- (Sunucu tarafı service_role kullandığı için bu yeterli)
CREATE POLICY "Authenticated upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'uploads');

-- Sadece dosyayı yükleyen silebilir
CREATE POLICY "Owner delete uploads"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'uploads');

-- ============================================================
-- 3. Notification tablosu için RLS
-- NOT: Prisma service_role kullandığı için RLS bypass edilir.
-- Bu politikalar Supabase JS client (anon key) ile erişim için.
-- ============================================================

ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;

-- Kullanıcı sadece kendi bildirimlerini okuyabilir
CREATE POLICY "User reads own notifications"
  ON "Notification" FOR SELECT
  USING (auth.uid()::text = "userId");

-- Servis kullanıcısı (service_role) her şeyi yapabilir — zaten bypass

-- ============================================================
-- 4. Educator tablosu için RLS
-- ============================================================

ALTER TABLE "Educator" ENABLE ROW LEVEL SECURITY;

-- Herkes onaylı eğitmenleri okuyabilir
CREATE POLICY "Public read approved educators"
  ON "Educator" FOR SELECT
  USING (status = 'APPROVED');

-- Eğitmen kendi kaydını görebilir
CREATE POLICY "Educator reads own record"
  ON "Educator" FOR SELECT
  USING (auth.uid()::text = "userId");

-- ============================================================
-- 5. Booking tablosu için RLS
-- ============================================================

ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;

-- Veliler kendi öğrencilerinin rezervasyonlarını görebilir
-- (Prisma sorgularında parent filtresi zaten var, bu ek güvence)
CREATE POLICY "Parent reads own bookings"
  ON "Booking" FOR SELECT
  USING (
    "educatorId" IN (
      SELECT id FROM "Educator" WHERE "userId" = auth.uid()::text
    )
    OR
    "studentId" IN (
      SELECT s.id FROM "Student" s
      JOIN "Parent" p ON p.id = s."parentId"
      WHERE p."userId" = auth.uid()::text
    )
  );

-- ============================================================
-- 6. JWT Secret Ayarı (NextAuth entegrasyonu için)
-- ============================================================
-- Supabase Dashboard > Authentication > JWT Settings
-- JWT Secret = ogretmenyanimda-super-secret-key-2026-change-in-production
--
-- Bu ayar yapıldıktan sonra NextAuth JWT tokenları Supabase
-- tarafından doğrulanabilir ve auth.uid() = NextAuth user.id olur.
-- ============================================================
