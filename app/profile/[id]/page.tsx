// app/profile/[userId].tsx
// "use client"

import PublicProfile from "@/components/profile/PublicProfile";
import { getPublicProfile } from "@/actions/UserProfile";
import TabSwitch from "@/components/profile/Tabs";
import PublicProfileFriends from "@/components/profile/friends/publicProfileFriends";
import PublicPostList from "@/components/profile/post/public/PublicUserPost";
import { auth } from "@/auth";
import { isProfileExist } from "./isProfileExist";



export default async function PublicProfileParams({ params }) {

  console.log('render_public_profile')
      const session = await auth()
      const sessionUser =session?.user
      const profile = await getPublicProfile(params.id)
    
     const {userPostList,userfriendsList} = await isProfileExist(profile)
     

    return (
      <div>
        
        {!profile.error?(
          <>
            <PublicProfile profile={profile}  sessionUser={sessionUser}/> 
            {userPostList&&userfriendsList&&(
                <TabSwitch 
                chilldrenFriends={<PublicProfileFriends friendsList={userfriendsList.profileFirendsList}/> }
                chilldrenPosts={<PublicPostList postList={userPostList.posts} totalCount={userPostList.totalPostCount} userId={params.id} sessionUser={sessionUser}/>}
                postTotal={userPostList.totalPostCount}
                />
            )}
          </>
        ):(
          <div>
            <p>Profile is not found</p>
          </div>
        )}
       
       
              

         

      </div>
      
      );
}
