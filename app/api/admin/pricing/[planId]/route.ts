import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ planId: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { planId } = await params;
  const body = await req.json();

  const plan = await db.pricingPlan.update({
    where: { id: planId },
    data: {
      name: body.name,
      description: body.description,
      price: body.price,
      duration: body.duration,
      features: body.features,
      isPopular: body.isPopular,
      isActive: body.isActive,
      sortOrder: body.sortOrder,
    },
  });
  return NextResponse.json(plan);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ planId: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { planId } = await params;
  await db.pricingPlan.delete({ where: { id: planId } });
  return NextResponse.json({ ok: true });
}
