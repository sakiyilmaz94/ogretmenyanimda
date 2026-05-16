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

const TIME_OPTIONS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
];

export default function AvailabilityManager({
  educatorId,
  existingSlots,
}: {
  educatorId: string;
  existingSlots: Slot[];
}) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function addSlot() {
    if (!date || !startTime || !endTime) return;
    if (startTime >= endTime) {
      setError("Bitiş saati başlangıç saatinden büyük olmalıdır.");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/educator/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ educatorId, date, startTime, endTime }),
    });

    setLoading(false);
    if (res.ok) {
      router.refresh();
    } else {
      const d = await res.json();
      setError(d.error ?? "Bir hata oluştu.");
    }
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Yeni Slot Ekle</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç</label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş</label>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={addSlot}
            disabled={loading || !date}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Ekleniyor..." : "Slot Ekle"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Mevcut Slotlar</h2>
        {Object.keys(grouped).length === 0 ? (
          <p className="text-gray-500 text-sm">Henüz uygunluk eklenmemiş.</p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(grouped).map(([day, slots]) => (
              <div key={day}>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {new Date(day + "T00:00:00").toLocaleDateString("tr-TR", {
                    weekday: "long", day: "numeric", month: "long",
                  })}
                </p>
                <div className="space-y-1">
                  {slots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                        slot.isBooked
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-50 text-gray-700"
                      }`}
                    >
                      <span>
                        {slot.startTime} — {slot.endTime}
                        {slot.isBooked && <span className="ml-2 text-xs">📚 Rezerve</span>}
                      </span>
                      {!slot.isBooked && (
                        <button
                          onClick={() => deleteSlot(slot.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          ✕
                        </button>
                      )}
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
