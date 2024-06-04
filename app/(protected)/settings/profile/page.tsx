"use server"

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




const ProfilePage = async () => {

    const session = await auth()
    const user = session?.user
    const post = await GetUserPostsById(user?.id,1)
    const totalPostCount = post?.totalPostCount
    const friends = await getUserFreinds()
    ////TODO: Compouse in one client component 
    return ( 
      
      
        <div className="">

            <EditProfile />
            {/* <TabSwitch 
                friendsTotal={friends?.userFriendsList?.length}
                postTotal={totalPostCount}
                chilldrenPosts={[
                    <PostModal/>,
                    <UserPostList serverPosts={post.posts} profile={user?.id} totalPostCount={totalPostCount}/>      
                ]}
                chilldrenFriends={[
                    <IncomeOfferList/>,
                    <UserFriends/>
                ]}
                /> */}
        </div>

      

     );
}
 
export default ProfilePage;