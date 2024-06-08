"use server"

import { auth } from "@/auth";
import EditProfile from "@/components/profile/EditProfile";
import ProfileTabs from "@/components/profile/navigation/Tabs";
import QueryProvider from "@/util/QueryProvider";



const ProfilePage = async () => {

    const session = await auth()
    const user = session?.user
    // const post = await GetUserPostsById(user?.id,1)
    // const totalPostCount = post?.totalPostCount
    // const friends = await getUserFreinds()
    ////TODO: Compouse in one client component 



    return ( 
      
      
        <div className="">
            <QueryProvider>
                <EditProfile />
                <ProfileTabs userId={user.id}/>
            </QueryProvider>
        </div>

      

     );
}
 
export default ProfilePage;