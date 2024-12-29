// components/SessionProviderWrapper.tsx (Client Component)
"use client";

import { SessionProvider } from "next-auth/react";

const SessionProviderWrapper = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default SessionProviderWrapper;
