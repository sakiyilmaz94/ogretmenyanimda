import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  const { name, email, password, role, diplomaUrl, idCardUrl } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Tüm alanları doldurun." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Şifre en az 8 karakter olmalıdır." }, { status: 400 });
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Bu e-posta adresi zaten kullanımda." }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const userRole = role === "EDUCATOR" ? Role.EDUCATOR : Role.PARENT;

  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: userRole,
    },
  });

  if (userRole === Role.PARENT) {
    await db.parent.create({ data: { userId: user.id } });
  } else if (userRole === Role.EDUCATOR) {
    await db.educator.create({
      data: {
        userId: user.id,
        hourlyRate: 0,
        status: "PENDING",
        diplomaUrl: diplomaUrl || null,
        idCardUrl: idCardUrl || null,
      },
    });
  }

  return NextResponse.json({ success: true });
}
