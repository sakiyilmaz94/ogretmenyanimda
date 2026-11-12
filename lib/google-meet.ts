import { google } from "googleapis";

// Yol B: OAuth2 + refresh token. Tek bir Google hesabı adına, her ders için
// benzersiz Meet odası açar. (Servis hesabı Meet odası açamadığı için bu yöntem.)
const CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

const MEET_ENABLED = !!CLIENT_ID && !!CLIENT_SECRET && !!REFRESH_TOKEN;

export interface MeetingOptions {
  /** Slot tarihi, "YYYY-MM-DD" (Takvim yedek yolu için) */
  date?: string;
  /** "HH:MM" Türkiye saati */
  startTime?: string;
  endTime?: string;
  summary?: string;
  attendeeEmails?: string[];
}

function authClient() {
  const oauth2 = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
  oauth2.setCredentials({ refresh_token: REFRESH_TOKEN });
  return oauth2;
}

async function createViaMeetApi(): Promise<string | null> {
  const meet = google.meet({ version: "v2", auth: authClient() });
  // accessType OPEN: linki olan herkes (öğretmen/veli) düzenleyen onayı beklemeden girer.
  // (Varsayılan TRUSTED, oda sahibi hesap toplantıda olmadığı için katılımcıları "kapıda" bırakıyordu.)
  const res = await meet.spaces.create({
    requestBody: { config: { accessType: "OPEN", entryPointAccess: "ALL" } },
  });
  return res.data.meetingUri ?? null;
}

// Yedek yol: Takvim etkinliği + conferenceData → hangoutLink
async function createViaCalendar(opts: MeetingOptions): Promise<string | null> {
  if (!opts.date || !opts.startTime || !opts.endTime) return null;
  const calendar = google.calendar({ version: "v3", auth: authClient() });
  const res = await calendar.events.insert({
    calendarId: "primary",
    conferenceDataVersion: 1,
    sendUpdates: "none",
    requestBody: {
      summary: opts.summary ?? "Öğretmen Yanımda — Canlı Ders",
      start: { dateTime: `${opts.date}T${opts.startTime}:00+03:00`, timeZone: "Europe/Istanbul" },
      end: { dateTime: `${opts.date}T${opts.endTime}:00+03:00`, timeZone: "Europe/Istanbul" },
      attendees: (opts.attendeeEmails ?? []).filter(Boolean).map((email) => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: `oy-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    },
  });
  return res.data.hangoutLink ?? null;
}

export async function createMeetingSpace(opts: MeetingOptions = {}): Promise<string | null> {
  if (!MEET_ENABLED) {
    console.warn("Google Meet OAuth ayarlanmamış (CLIENT_ID/SECRET/REFRESH_TOKEN), meetingUrl atlandı.");
    return null;
  }

  try {
    const url = await createViaMeetApi();
    if (url) return url;
  } catch (err) {
    console.error("Meet API oda oluşturamadı, Takvim yedeğine geçiliyor:", err);
  }

  try {
    return await createViaCalendar(opts);
  } catch (err) {
    console.error("Takvim ile Meet linki de oluşturulamadı:", err);
    return null;
  }
}
