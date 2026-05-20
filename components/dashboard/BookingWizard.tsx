"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GradeLevel, Subject } from "@prisma/client";
import { SUBJECT_LABELS, GRADE_LABELS, formatCurrency } from "@/lib/utils";

interface Student {
  id: string;
  name: string;
  gradeLevel: GradeLevel;
}

interface Educator {
  id: string;
  name: string;
  bio: string | null;
  subjects: Subject[];
  gradeLevels: GradeLevel[];
  hourlyRate: number;
}

interface Slot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}

export default function BookingWizard({
  students,
  educators,
  defaultStudentId,
  defaultEducatorId,
}: {
  students: Student[];
  educators: Educator[];
  defaultStudentId?: string;
  defaultEducatorId?: string;
}) {
  const router = useRouter();
  const defaultEducator = educators.find((e) => e.id === defaultEducatorId) ?? null;
  const defaultStudent = students.find((s) => s.id === defaultStudentId) ?? null;

  const initialStep = defaultEducatorId && defaultStudentId ? 3 : defaultEducatorId ? 2 : 1;

  const [step, setStep] = useState(initialStep);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(defaultStudent);
  const [selectedEducator, setSelectedEducator] = useState<Educator | null>(defaultEducator);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [notes, setNotes] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (defaultEducator) loadSlots(defaultEducator);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadSlots(educator: Educator) {
    setLoadingSlots(true);
    setAvailableSlots([]);
    setSelectedSlot(null);
    const res = await fetch(`/api/educator/availability?educatorId=${educator.id}&available=true`);
    const data = await res.json();
    setAvailableSlots(data);
    setLoadingSlots(false);
  }

  async function handleConfirm() {
    if (!selectedStudent || !selectedEducator || !selectedSubject || !selectedSlot) return;
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: selectedStudent.id,
        educatorId: selectedEducator.id,
        slotId: selectedSlot.id,
        subject: selectedSubject,
        totalPrice: selectedEducator.hourlyRate,
        notes: notes.trim() || undefined,
      }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error ?? "Bir hata oluştu.");
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/parent/bookings"), 2000);
  }

  // Group slots by date
  const slotsByDate = availableSlots.reduce<Record<string, Slot[]>>((acc, s) => {
    const key = s.date.split("T")[0];
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});
  const sortedDates = Object.keys(slotsByDate).sort();

  const steps = ["Öğrenci", "Öğretmen", "Tarih & Saat", "Onayla"];

  if (done) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl border border-green-200 p-10 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl text-navy-900 mb-2">Randevu Talebiniz Gönderildi!</h2>
          <p className="text-slate-500 text-sm">Öğretmen talebinizi inceleyecek ve onayladığında ödeme bilgileri size iletilecek.</p>
          <p className="text-xs text-slate-400 mt-3">Rezervasyonlarım sayfasına yönlendiriliyorsunuz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Step indicator */}
      <div className="flex items-center mb-8">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
              i + 1 < step ? "bg-gold-500 text-white" :
              i + 1 === step ? "bg-navy-900 text-white ring-4 ring-navy-200" :
              "bg-slate-200 text-slate-400"
            }`}>
              {i + 1 < step ? "✓" : i + 1}
            </div>
            <span className={`ml-2 text-sm font-medium hidden sm:block ${i + 1 === step ? "text-navy-900" : "text-slate-400"}`}>
              {label}
            </span>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 sm:mx-4 ${i + 1 < step ? "bg-gold-500" : "bg-slate-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Öğrenci */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="font-semibold text-navy-900 text-lg mb-5">Hangi öğrenci için randevu alıyorsunuz?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {students.map((s) => (
              <button key={s.id} onClick={() => { setSelectedStudent(s); setStep(2); }}
                className={`border-2 rounded-2xl p-4 text-left transition-all ${
                  selectedStudent?.id === s.id ? "border-navy-900 bg-navy-50" : "border-slate-200 hover:border-navy-300"
                }`}>
                <div className="w-8 h-8 bg-navy-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-navy-700 font-bold text-sm">{s.name[0].toUpperCase()}</span>
                </div>
                <p className="font-semibold text-navy-900">{s.name}</p>
                <p className="text-sm text-slate-500">{GRADE_LABELS[s.gradeLevel] ?? s.gradeLevel}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Öğretmen */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="font-semibold text-navy-900 text-lg mb-5">Öğretmen seçin</h2>
          {educators.length === 0 ? (
            <p className="text-slate-500 text-sm">Şu anda onaylı öğretmen bulunmuyor.</p>
          ) : (
            <div className="space-y-3">
              {educators.map((e) => (
                <button key={e.id} onClick={() => { setSelectedEducator(e); setSelectedSubject(null); loadSlots(e); setStep(3); }}
                  className={`w-full border-2 rounded-2xl p-4 text-left transition-all ${
                    selectedEducator?.id === e.id ? "border-navy-900 bg-navy-50" : "border-slate-200 hover:border-navy-300"
                  }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-navy-900">{e.name}</p>
                      {e.bio && <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{e.bio}</p>}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {e.subjects.map((s) => (
                          <span key={s} className="text-xs bg-navy-50 text-navy-700 px-2 py-0.5 rounded-full border border-navy-100">
                            {SUBJECT_LABELS[s] ?? s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-base font-bold text-gold-600 ml-4 shrink-0">{formatCurrency(e.hourlyRate)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
          <button onClick={() => setStep(1)} className="mt-4 text-sm text-slate-400 hover:text-slate-700 flex items-center gap-1">
            ← Geri
          </button>
        </div>
      )}

      {/* Step 3: Konu + Saat + Not */}
      {step === 3 && selectedEducator && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
          <div>
            <h2 className="font-semibold text-navy-900 text-lg">Ders konusu ve saat seçin</h2>
            <p className="text-sm text-slate-400 mt-0.5">{selectedEducator.name} · {formatCurrency(selectedEducator.hourlyRate)}/saat</p>
          </div>

          {/* Konu */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Ders Konusu</label>
            <div className="flex flex-wrap gap-2">
              {selectedEducator.subjects.map((s) => (
                <button key={s} onClick={() => setSelectedSubject(s)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium border-2 transition-all ${
                    selectedSubject === s
                      ? "border-navy-900 bg-navy-900 text-white"
                      : "border-slate-200 text-slate-600 hover:border-navy-300"
                  }`}>
                  {SUBJECT_LABELS[s] ?? s}
                </button>
              ))}
            </div>
          </div>

          {/* Saat */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Uygun Saatler</label>
            {loadingSlots ? (
              <p className="text-slate-400 text-sm">Müsait saatler yükleniyor...</p>
            ) : sortedDates.length === 0 ? (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700">
                Bu öğretmenin şu an müsait saati bulunmuyor.
              </div>
            ) : (
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {sortedDates.map((date) => (
                  <div key={date}>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      {new Date(date + "T12:00:00").toLocaleDateString("tr-TR", {
                        weekday: "long", day: "numeric", month: "long",
                      })}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {slotsByDate[date].map((slot) => (
                        <button key={slot.id} onClick={() => setSelectedSlot(slot)}
                          className={`px-3 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                            selectedSlot?.id === slot.id
                              ? "border-gold-500 bg-gold-500 text-white"
                              : "border-slate-200 text-slate-700 hover:border-gold-400"
                          }`}>
                          {slot.startTime}–{slot.endTime}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Not */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Ders Notu <span className="text-slate-400 font-normal">(isteğe bağlı)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Hangi konularda yardım istediğinizi, öğrencinin seviyesini veya özel beklentilerinizi yazabilirsiniz..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="text-sm text-slate-400 hover:text-slate-700">
              ← Geri
            </button>
            <button
              disabled={!selectedSlot || !selectedSubject}
              onClick={() => setStep(4)}
              className="ml-auto bg-navy-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-800 disabled:opacity-50 transition-colors"
            >
              İleri →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Onay */}
      {step === 4 && selectedStudent && selectedEducator && selectedSubject && selectedSlot && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="font-semibold text-navy-900 text-lg mb-5">Randevu Özetini Onaylayın</h2>

          <div className="bg-slate-50 rounded-2xl p-5 space-y-3 mb-5">
            {[
              { label: "Öğrenci", value: selectedStudent.name },
              { label: "Öğretmen", value: selectedEducator.name },
              { label: "Ders", value: SUBJECT_LABELS[selectedSubject] ?? selectedSubject },
              {
                label: "Tarih",
                value: new Date(selectedSlot.date + "T12:00:00").toLocaleDateString("tr-TR", {
                  weekday: "long", day: "numeric", month: "long",
                }),
              },
              { label: "Saat", value: `${selectedSlot.startTime} – ${selectedSlot.endTime}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-slate-500">{label}</span>
                <span className="font-medium text-navy-900">{value}</span>
              </div>
            ))}
            {notes && (
              <div className="pt-2 border-t border-slate-200">
                <span className="text-xs text-slate-400 block mb-1">Not</span>
                <p className="text-sm text-slate-600 italic">{notes}</p>
              </div>
            )}
            <div className="border-t border-slate-200 pt-3 flex justify-between">
              <span className="font-semibold text-navy-900">Ders Ücreti</span>
              <span className="font-bold text-gold-600 text-lg">{formatCurrency(selectedEducator.hourlyRate)}</span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800 mb-5">
            <strong>Bilgi:</strong> Ödeme, öğretmen randevunuzu onayladıktan sonra talep edilecektir.
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl p-3 mb-4">{error}</p>}

          <div className="flex gap-3">
            <button onClick={() => setStep(3)} className="text-sm text-slate-400 hover:text-slate-700">
              ← Geri
            </button>
            <button onClick={handleConfirm} disabled={submitting}
              className="flex-1 bg-gold-500 text-white py-3 rounded-xl font-bold hover:bg-gold-600 disabled:opacity-50 transition-colors">
              {submitting ? "Gönderiliyor..." : "Randevu Talebi Gönder"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
