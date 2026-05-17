"use client";

import { useState } from "react";
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
}: {
  students: Student[];
  educators: Educator[];
  defaultStudentId?: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(
    students.find((s) => s.id === defaultStudentId) ?? null
  );
  const [selectedEducator, setSelectedEducator] = useState<Educator | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
      }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error ?? "Bir hata oluştu.");
      return;
    }

    router.push(`/parent/bookings?success=1`);
    router.refresh();
  }

  const steps = ["Öğrenci", "Eğitmen", "Saat", "Onay"];

  return (
    <div className="max-w-2xl">
      {/* Step indicator */}
      <div className="flex items-center mb-8">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              i + 1 < step ? "bg-blue-600 text-white" :
              i + 1 === step ? "bg-blue-600 text-white ring-4 ring-blue-100" :
              "bg-gray-200 text-gray-500"
            }`}>
              {i + 1 < step ? "✓" : i + 1}
            </div>
            <span className={`ml-2 text-sm font-medium ${i + 1 === step ? "text-blue-600" : "text-gray-400"}`}>
              {label}
            </span>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${i + 1 < step ? "bg-blue-600" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Öğrenci seç */}
      {step === 1 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Hangi öğrenci için rezervasyon yapıyorsunuz?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {students.map((s) => (
              <button
                key={s.id}
                onClick={() => { setSelectedStudent(s); setStep(2); }}
                className={`border-2 rounded-xl p-4 text-left transition ${
                  selectedStudent?.id === s.id ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <p className="font-semibold text-gray-900">{s.name}</p>
                <p className="text-sm text-gray-500">{GRADE_LABELS[s.gradeLevel] ?? s.gradeLevel}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Eğitmen seç */}
      {step === 2 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Eğitmen seçin</h2>
          {educators.length === 0 ? (
            <p className="text-gray-500">Şu anda onaylı eğitmen bulunmuyor.</p>
          ) : (
            <div className="space-y-3">
              {educators.map((e) => (
                <button
                  key={e.id}
                  onClick={() => {
                    setSelectedEducator(e);
                    setSelectedSubject(null);
                    loadSlots(e);
                    setStep(3);
                  }}
                  className={`w-full border-2 rounded-xl p-4 text-left transition ${
                    selectedEducator?.id === e.id ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{e.name}</p>
                      {e.bio && <p className="text-sm text-gray-500 mt-0.5">{e.bio}</p>}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {e.subjects.map((s) => (
                          <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                            {SUBJECT_LABELS[s] ?? s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-lg font-bold text-blue-600 ml-4 shrink-0">
                      {formatCurrency(e.hourlyRate)}/sa
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
          <button onClick={() => setStep(1)} className="mt-4 text-sm text-gray-500 hover:text-gray-700">
            ← Geri
          </button>
        </div>
      )}

      {/* Step 3: Saat seç */}
      {step === 3 && selectedEducator && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-2">Ders konusu ve saati seçin</h2>
          <p className="text-sm text-gray-500 mb-4">Eğitmen: {selectedEducator.name}</p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Ders Konusu</label>
            <div className="flex flex-wrap gap-2">
              {selectedEducator.subjects.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSubject(s)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition ${
                    selectedSubject === s ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-blue-300"
                  }`}
                >
                  {SUBJECT_LABELS[s] ?? s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Uygun Saatler</label>
            {loadingSlots ? (
              <p className="text-gray-400 text-sm">Yükleniyor...</p>
            ) : availableSlots.length === 0 ? (
              <p className="text-gray-500 text-sm bg-yellow-50 p-3 rounded-lg">
                Bu eğitmenin şu an müsait saati bulunmuyor.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot)}
                    className={`border-2 rounded-lg p-3 text-sm text-left transition ${
                      selectedSlot?.id === slot.id ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <p className="font-medium text-gray-800">
                      {new Date(slot.date + "T00:00:00").toLocaleDateString("tr-TR", {
                        day: "numeric", month: "short", weekday: "short"
                      })}
                    </p>
                    <p className="text-gray-500">{slot.startTime} – {slot.endTime}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(2)} className="text-sm text-gray-500 hover:text-gray-700">
              ← Geri
            </button>
            <button
              disabled={!selectedSlot || !selectedSubject}
              onClick={() => setStep(4)}
              className="ml-auto bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              İleri →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Onay */}
      {step === 4 && selectedStudent && selectedEducator && selectedSubject && selectedSlot && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Rezervasyonu Onayla</h2>

          <div className="space-y-3 bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Öğrenci</span>
              <span className="font-medium">{selectedStudent.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Eğitmen</span>
              <span className="font-medium">{selectedEducator.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Ders</span>
              <span className="font-medium">{SUBJECT_LABELS[selectedSubject]}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tarih</span>
              <span className="font-medium">
                {new Date(selectedSlot.date + "T00:00:00").toLocaleDateString("tr-TR", {
                  weekday: "long", day: "numeric", month: "long"
                })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Saat</span>
              <span className="font-medium">{selectedSlot.startTime} – {selectedSlot.endTime}</span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="font-semibold text-gray-900">Toplam Ücret</span>
              <span className="font-bold text-blue-600 text-lg">{formatCurrency(selectedEducator.hourlyRate)}</span>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 rounded-lg p-3 mb-4">{error}</p>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(3)} className="text-sm text-gray-500 hover:text-gray-700">
              ← Geri
            </button>
            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Rezervasyon yapılıyor..." : "Rezervasyonu Tamamla"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
