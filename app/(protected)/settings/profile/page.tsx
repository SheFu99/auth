"use server"

import { getCurrentProfile } from "@/actions/UserProfile";
import { getUserListByName } from "@/actions/search/users";
import { auth } from "@/auth";
import EditProfile from "@/components/profile/EditProfile";

import ProfileTabs from "@/components/profile/navigation/Tabs";
import { fetchProfile } from "@/components/profile/post/lib/usePost";
import queryClientConfig from "@/lib/QueryClient";
import { currentUser } from "@/lib/auth";
import { prefetchFriendList, prefetchPostList } from "@/lib/prefetchQuery";
import QueryProvider from "@/util/QueryProvider";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Metadata } from "next";
import { cache } from "react";

const getProfile = cache(async(userId:string)=>{

    const {profile,error} = await getCurrentProfile(userId)
    if(error){
        return
    }
    return profile
  })
  
  export const generateMetadata = async ():Promise<Metadata> =>{
    const user = await currentUser()
   const profile = await getProfile(user?.id)
    return {
        title:'My profile' ,
        description:`from ${profile?.adres}`,
        openGraph:{
            images: profile?.coverImage || profile?.image
        },
        icons:profile?.image
    }
  }

const ProfilePage = async ({searchParams}) => {

  
    const session = await auth()
    const user = session?.user
    await prefetchPostList(user.id)
    await prefetchFriendList(user?.id)

    const dehydratedState = dehydrate(queryClientConfig)
    // console.log('DATA:',profile)
    const search = searchParams?.search
    let searchResult
    if(search) {
        const {searchResult: postResult,error}= await getUserListByName({name:search,pageParams:1})
        searchResult = postResult
        console.log(searchResult)
    }
    // const post = await GetUserPostsById(user?.id,1)
    // const totalPostCount = post?.totalPostCount
    // const friends = await getUserFreinds()
    ////TODO: Compouse in one client component 



    return ( 
      
      
        <div className="">
            <QueryProvider>
                <HydrationBoundary state={dehydratedState} >
                <EditProfile />
                <ProfileTabs 
                    userId={user.id} 
                    searchParams={search} 
                    searchResult={searchResult}/>
                </HydrationBoundary>
            </QueryProvider>
        </div>

      

     );
}
 
export default ProfilePage;