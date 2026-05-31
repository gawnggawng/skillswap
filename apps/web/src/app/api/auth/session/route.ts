import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@skillswap/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ data: session.user });
}
