// components/SessionProviderWrapper.tsx (Client Component)
"use client";

import { SessionProvider, signIn } from "next-auth/react";
import { useEffect } from "react";

const SessionProviderWrapper = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) => {
  useEffect(() => {
    console.log('Session:',session)
    if (session?.error === "RefreshAccessTokenError") {
      signIn(); // Force sign in to hopefully resolve error
    }
  }, [session]);

  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default SessionProviderWrapper;
