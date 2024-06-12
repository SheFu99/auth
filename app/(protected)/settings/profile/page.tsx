"use server"

import { getUserListByName } from "@/actions/search/users";
import { auth } from "@/auth";
import EditProfile from "@/components/profile/EditProfile";
import ProfileTabs from "@/components/profile/navigation/Tabs";
import QueryProvider from "@/util/QueryProvider";



const ProfilePage = async ({searchParams}) => {
    console.log(searchParams.search)
    const search = searchParams?.search
    const session = await auth()
    const user = session?.user
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
                <EditProfile />
                <ProfileTabs userId={user.id} searchParams={search} searchResult={searchResult}/>
            </QueryProvider>
        </div>

      

     );
}
 
export default ProfilePage;