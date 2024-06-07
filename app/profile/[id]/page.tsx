// app/profile/[userId].tsx
// "use client"

import PublicProfile from "@/components/profile/PublicProfile";
import { getPublicProfile } from "@/actions/UserProfile";
import TabSwitch from "@/components/profile/Tabs";
import PublicProfileFriends from "@/components/profile/friends/publicProfileFriends";
import PublicPostList from "@/components/profile/post/public/PublicUserPost";
import { auth } from "@/auth";
import { isProfileExist } from "./isProfileExist";
import { getProfileFriends } from "@/actions/friends";
import { GetUserPostsById } from "@/actions/UserPosts";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import prefetchPost from "@/lib/prefetchQuery";
import queryClientConfig from "@/lib/QueryClient";
import QueryProvider from "@/util/QueryProvider";



export default async function PublicProfileParams({ params }) {

  const prefetchedPost = await prefetchPost(params?.id)
  console.log(prefetchedPost)
  
  const dehydratedState = dehydrate(queryClientConfig)
  console.log(dehydratedState)
      const session = await auth()
      const sessionUser =session?.user
      const profile = await getPublicProfile(params.id)
      const userPostList = await GetUserPostsById(profile?.profile?.userId,1)
      const userfriendsList = await getProfileFriends(profile?.profile?.userId)
  
    //  const {userPostList,userfriendsList} = await isProfileExist(profile)
     

    return (
      <QueryProvider>
        <HydrationBoundary state={dehydratedState}>
          
          <div>
            {!profile.error?(
              <div className="border rounded-lg">
                <PublicProfile profile={profile}  sessionUser={sessionUser}/>
          
                    <TabSwitch
                    chilldrenFriends={<PublicProfileFriends friendsList={userfriendsList.profileFirendsList}/> }
                    chilldrenPosts={<PublicPostList  userId={params.id} sessionUser={sessionUser}/>}
                    postTotal={userPostList.totalPostCount}
                    />
          
              </div>
            ):(
              <div>
                <p>Profile is not found</p>
              </div>
            )}
          </div>
        </HydrationBoundary>
      </QueryProvider>
      
      );
}
