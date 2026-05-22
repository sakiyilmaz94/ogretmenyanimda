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
    {
      title: "Onay Bekleyen",
      list: pending,
      badgeClass: "bg-tertiary-fixed text-on-tertiary-fixed",
    },
    {
      title: "Onaylananlar",
      list: approved,
      badgeClass: "bg-secondary-container text-on-secondary-container",
    },
    {
      title: "Reddedilenler",
      list: rejected,
      badgeClass: "bg-error-container text-on-error-container",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="font-display text-headline-md text-on-background">Ders Onayları</h1>
        <p className="text-label-md text-on-surface-variant mt-0.5">Öğretmenlerin fiyatlandırdığı ders programı başvuruları</p>
      </div>

      {sections.map((sec) => sec.list.length > 0 && (
        <section key={sec.title}>
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-caption font-semibold px-3 py-1 rounded-full ${sec.badgeClass}`}>
              {sec.title} ({sec.list.length})
            </span>
          </div>
          <div className="space-y-3">
            {sec.list.map((lesson) => (
              <div key={lesson.id} className="bg-surface-container-lowest rounded-md border border-outline-variant/20 p-5 soft-card-static">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-on-background text-body-md">{lesson.educator.user.name}</span>
                      <span className={`text-caption px-2 py-0.5 rounded-full font-semibold ${sec.badgeClass}`}>
                        {sec.title.replace(" Bekleyen", "")}
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-body-md">{lesson.lessonProgram.name}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-caption bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded-full font-medium">{SUBJECT_LABELS[lesson.lessonProgram.subject]}</span>
                      <span className="text-caption bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full font-medium">{GRADE_LABELS[lesson.lessonProgram.gradeLevel]}</span>
                      <span className="text-caption bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full font-medium">{lesson.lessonProgram.durationMin} dk</span>
                    </div>
                    {lesson.rejectionNote && (
                      <p className="text-body-md text-on-error-container bg-error-container rounded-lg px-3 py-1.5 mt-1">Red gerekçesi: {lesson.rejectionNote}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-display text-headline-md text-on-background">{formatCurrency(lesson.price.toNumber())}</p>
                      <p className="text-caption text-on-surface-variant">/ ders</p>
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
        <div className="bg-surface-container-lowest rounded-md p-12 text-center soft-card-static border border-outline-variant/20">
          <div className="bg-primary-fixed rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-on-primary-fixed-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-display text-headline-md text-on-background mb-2">Onay bekleyen başvuru yok</h3>
          <p className="text-label-md text-on-surface-variant">Öğretmenler ders programı fiyatlandırdığında burada görünür.</p>
        </div>
      )}
    </div>
  );
}
