import { NextResponse } from "next/server";
import { initializeDb } from "@/lib/db/db";

export async function GET() {
  try {
    await initializeDb();
    return NextResponse.json({ message: 'Database initialized' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to initialize database' });
  }
}