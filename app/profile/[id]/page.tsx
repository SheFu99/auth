// app/profile/[userId].tsx
// "use client"

import PublicProfile from "@/components/profile/PublicProfile";
import { getPublicProfile } from "@/actions/UserProfile";
import TabSwitch from "@/components/profile/Tabs";
import PublicProfileFriends from "@/components/profile/friends/publicProfileFriends";
import { auth } from "@/auth";
import { getProfileFriends } from "@/actions/friends";
import { GetUserPostsById } from "@/actions/UserPosts";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import queryClientConfig from "@/lib/QueryClient";
import QueryProvider from "@/util/QueryProvider";
import InfinitePostList from "@/components/profile/post/postCard/lists/InfinitePostList";
import { prefetchFriendList, prefetchPostList } from "@/lib/prefetchQuery";
import { getUserListByName } from "@/actions/search/users";



export default async function PublicProfileParams({
  params,
  searchParams
}) {

  await prefetchPostList(params?.id)
  await prefetchFriendList(params?.id)
  const search = searchParams?.search

  const dehydratedState = dehydrate(queryClientConfig);

      const session = await auth()
      const sessionUser =session?.user
      const {profile,error,friendStatus} = await getPublicProfile(params.id)
     const userfriendsList = await getProfileFriends({userId:profile?.userId})


      
    return (
      <QueryProvider>
        <HydrationBoundary state={dehydratedState}>
          
          <div>
            {!error?(
              <div className="border rounded-xl">
                <PublicProfile 
                  profile={profile} 
                  friendStatus={friendStatus}  
                  sessionUser={sessionUser}
                  />
                    <TabSwitch
                    chilldrenFriends={<PublicProfileFriends profileId={params.id}  search={search}/> }
                    chilldrenPosts={<InfinitePostList  userId={params.id} sessionUser={sessionUser}/>}
                    userId={params.id}
                    />
              </div>
            ):(
              <div>
                <h1 className="text-[12rem]">404</h1>
                <p className="text-[3rem]">Profile is not exist</p>
              </div>
            )}
          </div>
        </HydrationBoundary>
      </QueryProvider>
      
      );
}
