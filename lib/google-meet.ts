import { google } from "googleapis";

// Yol B: OAuth2 + refresh token. Tek bir Google hesabı adına, her ders için
// benzersiz Meet odası açar. (Servis hesabı Meet odası açamadığı için bu yöntem.)
const CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

const MEET_ENABLED = !!CLIENT_ID && !!CLIENT_SECRET && !!REFRESH_TOKEN;

export async function createMeetingSpace(): Promise<string | null> {
  if (!MEET_ENABLED) {
    console.warn("Google Meet OAuth ayarlanmamış (CLIENT_ID/SECRET/REFRESH_TOKEN), meetingUrl atlandı.");
    return null;
  }

  try {
    const oauth2 = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
    oauth2.setCredentials({ refresh_token: REFRESH_TOKEN });

    const meet = google.meet({ version: "v2", auth: oauth2 });
    // accessType OPEN: linki olan herkes (öğretmen/veli) düzenleyen onayı beklemeden girer.
    // (Varsayılan TRUSTED, oda sahibi hesap toplantıda olmadığı için katılımcıları "kapıda" bırakıyordu.)
    const res = await meet.spaces.create({
      requestBody: { config: { accessType: "OPEN", entryPointAccess: "ALL" } },
    });

    return res.data.meetingUri ?? null;
  } catch (err) {
    console.error("Google Meet oda oluşturulamadı:", err);
    return null;
  }
}
