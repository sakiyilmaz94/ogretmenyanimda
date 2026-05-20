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
  parentId,
  defaultStudentId,
  defaultEducatorId,
}: {
  students: Student[];
  educators: Educator[];
  parentId: string;
  defaultStudentId?: string;
  defaultEducatorId?: string;
}) {
  const router = useRouter();

  // Educator pre-loaded from URL param (e.g. from educator profile page "Randevu Al")
  const preselectedEducator = educators.find((e) => e.id === defaultEducatorId) ?? null;
  const preselectedStudent = students.find((s) => s.id === defaultStudentId) ?? null;

  const [step, setStep] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(preselectedStudent);
  const [selectedEducator, setSelectedEducator] = useState<Educator | null>(preselectedEducator);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | null>(null);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [notes, setNotes] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  // Inline new student form
  const [showNewStudentForm, setShowNewStudentForm] = useState(students.length === 0);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentGrade, setNewStudentGrade] = useState<GradeLevel | "">("");
  const [creatingStudent, setCreatingStudent] = useState(false);
  const [studentError, setStudentError] = useState("");

  // If defaultStudentId given, skip to appropriate step
  useEffect(() => {
    if (preselectedStudent && preselectedEducator) {
      loadSlots(preselectedEducator);
      setSelectedGrade(preselectedStudent.gradeLevel);
      setStep(3);
    } else if (preselectedStudent) {
      setStep(2);
    }
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

  function selectStudent(s: Student) {
    setSelectedStudent(s);
    setSelectedGrade(s.gradeLevel); // default to student's grade, changeable
    if (selectedEducator) {
      // Educator already pre-selected → skip to step 3
      loadSlots(selectedEducator);
      setStep(3);
    } else {
      setStep(2);
    }
  }

  async function createStudentAndProceed() {
    if (!newStudentName.trim()) { setStudentError("Öğrenci adı gerekli."); return; }
    if (!newStudentGrade) { setStudentError("Sınıf seçimi gerekli."); return; }
    setCreatingStudent(true);
    setStudentError("");
    const res = await fetch("/api/parent/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parentId, name: newStudentName.trim(), gradeLevel: newStudentGrade }),
    });
    const data = await res.json();
    setCreatingStudent(false);
    if (!res.ok) { setStudentError(data.error ?? "Öğrenci oluşturulamadı."); return; }
    selectStudent(data);
  }

  async function handleConfirm() {
    if (!selectedStudent || !selectedEducator || !selectedSubject || !selectedSlot || !selectedGrade) return;
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
        gradeLevel: selectedGrade,
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
    setTimeout(() => router.push("/parent/bookings"), 5000);
  }

  const slotsByDate = availableSlots.reduce<Record<string, Slot[]>>((acc, s) => {
    const key = s.date.split("T")[0];
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});
  const sortedDates = Object.keys(slotsByDate).sort();

  const steps = ["Öğrenci", "Öğretmen", "Tarih & Saat", "Onayla"];

  // ── Başarı ekranı ──────────────────────────────────────────────
  if (done) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl border border-green-200 p-10 text-center shadow-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl text-navy-900 mb-3">Randevu Talebiniz Öğretmene İletildi!</h2>
          <div className="text-left bg-slate-50 rounded-xl p-4 space-y-2 mb-5">
            <div className="flex items-start gap-3 text-sm">
              <span className="w-6 h-6 bg-gold-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
              <p className="text-slate-600">Öğretmen talebinizi inceleyecek ve onaylayacak.</p>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <span className="w-6 h-6 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
              <p className="text-slate-500">Onaylandığında e-posta ve bildirimle haberdar edileceksiniz.</p>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <span className="w-6 h-6 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
              <p className="text-slate-500">Ödeme yapıldıktan sonra randevunuz kesinleşecek.</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">Rezervasyonlarım sayfasına yönlendiriliyorsunuz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Adım göstergesi */}
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

      {/* ── Adım 1: Öğrenci ── */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="font-semibold text-navy-900 text-lg mb-5">Hangi öğrenci için randevu alıyorsunuz?</h2>

          {!showNewStudentForm && (
            <>
              {students.length > 0 ? (
                <div className="space-y-3 mb-4">
                  {students.map((s) => (
                    <button key={s.id} onClick={() => selectStudent(s)}
                      className="w-full border-2 border-slate-200 hover:border-navy-400 rounded-2xl p-4 text-left transition-all flex items-center gap-4">
                      <div className="w-10 h-10 bg-navy-100 rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-navy-700 font-bold">{s.name[0].toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-navy-900">{s.name}</p>
                        <p className="text-sm text-slate-500">{GRADE_LABELS[s.gradeLevel] ?? s.gradeLevel}</p>
                      </div>
                      <span className="ml-auto text-navy-400 text-sm">Seç →</span>
                    </button>
                  ))}
                </div>
              ) : null}
              <button onClick={() => setShowNewStudentForm(true)}
                className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-4 text-slate-500 hover:border-navy-300 hover:text-navy-700 transition-all text-sm font-medium flex items-center justify-center gap-2">
                <span className="text-lg">+</span> Yeni Öğrenci Ekle
              </button>
            </>
          )}

          {showNewStudentForm && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Öğrencinin Adı Soyadı</label>
                <input type="text" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="örn: Ali Yılmaz" autoFocus
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Sınıf</label>
                <select value={newStudentGrade} onChange={(e) => setNewStudentGrade(e.target.value as GradeLevel)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400">
                  <option value="">Sınıf seçin...</option>
                  {Object.entries(GRADE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              {studentError && <p className="text-red-500 text-sm">{studentError}</p>}
              <div className="flex gap-3">
                {students.length > 0 && (
                  <button onClick={() => { setShowNewStudentForm(false); setStudentError(""); }}
                    className="text-sm text-slate-400 hover:text-slate-700">← Geri</button>
                )}
                <button onClick={createStudentAndProceed} disabled={creatingStudent}
                  className="flex-1 bg-navy-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-800 disabled:opacity-50 transition-colors">
                  {creatingStudent ? "Oluşturuluyor..." : "Devam Et →"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Adım 2: Öğretmen ── */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          {selectedStudent && (
            <div className="flex items-center gap-2 mb-5 px-3 py-2 bg-slate-50 rounded-xl text-sm">
              <span className="text-slate-500">Öğrenci:</span>
              <span className="font-semibold text-navy-900">{selectedStudent.name}</span>
              <span className="text-slate-400">— {GRADE_LABELS[selectedStudent.gradeLevel]}</span>
            </div>
          )}
          <h2 className="font-semibold text-navy-900 text-lg mb-5">Öğretmen seçin</h2>
          {educators.length === 0 ? (
            <p className="text-slate-500 text-sm">Şu anda onaylı öğretmen bulunmuyor.</p>
          ) : (
            <div className="space-y-3">
              {educators.map((e) => (
                <button key={e.id} onClick={() => { setSelectedEducator(e); loadSlots(e); setStep(3); }}
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
          <button onClick={() => setStep(1)} className="mt-4 text-sm text-slate-400 hover:text-slate-700">← Geri</button>
        </div>
      )}

      {/* ── Adım 3: Ders + Sınıf + Saat + Not ── */}
      {step === 3 && selectedEducator && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
          <div>
            <h2 className="font-semibold text-navy-900 text-lg">Ders ve saat seçin</h2>
            <p className="text-sm text-slate-400 mt-0.5">{selectedEducator.name} · {formatCurrency(selectedEducator.hourlyRate)}/saat</p>
          </div>

          {/* Dersler */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Dersler</label>
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

          {/* Sınıf seçimi */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Sınıf</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(GRADE_LABELS).map(([key, label]) => (
                <button key={key} onClick={() => setSelectedGrade(key as GradeLevel)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium border-2 transition-all ${
                    selectedGrade === key
                      ? "border-gold-500 bg-gold-500 text-white"
                      : "border-slate-200 text-slate-600 hover:border-gold-400"
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Uygun Saatler */}
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
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
              placeholder="Hangi konularda yardım istediğinizi, öğrencinin seviyesini veya özel beklentilerinizi yazabilirsiniz..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none" />
          </div>

          <div className="flex gap-3">
            <button onClick={() => { setSelectedSlot(null); setStep(selectedEducator ? 2 : 2); }}
              className="text-sm text-slate-400 hover:text-slate-700">← Geri</button>
            <button disabled={!selectedSlot || !selectedSubject || !selectedGrade} onClick={() => setStep(4)}
              className="ml-auto bg-navy-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-800 disabled:opacity-50 transition-colors">
              İleri →
            </button>
          </div>
        </div>
      )}

      {/* ── Adım 4: Onayla ── */}
      {step === 4 && selectedStudent && selectedEducator && selectedSubject && selectedSlot && selectedGrade && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="font-semibold text-navy-900 text-lg mb-5">Randevu Özeti</h2>

          <div className="bg-slate-50 rounded-2xl p-5 space-y-3 mb-5">
            {[
              { label: "Öğrenci", value: selectedStudent.name },
              { label: "Öğretmen", value: selectedEducator.name },
              { label: "Ders", value: SUBJECT_LABELS[selectedSubject] ?? selectedSubject },
              { label: "Sınıf", value: GRADE_LABELS[selectedGrade] ?? selectedGrade },
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
            Talebiniz gönderildikten sonra öğretmen onaylayacak. Onay geldiğinde size e-posta ve bildirim gönderilecek, ardından ödeme yapabileceksiniz.
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl p-3 mb-4">{error}</p>}

          <div className="flex gap-3">
            <button onClick={() => setStep(3)} className="text-sm text-slate-400 hover:text-slate-700">← Geri</button>
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
