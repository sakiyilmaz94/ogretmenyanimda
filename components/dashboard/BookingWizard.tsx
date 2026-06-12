"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GradeLevel, Subject } from "@prisma/client";
import { SUBJECT_LABELS, GRADE_LABELS, formatCurrency } from "@/lib/utils";
import TopicSelector from "./TopicSelector";

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
  const [selectedTopic, setSelectedTopic] = useState<{ id: string; name: string } | null>(null);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [notes, setNotes] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  // O sınıf için müfredatı olan dersler (öğretmen branşlarıyla kesiştirilir)
  const [availableSubjects, setAvailableSubjects] = useState<string[] | null>(null);

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
      setSelectedGrade(preselectedStudent.gradeLevel);
      setStep(2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Öğrencinin (sabit) sınıfına göre, müfredatı olan dersleri çek
  useEffect(() => {
    const grade = selectedStudent?.gradeLevel ?? selectedGrade;
    if (!grade) { setAvailableSubjects(null); return; }
    const g = parseInt(grade.match(/\d+$/)?.[0] || "1", 10);
    setAvailableSubjects(null);
    fetch(`/api/curriculum/subjects?gradeLevel=${g}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setAvailableSubjects(Array.isArray(data) ? data : []))
      .catch(() => setAvailableSubjects([]));
  }, [selectedStudent, selectedGrade]);

  // Öğrencinin sınıfına ders veren öğretmenler
  const visibleEducators = selectedStudent
    ? educators.filter((e) => e.gradeLevels.includes(selectedStudent.gradeLevel))
    : educators;

  // Öğretmenin branşları ∩ bu sınıfta müfredatı olan dersler
  const subjectsForStudent = selectedEducator
    ? selectedEducator.subjects.filter((s) => !availableSubjects || availableSubjects.includes(s))
    : [];

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
    if (!selectedStudent || !selectedEducator || !selectedSubject || !selectedSlot || !selectedGrade || !selectedTopic) return;
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
        topicId: selectedTopic.id,
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
        <div className="bg-surface-container-lowest rounded-md border border-secondary-container p-10 text-center soft-card-static">
          <div className="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-on-secondary-container" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-display text-headline-md text-on-background mb-3">Randevu Talebiniz Öğretmene İletildi!</h2>
          <div className="text-left bg-surface-container rounded-md p-4 space-y-2 mb-5">
            <div className="flex items-start gap-3 text-body-md">
              <span className="w-6 h-6 bg-primary text-on-primary rounded-full flex items-center justify-center text-caption font-bold shrink-0 mt-0.5">1</span>
              <p className="text-on-surface-variant">Öğretmen talebinizi inceleyecek ve onaylayacak.</p>
            </div>
            <div className="flex items-start gap-3 text-body-md">
              <span className="w-6 h-6 bg-surface-container text-on-surface-variant rounded-full flex items-center justify-center text-caption font-bold shrink-0 mt-0.5">2</span>
              <p className="text-on-surface-variant">Onaylandığında e-posta ve bildirimle haberdar edileceksiniz.</p>
            </div>
            <div className="flex items-start gap-3 text-body-md">
              <span className="w-6 h-6 bg-surface-container text-on-surface-variant rounded-full flex items-center justify-center text-caption font-bold shrink-0 mt-0.5">3</span>
              <p className="text-on-surface-variant">Ödeme yapıldıktan sonra randevunuz kesinleşecek.</p>
            </div>
          </div>
          <p className="text-caption text-on-surface-variant">Rezervasyonlarım sayfasına yönlendiriliyorsunuz...</p>
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
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-caption font-semibold transition-colors ${
              i + 1 < step ? "bg-primary text-on-primary" :
              i + 1 === step ? "bg-primary text-on-primary ring-4 ring-primary/20" :
              "bg-surface-container text-on-surface-variant"
            }`}>
              {i + 1 < step ? "✓" : i + 1}
            </div>
            <span className={`ml-2 text-label-md font-medium hidden sm:block ${i + 1 === step ? "text-on-background" : "text-on-surface-variant"}`}>
              {label}
            </span>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 sm:mx-4 ${i + 1 < step ? "bg-primary" : "bg-outline-variant"}`} />
            )}
          </div>
        ))}
      </div>

      {/* ── Adım 1: Öğrenci ── */}
      {step === 1 && (
        <div className="bg-surface-container-lowest rounded-md border border-outline-variant/20 p-6 soft-card-static">
          <h2 className="font-display font-semibold text-on-background text-headline-md mb-5">Hangi öğrenci için randevu alıyorsunuz?</h2>

          {!showNewStudentForm && (
            <>
              {students.length > 0 ? (
                <div className="space-y-3 mb-4">
                  {students.map((s) => (
                    <button key={s.id} onClick={() => selectStudent(s)}
                      className="w-full border-2 border-outline-variant hover:border-primary rounded-md p-4 text-left transition-all flex items-center gap-4 bg-surface-container-low hover:bg-surface-container">
                      <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                        <span className="text-on-primary font-display font-bold">{s.name[0].toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-display font-semibold text-on-background">{s.name}</p>
                        <p className="text-body-md text-on-surface-variant">{GRADE_LABELS[s.gradeLevel] ?? s.gradeLevel}</p>
                      </div>
                      <span className="ml-auto text-primary text-label-md font-semibold">Seç →</span>
                    </button>
                  ))}
                </div>
              ) : null}
              <button onClick={() => setShowNewStudentForm(true)}
                className="w-full border-2 border-dashed border-outline-variant rounded-md p-4 text-on-surface-variant hover:border-primary hover:text-primary transition-all text-label-md font-medium flex items-center justify-center gap-2">
                <span className="text-lg">+</span> Yeni Öğrenci Ekle
              </button>
            </>
          )}

          {showNewStudentForm && (
            <div className="space-y-4">
              <div>
                <label className="block text-label-md font-medium text-on-background mb-1.5">Öğrencinin Adı Soyadı</label>
                <input type="text" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="örn: Ali Yılmaz" autoFocus
                  className="w-full bg-surface-container rounded-full px-5 py-3 text-on-background placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition" />
              </div>
              <div>
                <label className="block text-label-md font-medium text-on-background mb-1.5">Sınıf</label>
                <select value={newStudentGrade} onChange={(e) => setNewStudentGrade(e.target.value as GradeLevel)}
                  className="w-full bg-surface-container rounded-md px-5 py-3 text-on-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition">
                  <option value="">Sınıf seçin...</option>
                  {Object.entries(GRADE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              {studentError && <p className="text-on-error-container bg-error-container rounded-md px-4 py-2 text-body-md">{studentError}</p>}
              <div className="flex gap-3">
                {students.length > 0 && (
                  <button onClick={() => { setShowNewStudentForm(false); setStudentError(""); }}
                    className="text-label-md text-on-surface-variant hover:text-on-background transition">← Geri</button>
                )}
                <button onClick={createStudentAndProceed} disabled={creatingStudent}
                  className="flex-1 rounded-full squishy-btn bg-primary text-on-primary px-6 py-3 text-label-md font-semibold disabled:opacity-50 transition">
                  {creatingStudent ? "Oluşturuluyor..." : "Devam Et →"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Adım 2: Öğretmen ── */}
      {step === 2 && (
        <div className="bg-surface-container-lowest rounded-md border border-outline-variant/20 p-6 soft-card-static">
          {selectedStudent && (
            <div className="flex items-center gap-2 mb-5 px-4 py-2.5 bg-surface-container rounded-full text-body-md">
              <span className="text-on-surface-variant">Öğrenci:</span>
              <span className="font-display font-semibold text-on-background">{selectedStudent.name}</span>
              <span className="text-on-surface-variant">— {GRADE_LABELS[selectedStudent.gradeLevel]}</span>
            </div>
          )}
          <h2 className="font-display font-semibold text-on-background text-headline-md mb-5">Öğretmen seçin</h2>
          {visibleEducators.length === 0 ? (
            <p className="text-body-md text-on-surface-variant">
              {selectedStudent ? `${GRADE_LABELS[selectedStudent.gradeLevel]} seviyesine ders veren onaylı öğretmen bulunmuyor.` : "Şu anda onaylı öğretmen bulunmuyor."}
            </p>
          ) : (
            <div className="space-y-3">
              {visibleEducators.map((e) => (
                <button key={e.id} onClick={() => { setSelectedEducator(e); loadSlots(e); setStep(3); }}
                  className={`w-full border-2 rounded-md p-4 text-left transition-all ${
                    selectedEducator?.id === e.id ? "border-primary bg-primary-fixed" : "border-outline-variant hover:border-primary bg-surface-container-low hover:bg-surface-container"
                  }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-display font-semibold text-on-background">{e.name}</p>
                      {e.bio && <p className="text-body-md text-on-surface-variant mt-0.5 line-clamp-1">{e.bio}</p>}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {e.subjects.map((s) => (
                          <span key={s} className="text-caption bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full font-semibold">
                            {SUBJECT_LABELS[s] ?? s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="font-display text-headline-md text-primary ml-4 shrink-0">{formatCurrency(e.hourlyRate)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
          <button onClick={() => setStep(1)} className="mt-4 text-label-md text-on-surface-variant hover:text-on-background transition">← Geri</button>
        </div>
      )}

      {/* ── Adım 3: Ders + Sınıf + Saat + Not ── */}
      {step === 3 && selectedEducator && (
        <div className="bg-surface-container-lowest rounded-md border border-outline-variant/20 p-6 space-y-5 soft-card-static">
          <div>
            <h2 className="font-display font-semibold text-on-background text-headline-md">Ders ve saat seçin</h2>
            <p className="text-body-md text-on-surface-variant mt-0.5">{selectedEducator.name} · {formatCurrency(selectedEducator.hourlyRate)}/saat</p>
          </div>

          {/* Sınıf — öğrenciye sabit (sadece bilgi) */}
          <div>
            <label className="block text-label-md font-semibold text-on-background mb-2">Sınıf</label>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-fixed text-on-primary-fixed text-label-md font-semibold">
              {selectedStudent ? GRADE_LABELS[selectedStudent.gradeLevel] : (selectedGrade ? GRADE_LABELS[selectedGrade] : "—")}
              {selectedStudent && <span className="text-on-primary-fixed/70 font-normal">· {selectedStudent.name}</span>}
            </span>
          </div>

          {/* Dersler — öğretmenin branşları ∩ bu sınıfın müfredatı */}
          <div>
            <label className="block text-label-md font-semibold text-on-background mb-2">Dersler</label>
            {availableSubjects === null ? (
              <p className="text-caption text-on-surface-variant">Dersler yükleniyor…</p>
            ) : subjectsForStudent.length === 0 ? (
              <p className="text-caption text-on-surface-variant">Bu öğretmenin bu sınıf seviyesinde verdiği ders bulunmuyor.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {subjectsForStudent.map((s) => (
                  <button key={s} onClick={() => { setSelectedSubject(s as Subject); setSelectedTopic(null); }}
                    className={`px-4 py-2 rounded-full text-label-md font-semibold border-2 transition-all ${
                      selectedSubject === s
                        ? "border-primary bg-primary text-on-primary"
                        : "border-outline-variant text-on-surface-variant hover:border-primary bg-surface-container"
                    }`}>
                    {SUBJECT_LABELS[s] ?? s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Konu Seçimi */}
          {selectedSubject && selectedGrade && (
            <div className="bg-surface-container rounded-md p-4 border border-outline-variant/20">
              {selectedGrade ? (
                <TopicSelector
                  subject={selectedSubject}
                  gradeLevel={parseInt(selectedGrade.match(/\d+$/)?.[0] || "1", 10)}
                  onSelect={(id, name) => setSelectedTopic({ id, name })}
                  selected={selectedTopic?.id}
                />
              ) : (
                <p className="text-caption text-on-surface-variant">Önce sınıf seçiniz.</p>
              )}
            </div>
          )}

          {/* Uygun Saatler */}
          <div>
            <label className="block text-label-md font-semibold text-on-background mb-2">Uygun Saatler</label>
            {loadingSlots ? (
              <p className="text-body-md text-on-surface-variant">Müsait saatler yükleniyor...</p>
            ) : sortedDates.length === 0 ? (
              <div className="bg-tertiary-fixed border border-on-tertiary-fixed/10 rounded-md p-4 text-body-md text-on-tertiary-fixed">
                Bu öğretmenin şu an müsait saati bulunmuyor.
              </div>
            ) : (
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {sortedDates.map((date) => (
                  <div key={date}>
                    <p className="text-caption font-semibold text-on-surface-variant uppercase tracking-wide mb-2">
                      {new Date(date + "T12:00:00").toLocaleDateString("tr-TR", {
                        weekday: "long", day: "numeric", month: "long",
                      })}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {slotsByDate[date].map((slot) => (
                        <button key={slot.id} onClick={() => setSelectedSlot(slot)}
                          className={`px-4 py-2 rounded-full text-label-md font-semibold border-2 transition-all ${
                            selectedSlot?.id === slot.id
                              ? "border-primary bg-primary text-on-primary"
                              : "border-outline-variant text-on-surface-variant hover:border-primary bg-surface-container"
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
            <label className="block text-label-md font-semibold text-on-background mb-2">
              Ders Notu <span className="text-on-surface-variant font-normal">(isteğe bağlı)</span>
            </label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
              placeholder="Hangi konularda yardım istediğinizi, öğrencinin seviyesini veya özel beklentilerinizi yazabilirsiniz..."
              className="w-full bg-surface-container rounded-md px-5 py-3 text-on-background placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition resize-none" />
          </div>

          <div className="flex gap-3 items-center">
            <button onClick={() => { setSelectedSlot(null); setStep(selectedEducator ? 2 : 2); }}
              className="text-label-md text-on-surface-variant hover:text-on-background transition">← Geri</button>
            <button disabled={!selectedSlot || !selectedSubject || !selectedGrade || !selectedTopic} onClick={() => setStep(4)}
              className="ml-auto rounded-full squishy-btn bg-primary text-on-primary px-6 py-3 text-label-md font-semibold disabled:opacity-50 transition">
              İleri →
            </button>
          </div>
        </div>
      )}

      {/* ── Adım 4: Onayla ── */}
      {step === 4 && selectedStudent && selectedEducator && selectedSubject && selectedSlot && selectedGrade && selectedTopic && (
        <div className="bg-surface-container-lowest rounded-md border border-outline-variant/20 p-6 soft-card-static">
          <h2 className="font-display font-semibold text-on-background text-headline-md mb-5">Randevu Özeti</h2>

          <div className="bg-primary-fixed rounded-md p-5 space-y-3 mb-5 border border-primary/20">
            <h3 className="font-display text-headline-md text-on-primary-fixed mb-3">Ders Detayları</h3>
            {[
              { label: "Öğrenci", value: selectedStudent.name },
              { label: "Öğretmen", value: selectedEducator.name },
              { label: "Ders", value: SUBJECT_LABELS[selectedSubject] ?? selectedSubject },
              { label: "Sınıf", value: GRADE_LABELS[selectedGrade] ?? selectedGrade },
              { label: "Konu", value: selectedTopic.name },
              {
                label: "Tarih",
                value: new Date(selectedSlot.date + "T12:00:00").toLocaleDateString("tr-TR", {
                  weekday: "long", day: "numeric", month: "long",
                }),
              },
              { label: "Saat", value: `${selectedSlot.startTime} – ${selectedSlot.endTime}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-body-md">
                <span className="text-on-primary-fixed/70">{label}</span>
                <span className="font-semibold text-on-primary-fixed">{value}</span>
              </div>
            ))}
            {notes && (
              <div className="pt-2 border-t border-primary/20">
                <span className="text-caption text-on-primary-fixed/60 block mb-1">Not</span>
                <p className="text-body-md text-on-primary-fixed italic">{notes}</p>
              </div>
            )}
            <div className="border-t border-primary/20 pt-3 flex justify-between items-center">
              <span className="font-display font-semibold text-on-primary-fixed">Ders Ücreti</span>
              <span className="font-display text-headline-md text-on-primary-fixed">{formatCurrency(selectedEducator.hourlyRate)}</span>
            </div>
          </div>

          <div className="bg-tertiary-fixed border border-on-tertiary-fixed/10 rounded-md p-4 text-body-md text-on-tertiary-fixed mb-5">
            Talebiniz gönderildikten sonra öğretmen onaylayacak. Onay geldiğinde size e-posta ve bildirim gönderilecek, ardından ödeme yapabileceksiniz.
          </div>

          {error && <p className="text-on-error-container bg-error-container rounded-md px-4 py-3 text-body-md mb-4">{error}</p>}

          <div className="flex gap-3 items-center">
            <button onClick={() => setStep(3)} className="text-label-md text-on-surface-variant hover:text-on-background transition">← Geri</button>
            <button onClick={handleConfirm} disabled={submitting}
              className="flex-1 rounded-full squishy-btn bg-primary text-on-primary px-6 py-3 text-label-md font-semibold disabled:opacity-50 transition">
              {submitting ? "Gönderiliyor..." : "Randevu Talebi Gönder"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
