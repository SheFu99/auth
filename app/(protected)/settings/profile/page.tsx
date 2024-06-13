"use server"

import { getUserListByName } from "@/actions/search/users";
import { auth } from "@/auth";
import EditProfile from "@/components/profile/EditProfile";

import ProfileTabs from "@/components/profile/navigation/Tabs";
import queryClientConfig from "@/lib/QueryClient";
import { prefetchPostList } from "@/lib/prefetchQuery";
import QueryProvider from "@/util/QueryProvider";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";



const ProfilePage = async ({searchParams}) => {
    console.log(searchParams.search)

  
    const session = await auth()
    const user = session?.user
    await prefetchPostList(user.id)
    const dehydratedState = dehydrate(queryClientConfig)
    // console.log('DATA:',profile)
    const search = searchParams?.search
    let searchResult
    if(search) {
        const {postResult,error}= await getUserListByName({name:search,pageParams:1})
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