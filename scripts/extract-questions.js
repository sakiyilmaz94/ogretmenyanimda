/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

// Parse Grade 3 questions
console.log("📖 Grade 3 soruları işleniyor...");
const grade3Data = JSON.parse(fs.readFileSync("sinavlar/3 sinif", "utf-8"));

// Separate by subject
const grade3Math = grade3Data.filter(q => q.subject === "Matematik");
const grade3Science = grade3Data.filter(q => q.subject === "Fen Bilimleri");

// Convert "A)", "B)", etc to just text
const cleanQuestion = (q) => ({
  ...q,
  option1: q.option1?.replace(/^[A-Z]\)\s*/, "") || "",
  option2: q.option2?.replace(/^[A-Z]\)\s*/, "") || "",
  option3: q.option3?.replace(/^[A-Z]\)\s*/, "") || "",
  option4: q.option4?.replace(/^[A-Z]\)\s*/, "") || "",
  theme: q.unit // Use unit as theme
});

const grade3MathCleaned = grade3Math.map(cleanQuestion);
const grade3ScienceCleaned = grade3Science.map(cleanQuestion);

fs.writeFileSync("grade3-math.json", JSON.stringify(grade3MathCleaned, null, 2));
fs.writeFileSync("grade3-science.json", JSON.stringify(grade3ScienceCleaned, null, 2));

console.log(`✓ Grade 3 Matematik: ${grade3MathCleaned.length} soru`);
console.log(`✓ Grade 3 Fen Bilimleri: ${grade3ScienceCleaned.length} soru\n`);

// Parse Grade 4 questions
console.log("📖 Grade 4 soruları işleniyor...");
const grade4Data = JSON.parse(fs.readFileSync("sinavlar/4 sınıf", "utf-8"));

const grade4Math = grade4Data.filter(q => q.subject === "Matematik");
const grade4Science = grade4Data.filter(q => q.subject === "Fen Bilimleri");
const grade4Social = grade4Data.filter(q => q.subject === "Sosyal Bilgiler");

const grade4MathCleaned = grade4Math.map(cleanQuestion);
const grade4ScienceCleaned = grade4Science.map(cleanQuestion);
const grade4SocialCleaned = grade4Social.map(cleanQuestion);

fs.writeFileSync("grade4-math.json", JSON.stringify(grade4MathCleaned, null, 2));
fs.writeFileSync("grade4-science.json", JSON.stringify(grade4ScienceCleaned, null, 2));
fs.writeFileSync("grade4-social.json", JSON.stringify(grade4SocialCleaned, null, 2));

console.log(`✓ Grade 4 Matematik: ${grade4MathCleaned.length} soru`);
console.log(`✓ Grade 4 Fen Bilimleri: ${grade4ScienceCleaned.length} soru`);
console.log(`✓ Grade 4 Sosyal Bilgiler: ${grade4SocialCleaned.length} soru\n`);

console.log("✅ Tüm JSON dosyaları oluşturuldu!\n");
