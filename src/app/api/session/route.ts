// app/api/session/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { role } = await req.json();
  (await cookies()).set("userRole", role, { httpOnly: true });
  return NextResponse.json({ success: true });
}

export async function DELETE() {
  (await cookies()).delete("userRole");
  return NextResponse.json({ success: true });
}
