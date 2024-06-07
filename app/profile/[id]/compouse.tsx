'use client'

import PublicProfile from "@/components/profile/PublicProfile";
import TabSwitch from "@/components/profile/Tabs";
import PublicProfileFriends from "@/components/profile/friends/publicProfileFriends";
import PublicPostList from "@/components/profile/post/public/PublicUserPost";
import { ExtendedUser } from "@/next-auth";
import { SessionProvider } from "next-auth/react";

interface CompousePAgeProps {
    profile:any,
    sessionUser:ExtendedUser,
    userPostList:any,
    userfriendsList:any,
}

const CompousePage: React.FC<CompousePAgeProps> = ({profile,sessionUser,userPostList,userfriendsList}) => {
    return (
        <>
        <PublicProfile profile={profile} sessionUser={sessionUser}/> 
        {/* <SessionProvider> */}
              {userPostList&&userfriendsList&&(
                  // <Suspense fallback={<ListSkeleton/>}>
                  <TabSwitch
                  chilldrenFriends={<PublicProfileFriends friendsList={userfriendsList.profileFirendsList} /> }
                  chilldrenPosts={<PublicPostList userId={sessionUser.id}  sessionUser={sessionUser}/>}
                  postTotal={userPostList.totalPostCount}
                  />
                  // </Suspense>
              )}
              {/* </SessionProvider> */}
         </>
      );
}
 
export default CompousePage;