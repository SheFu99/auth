// app/auth/telegram-plugin/page.tsx
import { authConfig } from "@/auth.config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { checkWorker } from "@/actions/telegram/checkCurrentUser";

const JWT_SECRET = process.env.JWT_SECRET as string;

export default async function TelegramTokenPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  // ✅ Extract token correctly
  const token = searchParams?.token;

  if (!token) {
    return <p>Error: Token is missing.</p>;
  }

  let decodedToken;
  try {
    // ✅ Verify and decode the JWT token
    decodedToken = jwt.verify(token, JWT_SECRET);
    console.log("Decoded token:", decodedToken);
  } catch (error) {
    console.error("Invalid Token:", error);
    return <p>Error: Invalid or expired token.</p>;
  }

  // ✅ Get user session from NextAuth
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    return redirect("/auth/signin");
  }
  const existingWorker = await checkWorker({tgId:decodedToken.jwtid})
  const existingWorkerDateTime = existingWorker.updateTime
  const userId = session.user.id;

  // ✅ Send request to external service
  const externalServiceUrl = process.env.N8N_TG_WEBHOOK


if(existingWorker){
  return (
    <div>
      <p>You already have pluged-in at:</p>
      {existingWorkerDateTime.toDateString()}
    </div>
  )
}



  try {
    const response = await fetch(externalServiceUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, decodedToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to send token");
    }

  

    return <div>
                <p>Successfully linked Telegram extension!</p>
                  {existingWorkerDateTime.toDateString()}
            </div>;
  } catch (error) {
    console.error("Error:", error);
    return <div>
      <p>Error processing request.</p>
      {existingWorkerDateTime?.toDateString()}

      </div>
  }
}
