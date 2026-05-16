import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin.2026!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@ogretmenyanimda.com.tr" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@ogretmenyanimda.com.tr",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  console.log("✅ Admin oluşturuldu:", admin.email);
  console.log("🔑 Şifre: Admin.2026!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
