# Öğretmen Başvuru Süreci — Eksiksiz Hale Getirme

Tarih: 24 Kasım 2026 · Durum: A, D, G onaylı/uygulanıyor; B, C, E, F, H, I sonra

## Bağlam
Öğretmen başvuruları Instagram reels sonrası artacak. Eski 7 bekleyen başvuru (11–153 gün) sonraya bırakıldı.
Odak: bundan sonra gelen başvuruların bilgileri tam olsun, süreç hiçbir adımda kopmasın.

## Bulgular (kodda doğrulandı)
1. Reddedilen öğretmene e-posta gitmiyor (yalnızca panel bildirimi). Onayda mail var.
2. Yeni başvuruda yöneticiye haber yok.
3. Eksik bilgisi olan öğretmenin tamamlama yolu yok (yeniden başvuru formu yalnız reddedilenlerde, yalnız belge).
4. Sözleşme onayı (tarih/sürüm) saklanmıyor.
5. Kayıt ve belge yükleme uçlarında rate limit yok.
6. E-posta doğrulaması yok.
7. **Öğretmenin ödeme alacağı IBAN'ı hiçbir yerde yok** (panel "%80 size ödenir" diyor; ödemeler haftalık).
8. Saatlik ücrete alt/üst sınır yok (yalnız > 0).
9. Onayda profil otomatik herkese açık oluyor; fotoğraf/unvan/tanıtım zorunlu değil.
10. Profil PATCH doğrulamasız: onaylı/bekleyen öğretmen ders, sınıf, ücret, deneyim, telefonu kural dışı değiştirebilir.
11. Bekleyen öğretmen ders/takvim API'lerini kullanabiliyor.

## Bu turda uygulananlar
**A. Haber akışı**
- Yeni öğretmen başvurusu → yöneticilere panel bildirimi + e-posta (`notifyAdmins`).
- Red → öğretmene e-posta (sebep + yeniden başvuru yolu). Onay/red yalnızca durum gerçekten değiştiyse mail/bildirim gönderir (tekrar basma = çift mail yok).

**D. Rate limit** (kalıcı, Vercel çok örnekli olduğu için veritabanı tabanlı)
- Kayıt: IP başına 5 / saat. Belge yükleme: IP başına 15 / saat. Aşılırsa 429 + anlaşılır mesaj.

**G. Öğretmen IBAN'ı** (haftalık ödeme için)
- `Educator.iban`, `Educator.ibanHolderName`.
- Kayıtta zorunlu (TR + 24 hane, mod-97 doğrulamalı, hesap sahibi adı).
- Onay için zorunlu (eksikse onaylanamaz).
- Öğretmen panelinde Profilim'de "Ödeme Bilgileri" kartı (maskeli gösterim, değiştir/sil yok-sadece değiştir); IBAN'ı olmayan onaylı öğretmene ana sayfada uyarı.
- Admin öğretmen detayında IBAN görünür (haftalık ödeme için).
- Kartın altında: "Ödemeler haftalık olarak bu hesaba yapılır. IBAN değişirse buradan güncelleyin."

## Sonraya (onay sırası: B, H, I → C, E, F)
B bilgi tamamlama formu · H profil tamlık kontrolü · I ücret sınırı (sınır kararı bekleniyor) · C sözleşme kaydı · E e-posta iki kez · F sunucuda durum/branş kontrolleri (madde 10–11).

## Doğrulama
tsc + lint + build; IBAN geçerli/geçersiz; rate limit aşım ve sıfırlanma; reddetme/onay çift mail kontrolü; admin detayda IBAN görünümü.
