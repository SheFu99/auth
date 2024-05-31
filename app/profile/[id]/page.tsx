// app/profile/[userId].tsx
// "use client"

import PublicProfile from "@/components/profile/PublicProfile";
import { getPublicProfile } from "@/actions/UserProfile";
import { Suspense, useCallback, useEffect, useState } from "react";
import {  FadeLoader } from "react-spinners";
import { GetUserPostsById } from "@/actions/UserPosts";
import { getProfileFriends } from "@/actions/friends";
import TabSwitch from "@/components/profile/Tabs";
import PublicProfileFriends from "@/components/profile/friends/publicProfileFriends";
import UserPostList from "@/components/profile/post/private/UserPostList";
import PublicPostList from "@/components/profile/post/public/PublicUserPost";
import ListSkeleton from "@/components/profile/friends/FriendSkeleton";
import { currentUser } from "@/lib/auth";



export default async function PublicProfileParams({ params }) {

  console.log('render!@')
      const sessionUser = await currentUser()
      const profile = await getPublicProfile(params.id)
      const userPostList = await GetUserPostsById(params.id,1)
      const userfriendsList = await getProfileFriends(params.id)



    return (
      <div>
      
         <PublicProfile profile={profile} sessionUser={sessionUser}/> 
              {userPostList&&userfriendsList&&(
                  // <Suspense fallback={<ListSkeleton/>}>
                  <TabSwitch 
                  chilldrenFriends={<PublicProfileFriends friendsList={userfriendsList.profileFirendsList} /> }
                  chilldrenPosts={<PublicPostList postList={userPostList.posts} totalCount={userPostList.totalPostCount} userId={params.id}  sessionUser={sessionUser}/>}
                  postTotal={userPostList.totalPostCount}
                  />
                  // </Suspense>
              )}
         

              

         

      </div>
      
      );
}
