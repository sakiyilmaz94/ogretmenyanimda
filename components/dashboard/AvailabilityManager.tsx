"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Slot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

const TIMES: string[] = [];
for (let h = 0; h < 24; h++) {
  for (const m of ["00", "30"]) {
    TIMES.push(`${String(h).padStart(2, "0")}:${m}`);
  }
}
TIMES.push("23:59");

const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const DAY_MAP = [1, 2, 3, 4, 5, 6, 0]; // JS getDay() values

export default function AvailabilityManager({
  educatorId,
  existingSlots,
}: {
  educatorId: string;
  existingSlots: Slot[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"single" | "weekly">("single");

  // Single
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  // Weekly
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [wStart, setWStart] = useState("09:00");
  const [wEnd, setWEnd] = useState("10:00");
  const [weeks, setWeeks] = useState(4);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function addSingle() {
    if (!date) return;
    if (startTime >= endTime) { setError("Bitiş saati başlangıçtan büyük olmalı."); return; }
    setLoading(true); setError("");
    const res = await fetch("/api/educator/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ educatorId, date, startTime, endTime }),
    });
    setLoading(false);
    if (res.ok) { router.refresh(); }
    else { const d = await res.json(); setError(d.error ?? "Hata oluştu."); }
  }

  async function addWeekly() {
    if (selectedDays.length === 0) { setError("En az bir gün seçin."); return; }
    if (wStart >= wEnd) { setError("Bitiş saati başlangıçtan büyük olmalı."); return; }
    setLoading(true); setError("");

    const promises = [];
    for (const dayIdx of selectedDays) {
      for (let w = 0; w < weeks; w++) {
        const jsDay = DAY_MAP[dayIdx];
        const today = new Date();
        const todayDay = today.getDay();
        let diff = jsDay - todayDay;
        if (diff < 0) diff += 7;
        diff += w * 7;
        const d = new Date(today);
        d.setDate(today.getDate() + diff);
        const dateStr = d.toISOString().split("T")[0];
        promises.push(
          fetch("/api/educator/availability", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ educatorId, date: dateStr, startTime: wStart, endTime: wEnd }),
          })
        );
      }
    }
    await Promise.all(promises);
    setLoading(false);
    setSelectedDays([]);
    router.refresh();
  }

  async function deleteSlot(slotId: string) {
    await fetch(`/api/educator/availability/${slotId}`, { method: "DELETE" });
    router.refresh();
  }

  async function deleteDay(date: string) {
    const slotsForDay = grouped[date] ?? [];
    await Promise.all(
      slotsForDay
        .filter((s) => !s.isBooked)
        .map((s) => fetch(`/api/educator/availability/${s.id}`, { method: "DELETE" }))
    );
    router.refresh();
  }

  async function deleteAll() {
    if (!confirm("Rezerve edilmemiş tüm slotlar silinecek. Devam edilsin mi?")) return;
    setLoading(true);
    await fetch("/api/educator/availability", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ educatorId }),
    });
    setLoading(false);
    router.refresh();
  }

  const grouped = existingSlots.reduce<Record<string, Slot[]>>((acc, slot) => {
    const key = slot.date.split("T")[0];
    if (!acc[key]) acc[key] = [];
    acc[key].push(slot);
    return acc;
  }, {});

  const sortedDays = Object.keys(grouped).sort();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sol: Ekleme */}
      <div className="bg-surface-container-lowest rounded-md p-6 soft-card-static border border-outline-variant/20">
        <div className="flex gap-1 mb-5 bg-surface-container rounded-xl p-1">
          <button
            onClick={() => setTab("single")}
            className={`flex-1 py-2 rounded-lg text-label-md font-medium transition-colors ${
              tab === "single"
                ? "bg-surface-container-lowest shadow-sm text-on-background"
                : "text-on-surface-variant hover:text-on-background"
            }`}
          >
            Tek Gün
          </button>
          <button
            onClick={() => setTab("weekly")}
            className={`flex-1 py-2 rounded-lg text-label-md font-medium transition-colors ${
              tab === "weekly"
                ? "bg-surface-container-lowest shadow-sm text-on-background"
                : "text-on-surface-variant hover:text-on-background"
            }`}
          >
            Haftalık Tekrar
          </button>
        </div>

        {tab === "single" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-body-md font-medium text-on-background mb-1.5">Tarih</label>
              <input type="date" value={date} min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-surface-container rounded-md px-5 py-3 text-on-background placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-body-md font-medium text-on-background mb-1.5">Başlangıç</label>
                <select value={startTime} onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-surface-container rounded-md px-5 py-3 text-on-background focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition">
                  {TIMES.slice(0, -1).map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-body-md font-medium text-on-background mb-1.5">Bitiş</label>
                <select value={endTime} onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-surface-container rounded-md px-5 py-3 text-on-background focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition">
                  {TIMES.slice(1).map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <p className="text-caption text-on-surface-variant bg-surface-container rounded-lg px-3 py-2">
              Seçilen aralık otomatik olarak <strong>1&apos;er saatlik</strong> ders dilimlerine bölünür. Veliler dilediği saati seçer.
            </p>
            {error && <p className="text-on-error-container text-body-md">{error}</p>}
            <button onClick={addSingle} disabled={loading || !date}
              className="w-full rounded-full squishy-btn bg-primary text-on-primary py-3 text-label-md font-semibold disabled:opacity-50">
              {loading ? "Ekleniyor..." : "Uygunluk Ekle"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-body-md font-medium text-on-background mb-2">Günler</label>
              <div className="grid grid-cols-4 gap-2">
                {DAYS.map((day, i) => (
                  <button key={day} type="button"
                    onClick={() => setSelectedDays((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i])}
                    className={`py-2 rounded-full text-label-md font-medium transition-colors ${
                      selectedDays.includes(i)
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container text-on-surface-variant hover:bg-surface-container-low"
                    }`}>
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-body-md font-medium text-on-background mb-1.5">Başlangıç</label>
                <select value={wStart} onChange={(e) => setWStart(e.target.value)}
                  className="w-full bg-surface-container rounded-md px-5 py-3 text-on-background focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition">
                  {TIMES.slice(0, -1).map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-body-md font-medium text-on-background mb-1.5">Bitiş</label>
                <select value={wEnd} onChange={(e) => setWEnd(e.target.value)}
                  className="w-full bg-surface-container rounded-md px-5 py-3 text-on-background focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition">
                  {TIMES.slice(1).map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-body-md font-medium text-on-background mb-1.5">Kaç hafta ileriye eklensin?</label>
              <div className="flex gap-2">
                {[2, 4, 8, 12].map((w) => (
                  <button key={w} type="button" onClick={() => setWeeks(w)}
                    className={`flex-1 py-2 rounded-full text-label-md font-medium transition-colors ${
                      weeks === w
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container text-on-surface-variant hover:bg-surface-container-low"
                    }`}>
                    {w} hafta
                  </button>
                ))}
              </div>
            </div>
            <p className="text-caption text-on-surface-variant bg-surface-container rounded-lg px-3 py-2">
              Seçilen aralık otomatik olarak <strong>1&apos;er saatlik</strong> ders dilimlerine bölünür. Veliler dilediği saati seçer.
            </p>
            {error && <p className="text-on-error-container text-body-md">{error}</p>}
            <button onClick={addWeekly} disabled={loading || selectedDays.length === 0}
              className="w-full rounded-full squishy-btn bg-primary text-on-primary py-3 text-label-md font-semibold disabled:opacity-50">
              {loading ? "Ekleniyor..." : selectedDays.length > 0 ? "Uygunluk Ekle" : "Gün seçin"}
            </button>
            {selectedDays.length > 0 && !loading && (
              <p className="text-caption text-on-surface-variant text-center">
                {selectedDays.map((i) => DAYS[i]).join(", ")} — {wStart}–{wEnd} arası, {weeks} hafta boyunca
              </p>
            )}
          </div>
        )}
      </div>

      {/* Sağ: Mevcut slotlar */}
      <div className="bg-surface-container-lowest rounded-md p-6 soft-card-static border border-outline-variant/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-headline-md text-on-background">
            Mevcut Slotlar
            {existingSlots.length > 0 && (
              <span className="ml-2 text-caption font-normal text-on-surface-variant">({existingSlots.length} slot)</span>
            )}
          </h2>
          {existingSlots.some((s) => !s.isBooked) && (
            <button
              onClick={deleteAll}
              disabled={loading}
              className="text-caption rounded-full bg-error-container text-on-error-container px-4 py-1.5 font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              Tümünü Temizle
            </button>
          )}
        </div>
        {sortedDays.length === 0 ? (
          <p className="text-body-md text-on-surface-variant">Henüz uygunluk eklenmemiş.</p>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {sortedDays.map((day) => (
              <div key={day}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-caption font-semibold text-on-surface-variant uppercase tracking-wide">
                    {new Date(day + "T12:00:00").toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" })}
                  </p>
                  {grouped[day].some((s) => !s.isBooked) && (
                    <button onClick={() => deleteDay(day)} className="text-caption text-on-error-container hover:opacity-70 transition-opacity">
                      Günü temizle
                    </button>
                  )}
                </div>
                <div className="space-y-1">
                  {grouped[day].map((slot) => (
                    <div key={slot.id}
                      className={`flex items-center justify-between px-4 py-2 rounded-lg text-body-md ${
                        slot.isBooked
                          ? "bg-secondary-container text-on-secondary-container border border-outline-variant/20"
                          : "bg-surface-container text-on-background"
                      }`}>
                      <span className="font-medium">{slot.startTime} – {slot.endTime}</span>
                      {slot.isBooked
                        ? <span className="text-caption bg-on-secondary-container/10 text-on-secondary-container px-2 py-0.5 rounded-full font-semibold">Rezerve</span>
                        : <button onClick={() => deleteSlot(slot.id)} className="text-caption text-on-error-container hover:opacity-70 transition-opacity">Sil</button>
                      }
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
