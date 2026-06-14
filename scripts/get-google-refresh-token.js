/**
 * Google Meet için tek seferlik "refresh token" alır (Yol B).
 *
 * Önce .env.local içine şunları ekle:
 *   GOOGLE_OAUTH_CLIENT_ID=...
 *   GOOGLE_OAUTH_CLIENT_SECRET=...
 * Google Cloud'da OAuth client'ın "Authorized redirect URIs" listesine
 * şunu ekle:  http://localhost:5555
 *
 * Çalıştır:  node --env-file=.env.local scripts/get-google-refresh-token.js
 * Açılan URL'yi tarayıcıda onayla; terminale REFRESH TOKEN yazılır.
 */
const http = require("http");
const { google } = require("googleapis");

const CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
const REDIRECT = "http://localhost:5555";
const SCOPE = ["https://www.googleapis.com/auth/meetings.space.created"];

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("GOOGLE_OAUTH_CLIENT_ID ve GOOGLE_OAUTH_CLIENT_SECRET tanımlı değil (.env.local).");
  process.exit(1);
}

const oauth2 = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT);
const url = oauth2.generateAuthUrl({ access_type: "offline", prompt: "consent", scope: SCOPE });

console.log("\n1) Şu URL'yi tarayıcıda aç ve Google hesabınla onay ver:\n");
console.log(url + "\n");

const server = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, REDIRECT);
    const code = u.searchParams.get("code");
    if (!code) { res.statusCode = 400; res.end("Kod bulunamadı."); return; }
    const { tokens } = await oauth2.getToken(code);
    res.end("Tamam! Terminale dönebilirsin. Bu sekmeyi kapat.");
    if (tokens.refresh_token) {
      console.log("\n✅ REFRESH TOKEN (bunu Vercel + .env.local'e GOOGLE_OAUTH_REFRESH_TOKEN olarak ekle):\n");
      console.log(tokens.refresh_token + "\n");
    } else {
      console.log("\n⚠️ refresh_token gelmedi. Google hesabında uygulamanın erişimini kaldırıp tekrar dene (prompt=consent zaten ekli).\n");
    }
    server.close();
    process.exit(0);
  } catch (e) {
    res.statusCode = 500; res.end("Hata: " + e.message);
    console.error(e); server.close(); process.exit(1);
  }
});
server.listen(5555, () => console.log("2) localhost:5555 dinleniyor — onay sonrası otomatik yakalanacak..."));
