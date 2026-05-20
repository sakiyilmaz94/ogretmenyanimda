import { db } from "@/lib/db";
import { SUBJECT_LABELS, GRADE_LABELS, formatCurrency } from "@/lib/utils";
import LessonApprovalActions from "@/components/dashboard/LessonApprovalActions";

export default async function DersOnaylariPage() {
  const lessons = await db.educatorLesson.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      educator: { include: { user: true } },
      lessonProgram: true,
    },
  });

  const pending = lessons.filter((l) => l.status === "PENDING_APPROVAL");
  const approved = lessons.filter((l) => l.status === "APPROVED");
  const rejected = lessons.filter((l) => l.status === "REJECTED");

  const sections = [
    { title: "Onay Bekleyen", list: pending, color: "text-amber-700", bg: "bg-amber-50", badge: "bg-amber-100 text-amber-700" },
    { title: "Onaylananlar", list: approved, color: "text-green-700", bg: "bg-green-50", badge: "bg-green-100 text-green-700" },
    { title: "Reddedilenler", list: rejected, color: "text-red-700", bg: "bg-red-50", badge: "bg-red-100 text-red-700" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Ders Onayları</h1>
        <p className="text-slate-500 text-sm mt-0.5">Öğretmenlerin fiyatlandırdığı ders programı başvuruları</p>
      </div>

      {sections.map((sec) => sec.list.length > 0 && (
        <section key={sec.title}>
          <h2 className={`text-base font-semibold mb-4 ${sec.color}`}>
            {sec.title} ({sec.list.length})
          </h2>
          <div className="space-y-3">
            {sec.list.map((lesson) => (
              <div key={lesson.id} className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-navy-900">{lesson.educator.user.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sec.badge}`}>
                        {sec.title.replace(" Bekleyen", "")}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm">{lesson.lessonProgram.name}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-xs bg-navy-50 text-navy-700 px-2 py-0.5 rounded-full">{SUBJECT_LABELS[lesson.lessonProgram.subject]}</span>
                      <span className="text-xs bg-gold-50 text-gold-700 px-2 py-0.5 rounded-full">{GRADE_LABELS[lesson.lessonProgram.gradeLevel]}</span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{lesson.lessonProgram.durationMin} dk</span>
                    </div>
                    {lesson.rejectionNote && (
                      <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-1.5 mt-1">Red gerekçesi: {lesson.rejectionNote}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl font-bold text-navy-900">{formatCurrency(lesson.price.toNumber())}</p>
                      <p className="text-xs text-slate-400">/ ders</p>
                    </div>
                    {lesson.status === "PENDING_APPROVAL" && (
                      <LessonApprovalActions lessonId={lesson.id} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {lessons.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <p className="text-4xl mb-4">✅</p>
          <h3 className="font-semibold text-navy-900 mb-2">Onay bekleyen başvuru yok</h3>
          <p className="text-slate-500 text-sm">Öğretmenler ders programı fiyatlandırdığında burada görünür.</p>
        </div>
      )}
    </div>
  );
}
