import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plans = await db.pricingPlan.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(plans);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const plan = await db.pricingPlan.create({
    data: {
      name: body.name,
      description: body.description || null,
      price: body.price,
      duration: body.duration,
      features: body.features || [],
      isPopular: body.isPopular || false,
      isActive: body.isActive !== false,
      sortOrder: body.sortOrder || 0,
    },
  });
  return NextResponse.json(plan);
}
