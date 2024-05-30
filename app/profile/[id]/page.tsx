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



export default async function PublicProfileParams({ params }) {
  // const [profile,setProfile]=useState<any>({})
  
  
  // const getProfile= async()=>{
    // try {
      const profile = await getPublicProfile(params.id)
      const userPostList = await GetUserPostsById(params.id,1)
      const userfriendsList = await getProfileFriends(params.id)

      console.log(userfriendsList)

      console.log(userPostList)
      // setProfile(dataFromDb)
      // return 
    // } catch (error) {
      // console.log(error)
      // setProfile(undefined)
      // return 
    // }
  // };


    // const getMemoProfile = useCallback(async ()=>{
    //    await getProfile()
    //   console.log('Get_Profile')
    // },[params])
    
    // useEffect(()=>{
    //   getMemoProfile()
    // },[getMemoProfile])


// if(!profile){
//   return <FadeLoader color="white"/>
// }

// if(profile?.error){
//   return <p>Profile not found</p>
// }
 
    return (
      <div>
      
         <PublicProfile profile={profile}  /> 
              {userPostList&&userfriendsList&&(
                  <Suspense fallback={<ListSkeleton/>}>
                  <TabSwitch 
                  chilldrenFriends={<PublicProfileFriends friendsList={userfriendsList.profileFirendsList}/> }
                  chilldrenPosts={<PublicPostList postList={userPostList.posts} totalCount={userPostList.totalPostCount} userId={params.id}/>}
                  postTotal={userPostList.totalPostCount}
                  />
                  </Suspense>
              )}
         

              

         

      </div>
      
      );
}
