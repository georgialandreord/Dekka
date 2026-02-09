import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET() {
  try {
    // Attempt to query the database
    await db.$runCommandRaw({ ping: 1 });

    return NextResponse.json(
      {
        status: "healthy",
        database: "connected",
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
