# Meet linki üretimi: Takvim API fallback

## Sorun
Öğretmen randevuyu onaylarken `createMeetingSpace()` Meet REST API `spaces.create` çağırıyor. Kasım 2026'da çağrı
`403 PERMISSION_DENIED` veriyor (iki farklı hesapla alınan token'la da). Fonksiyon hatayı yutup `null` döndürdüğü için
onay sessizce linksiz tamamlanıyor, cron da gönderecek link bulamıyor.

## Karar
Link üretimi iki kademeli olur:
1. Meet REST API (`accessType: OPEN`) — çalışırsa tercih edilir.
2. Başarısızsa Google Takvim `events.insert` + `conferenceData` (`hangoutsMeet`) → `hangoutLink`.

Tek refresh token iki scope ile alınır: `meetings.space.created` + `calendar.events`.

## Takvim yolu ayrıntıları
- Etkinlik, token sahibi hesabın birincil takviminde açılır; zaman: slot tarihi + saat, Türkiye `+03:00`.
- Katılımcı olarak veli ve öğretmen e-postaları eklenir, `sendUpdates: "none"` (ekstra davet maili gitmez).
- Takvim yolunda `accessType: OPEN` ayarlanamaz. Davetli hesaplarla girenler doğrudan katılır; farklı hesapla
  girenler oda sahibinden onay bekleyebilir. (Bilinen takas.)

## Başarısızlık görünürlüğü
Her iki yol da başarısız olursa `console.error` ile loglanır ve `null` döner (mevcut davranış korunur).
Admin bildirimi ve cron'da eksik linki yeniden üretme ayrı iş olarak konuşulacak.

## Kapsam dışı
- Admin uyarısı, cron'da yeniden üretme, geçmiş rezervasyonlara link yazma.
