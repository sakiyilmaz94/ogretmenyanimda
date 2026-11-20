import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * Kimlik, diploma ve sertifika gibi kişisel belgeler HERKESE AÇIK olmayan "private-docs" klasöründe tutulur.
 * Dosyaya yalnızca sunucu (admin yetkisiyle) kısa ömürlü imzalı bir bağlantı üretip erişir.
 */
export const PRIVATE_BUCKET = "private-docs";

const PATH_RE = /^registration\/(diploma|idcard|coaching)\/[A-Za-z0-9._-]+$/;

/** Veritabanındaki değer yeni biçimde bir yol ("registration/idcard/x.png") ya da eski biçimde
 *  herkese açık tam adres olabilir; ikisinden de güvenli yolu çıkarır. Geçersizse null döner. */
export function toPrivatePath(value: string | null | undefined): string | null {
  if (!value) return null;
  let p = value.trim();
  const m = p.match(/\/storage\/v1\/object\/(?:public|sign)\/(?:uploads|private-docs)\/([^?#]+)/);
  if (m) p = decodeURIComponent(m[1]);
  return PATH_RE.test(p) ? p : null;
}

/** 2 dakika geçerli imzalı bağlantı üretir. */
export async function signedDocUrl(value: string | null | undefined, seconds = 120): Promise<string | null> {
  const path = toPrivatePath(value);
  if (!path) return null;
  const { data, error } = await supabaseAdmin.storage.from(PRIVATE_BUCKET).createSignedUrl(path, seconds);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}
