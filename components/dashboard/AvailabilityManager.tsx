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

function getNextDateForDay(dayIndex: number): string {
  const today = new Date();
  const todayDay = today.getDay();
  const jsDay = DAY_MAP[dayIndex];
  let diff = jsDay - todayDay;
  if (diff <= 0) diff += 7;
  const d = new Date(today);
  d.setDate(today.getDate() + diff);
  return d.toISOString().split("T")[0];
}

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
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex gap-1 mb-5 bg-slate-100 rounded-xl p-1">
          <button onClick={() => setTab("single")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "single" ? "bg-white shadow-sm text-navy-900" : "text-slate-500"}`}>
            Tek Gün
          </button>
          <button onClick={() => setTab("weekly")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "weekly" ? "bg-white shadow-sm text-navy-900" : "text-slate-500"}`}>
            Haftalık Tekrar
          </button>
        </div>

        {tab === "single" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tarih</label>
              <input type="date" value={date} min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Başlangıç</label>
                <select value={startTime} onChange={(e) => setStartTime(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400">
                  {TIMES.slice(0, -1).map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Bitiş</label>
                <select value={endTime} onChange={(e) => setEndTime(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400">
                  {TIMES.slice(1).map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button onClick={addSingle} disabled={loading || !date}
              className="w-full bg-navy-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-navy-800 disabled:opacity-50 transition-colors">
              {loading ? "Ekleniyor..." : "Slot Ekle"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Günler</label>
              <div className="grid grid-cols-4 gap-2">
                {DAYS.map((day, i) => (
                  <button key={day} type="button" onClick={() => setSelectedDays((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i])}
                    className={`py-2 rounded-lg text-xs font-medium border transition-colors ${selectedDays.includes(i) ? "bg-navy-900 text-white border-navy-900" : "bg-white text-slate-600 border-slate-200 hover:border-navy-400"}`}>
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Başlangıç</label>
                <select value={wStart} onChange={(e) => setWStart(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400">
                  {TIMES.slice(0, -1).map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Bitiş</label>
                <select value={wEnd} onChange={(e) => setWEnd(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400">
                  {TIMES.slice(1).map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Kaç hafta ileriye eklensin?</label>
              <div className="flex gap-2">
                {[2, 4, 8, 12].map((w) => (
                  <button key={w} type="button" onClick={() => setWeeks(w)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${weeks === w ? "bg-gold-500 text-white border-gold-500" : "bg-white text-slate-600 border-slate-200"}`}>
                    {w} hafta
                  </button>
                ))}
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button onClick={addWeekly} disabled={loading || selectedDays.length === 0}
              className="w-full bg-navy-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-navy-800 disabled:opacity-50 transition-colors">
              {loading ? "Ekleniyor..." : `${selectedDays.length > 0 ? selectedDays.length + " gün × " + weeks + " hafta = " + selectedDays.length * weeks + " slot" : "Gün seçin"}`}
            </button>
            {selectedDays.length > 0 && !loading && (
              <p className="text-xs text-slate-500 text-center">
                {selectedDays.map((i) => DAYS[i]).join(", ")} — {wStart}–{wEnd} arası {weeks} hafta boyunca eklenir
              </p>
            )}
          </div>
        )}
      </div>

      {/* Sağ: Mevcut slotlar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-semibold text-navy-900 mb-4">
          Mevcut Slotlar
          {existingSlots.length > 0 && (
            <span className="ml-2 text-xs font-normal text-slate-400">({existingSlots.length} slot)</span>
          )}
        </h2>
        {sortedDays.length === 0 ? (
          <p className="text-slate-400 text-sm">Henüz uygunluk eklenmemiş.</p>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {sortedDays.map((day) => (
              <div key={day}>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  {new Date(day + "T12:00:00").toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" })}
                </p>
                <div className="space-y-1">
                  {grouped[day].map((slot) => (
                    <div key={slot.id}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${slot.isBooked ? "bg-green-50 text-green-700 border border-green-100" : "bg-slate-50 text-slate-700"}`}>
                      <span className="font-medium">{slot.startTime} – {slot.endTime}</span>
                      {slot.isBooked
                        ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Rezerve</span>
                        : <button onClick={() => deleteSlot(slot.id)} className="text-red-400 hover:text-red-600 transition-colors text-xs">Sil</button>
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
