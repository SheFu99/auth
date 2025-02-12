// app/profile/[userId].tsx
// "use client"
'use server'


import PublicProfile from "@/components/profile/PublicProfile";
import { getProfileByShortName, getPublicProfile } from "@/actions/UserProfile";
import TabSwitch from "@/components/profile/Tabs";
import PublicProfileFriends from "@/components/profile/friends/publicProfileFriends";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import queryClientConfig from "@/lib/QueryClient";
import QueryProvider from "@/util/QueryProvider";
import InfinitePostList from "@/components/profile/post/postCard/lists/InfinitePostList";
import { prefetchFriendList, prefetchPostList } from "@/lib/reactQueryHooks/prefetchPost";
import { cache } from "react";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import SessionProviderWrapper from "@/app/(protected)/sessionProviderWrapper";

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
  const paramsid = await params.id
  const {profile,error,friendStatus}= await getProfileByShortName(paramsid)
  console.log('error_friendStatus',friendStatus)
  // console.log('profile?.userId',profile?.userId)
  await prefetchPostList(profile?.userId||paramsid)
  await prefetchFriendList(profile?.userId||paramsid)

  const search = searchParams?.search

  const dehydratedState = dehydrate(queryClientConfig);

      const session = await getServerSession()

      const sessionUser =session?.user



      
    return (
      <SessionProviderWrapper session={session}>
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
      </SessionProviderWrapper>
      
      );
}
