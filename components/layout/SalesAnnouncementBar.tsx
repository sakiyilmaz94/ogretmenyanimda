import { isSalesOpen } from "@/lib/site-status";

/** Ders satışı kapalıyken sayfanın en üstünde görünen ince duyuru bandı. */
export default async function SalesAnnouncementBar() {
  if (await isSalesOpen()) return null;
  return (
    <div className="bg-primary text-on-primary text-center text-label-md font-semibold px-4 py-2">
      📚 Dersler çok yakında başlıyor! Ders satışı açıldığında kayıtlı e-posta adresinize haber vereceğiz.
    </div>
  );
}
