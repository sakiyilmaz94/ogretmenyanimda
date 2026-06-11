import { auth } from "@/auth";
import { db } from "@/lib/db";
import AccountForm from "@/components/dashboard/AccountForm";

export const dynamic = "force-dynamic";

export default async function ParentAccountPage() {
  const session = await auth();
  const parent = await db.parent.findUnique({
    where: { userId: session!.user.id },
    include: { user: true },
  });
  if (!parent) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-headline-lg text-on-background">Hesabım</h1>
        <p className="text-body-md text-on-surface-variant">Kişisel bilgileriniz ve bildirim tercihleriniz</p>
      </div>
      <AccountForm
        initial={{
          name: parent.user.name ?? "",
          email: parent.user.email,
          phone: parent.phone ?? "",
          lessonReminder: parent.lessonReminder,
          paymentNotification: parent.paymentNotification,
        }}
      />
    </div>
  );
}
