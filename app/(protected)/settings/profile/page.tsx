"use client"

import { GetUserPostsById } from "@/actions/UserPosts";
import { getUserFreinds } from "@/actions/friends";
import getUserPosts from "@/app/api/posts/[userId]";
import { auth } from "@/auth";
import EditProfile from "@/components/profile/EditProfile";
import TabSwitch from "@/components/profile/Tabs";
import PostModal from "@/components/profile/cropper/Post-modal";
import IncomeOfferList from "@/components/profile/friends/incomeOfferList";
import UserFriends from "@/components/profile/friends/privateUserFriends";
import UserPostList from "@/components/profile/post/private/UserPostList";
import QueryProvider from "@/util/QueryProvider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';






const ProfilePage =  () => {

    // const session = await auth()
    // const user = session?.user
    // const post = await GetUserPostsById(user?.id,1)
    // const totalPostCount = post?.totalPostCount
    // const friends = await getUserFreinds()
    ////TODO: Compouse in one client component 



    return ( 
      
      
        <div className="">
            <QueryProvider>
                <EditProfile />
            </QueryProvider>
        </div>

      

     );
}
 
export default ProfilePage;