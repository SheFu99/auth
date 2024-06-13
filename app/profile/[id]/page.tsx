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
import { prefetchPostList } from "@/lib/prefetchQuery";
import { getUserListByName } from "@/actions/search/users";



export default async function PublicProfileParams({
  params,
  searchParams,
}) {
  // console.log(params)

   await prefetchPostList(params?.id)
  const search = searchParams?.search
  console.log(search)
  const dehydratedState = dehydrate(queryClientConfig)

      const session = await auth()
      const sessionUser =session?.user
      const profile = await getPublicProfile(params.id)
      const userPostList = await GetUserPostsById(profile?.profile?.userId,1)
     
       const {postResult,error,success} = await getUserListByName({pageParams:1,name:search})
    
     
     const userfriendsList = await getProfileFriends(profile?.profile?.userId)
      

  console.log(userfriendsList)
    //  const {userPostList,userfriendsList} = await isProfileExist(profile)
     

    return (
      <QueryProvider>
        <HydrationBoundary state={dehydratedState}>
          
          <div>
            {!profile.error?(
              <div className="border rounded-xl">
                <PublicProfile profile={profile}  sessionUser={sessionUser}/>
                    <TabSwitch
                    chilldrenFriends={<PublicProfileFriends friendsList={userfriendsList.profileFirendsList} search={search}/> }
                    chilldrenPosts={<InfinitePostList  userId={params.id} sessionUser={sessionUser}/>}
                    postTotal={userPostList.totalPostCount}
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
