// app/profile/page.tsx (Server Component)
import { getServerSession } from "next-auth";
import { prefetchFriendList, prefetchPostList } from "@/lib/reactQueryHooks/prefetchPost";
import { authConfig } from "@/auth.config";
import { dehydrate } from "@tanstack/react-query";
import queryClientConfig from "@/lib/QueryClient";
import ClientProfilePage from "./ClientProfilePage";


const ProfilePage = async () => {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    throw new Error("User session is required to view this page");
  }

  // Prefetch posts and friends
  await prefetchPostList(session.user.id);
  await prefetchFriendList(session.user.id);

  const dehydratedState = dehydrate(queryClientConfig);

  return (
    <ClientProfilePage user={session.user} dehydratedState={dehydratedState} />
  );
};

export default ProfilePage;
