// app/profile/[userId].tsx
// "use client"

import PublicProfile from "@/components/profile/PublicProfile";
import { getProfileByShortName, getPublicProfile } from "@/actions/UserProfile";
import TabSwitch from "@/components/profile/Tabs";
import PublicProfileFriends from "@/components/profile/friends/publicProfileFriends";
import { getProfileFriends } from "@/actions/friends";
import { GetUserPostsById } from "@/actions/UserPosts";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import queryClientConfig from "@/lib/QueryClient";
import QueryProvider from "@/util/QueryProvider";
import InfinitePostList from "@/components/profile/post/postCard/lists/InfinitePostList";
import { prefetchFriendList, prefetchPostList } from "@/lib/prefetchQuery";
import { getUserListByName } from "@/actions/search/users";
import { cache } from "react";
import { Metadata } from "next";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";

const getProfile = cache(async(postId:string)=>{
  const {profile,error} = await getProfileByShortName(postId)
  if(error){
      return
  }
  return profile
})

export const generateMetadata = async ({params:{id}}):Promise<Metadata> =>{
 const profile = await getProfile(id)
  return {
      title:profile?.firstName ,
      description:`from ${profile?.adres}`,
      openGraph:{
          images: profile?.coverImage || profile?.image
      },
      icons:profile?.image
  }
}

export default async function PublicProfileParams({
  params,
  searchParams
}) {
  const {profile,error,friendStatus}= await getProfileByShortName(params.id)
  // console.log('error',friendStatus)
  // console.log('profile?.userId',profile?.userId)
  await prefetchPostList(profile?.userId||params.id)
  await prefetchFriendList(profile?.userId||params.id)
  const search = searchParams?.search

  const dehydratedState = dehydrate(queryClientConfig);

      const session = await getServerSession()
      const sessionUser =session?.user

      // const {profile,error,friendStatus} = await getPublicProfile(params.id)
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
                    chilldrenFriends={<PublicProfileFriends profileId={profile?.userId}  search={search}/> }
                    chilldrenPosts={<InfinitePostList  userId={profile?.userId} sessionUser={sessionUser}/>}
                    userId={profile?.userId}
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
