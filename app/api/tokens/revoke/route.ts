import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { token, provider } = body;

    // Validate the input
    if (!token || !provider) {
      return NextResponse.json(
        { error: "Missing token or provider" },
        { status: 400 }
      );
    }

    let response;
    switch (provider) {
      case "github":
        response = await revokeGitHubToken(token);
        break;
      case "google":
        response = await revokeGoogleToken(token);
        break;
      default:
        return NextResponse.json(
          { error: "Unsupported provider" },
          { status: 400 }
        );
    }

    if (response.ok) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      const errorDetails = await response.json();
      return NextResponse.json(
        { error: errorDetails },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error revoking token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper: Revoke GitHub Token
async function revokeGitHubToken(accessToken: string) {
  const url = `https://api.github.com/applications/${process.env.GITHUB_ID}/token`;
  const credentials = `${process.env.GITHUB_ID}:${process.env.GITHUB_SECRET}`;
  const authHeader = `Basic ${Buffer.from(credentials).toString("base64")}`;
    
  return await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ access_token: accessToken }),
  });
}

// Helper: Revoke Google Token
async function revokeGoogleToken(accessToken: string) {
  const url = `https://oauth2.googleapis.com/revoke?token=${accessToken}`;

  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}
