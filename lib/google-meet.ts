import { google } from "googleapis";

const MEET_ENABLED =
  !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
  !!process.env.GOOGLE_PRIVATE_KEY;

export async function createMeetingSpace(): Promise<string | null> {
  if (!MEET_ENABLED) {
    console.warn("Google Meet API ayarlanmamış, meetingUrl atlandı.");
    return null;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/meetings.space.created"],
    });

    const meet = google.meet({ version: "v2", auth });
    const res = await meet.spaces.create({ requestBody: {} });

    return res.data.meetingUri ?? null;
  } catch (err) {
    console.error("Google Meet oda oluşturulamadı:", err);
    return null;
  }
}
