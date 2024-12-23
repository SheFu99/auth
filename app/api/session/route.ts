import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Validate ID
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Missing or invalid user ID" }, { status: 400 });
    }

    // Query the database
    const user = await db.user.findUnique({
      where: { id },
    });

    // Handle user not found
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the user data
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
