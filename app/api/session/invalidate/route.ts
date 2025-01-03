import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { sessionToken } = await req.json();
    // Validate the session token
    if (!sessionToken || typeof sessionToken !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid session token" },
        { status: 400 }
      );
    }
    console.log('sessionToken',sessionToken)

    // Delete the session from the database
    const deletedSession = await db.account.delete({
      where: { id_token: sessionToken },
    });

    // Check if the session was deleted
    if (!deletedSession) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error invalidating session:", error);
    return NextResponse.json(
      { error: "Failed to invalidate session" },
      { status: 500 }
    );
  }
}
