// components/ClientProfilePage.tsx (Client Component)
"use client";

import QueryProvider from "@/util/QueryProvider";
import { HydrationBoundary } from "@tanstack/react-query";
import EditProfile from "@/components/profile/EditProfile";
import ProfileTabs from "@/components/profile/navigation/Tabs";

const ClientProfilePage = ({ user, dehydratedState }: any) => {
  return (
    <QueryProvider>
      <HydrationBoundary state={dehydratedState}>
        <EditProfile />
        <ProfileTabs userId={user.id}  />
      </HydrationBoundary>
    </QueryProvider>
  );
};

export default ClientProfilePage;
