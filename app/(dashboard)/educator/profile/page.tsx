import { auth } from "@/auth";
import { db } from "@/lib/db";
import EducatorProfileForm from "@/components/dashboard/EducatorProfileForm";

export default async function EducatorProfilePage() {
  const session = await auth();
  const educator = await db.educator.findUnique({
    where: { userId: session!.user.id },
    include: { user: true },
  });
  if (!educator) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Profilim</h1>
        <p className="text-slate-500 text-sm">Bilgilerinizi güncelleyin ve profilinizi yayına alın</p>
      </div>
      <EducatorProfileForm
        educator={{
          id: educator.id,
          bio: educator.bio,
          subjects: educator.subjects,
          gradeLevels: educator.gradeLevels,
          hourlyRate: educator.hourlyRate.toNumber(),
          phone: educator.phone,
          photoUrl: educator.photoUrl,
          titleName: educator.titleName,
          experience: educator.experience,
          skills: educator.skills,
          certificates: educator.certificates,
          linkedinUrl: educator.linkedinUrl,
          isProfilePublic: educator.isProfilePublic,
          user: { name: educator.user.name, email: educator.user.email },
        }}
      />
    </div>
  );
}
