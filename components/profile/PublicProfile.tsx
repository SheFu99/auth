"use client"
import React, {  Suspense, useState } from "react";
import {  FaUser } from "react-icons/fa";
import {  RiProfileLine } from 'react-icons/ri';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {  FadeLoader } from "react-spinners";
import {  relation } from "@/actions/UserProfile";
import { useCurrentUser } from "@/hooks/use-current-user";
import AvatarWithFallback from "../ui/AvatarCoustom";
import FriendStatusButton from "./friends/function/publicFriendButton";

import ListSkeleton from "./friends/FriendSkeleton";
import PublicAccordion from "./post/public/profileAccordion";
import { ProfileData } from "../types/globalTs";
const Cover = React.lazy(() => import("./Cover"))
const PublicProfileFriends = React.lazy(()=> import ('./friends/publicProfileFriends'))
const UserPostList = React.lazy(()=>import('./post/private/UserPostList'))


export interface Profile{
    profile:profileProps,
}
interface profileProps {
    profile:ProfileData;
    friendStatus:relation

}

const  PublicProfile =  ({profile}:Profile) => {

const [totalPostCount,setTotalCount]=useState<number>(0)
const [friendsLength,setFriendsLength] = useState<number>(0)
const user = useCurrentUser()
const userId = profile?.profile?.userId
const isTheSameUser = user?.id === userId

                      console.log(profile)


//   const getListOfFriends =useCallback(()=>{
//     getProfileFriends(userId)
//         .then(response=>{
//             console.log(response)
//         })
//         ///need to retrieve profile list length
//   },[profile?.profile?.userId]) 
//   useEffect(()=>{
//     getListOfFriends()
//   },[getListOfFriends])

 if(!profile){
    return <FadeLoader/>
 }

  return (
    
    <div className="col-span-12 grid-row-6 ">
        <div className=''>
        
        <div>
                <Cover 
                    url={profile?.profile?.coverImage} 
                    editable={false} 
                    className="z-1 rounded-md shadow-xs col-span-12"
                />
        </div>
            <div className="flex items-center relative ">
                <div className="absolute md:left-0 md:-bottom-15 m-auto w-fit md:p-[1rem] z-30 -bottom-15 left-0 p-[1rem] justify-center ">
                                <AvatarWithFallback
                                 src={profile?.profile?.image}
                                 width={100}
                                 height={100}
                                 alt={profile?.profile?.firstName}
                                />
                </div>


                {user&&!isTheSameUser&&(
                    <div className="absolute -bottom-15  md:right-[4rem] right-8 z-30 bg-black rounded-full ">
                        <FriendStatusButton 
                            friendStatus={profile?.friendStatus}
                            userId={profile.profile?.userId}/>
                    </div>
                )}
              
           
            </div>
        </div>
          

            <div className=" col-start-1 col-span-12 mt-1  bg-white  rounded-md shadow-md relative z-20 p-1">
              <PublicAccordion profile={profile?.profile}/>
            </div>

        <Tabs defaultId="tab2" >
            <TabsList className=" p-1 rounded-lg flex justify-around flex-wrap mt-1">
                <TabsTrigger id="tab2" className="text-sm font-medium text-center flex gap-2 align-middle items-center justify-center"><RiProfileLine className="-ml-2"/>{totalPostCount} Posts</TabsTrigger>
                <TabsTrigger id="tab1" className="text-sm font-medium text-center flex gap-2 align-middle items-center justify-center"><FaUser/>{friendsLength}  Friends</TabsTrigger>
                {/* <TabsTrigger id="tab3" className="text-sm font-medium text-center flex gap-2 align-middle items-center justify-center"><RiGalleryFill/>Gallery</TabsTrigger> */}
            </TabsList>

            <TabsContent id="tab2" className="grid grid-cols-12 ">
                <div className='col-span-12 space-y-5'>
                    <Suspense fallback={<ListSkeleton/>}> 
                        <UserPostList profile={profile.profile?.userId} setTotalCount={setTotalCount} totalPostCount={totalPostCount}/>  
                    </Suspense>
                </div>
            </TabsContent>

            <TabsContent id="tab1" className="p-4">

            <Suspense fallback={<ListSkeleton/>}>
              <PublicProfileFriends userId={profile?.profile?.userId} setFriendsLength={setFriendsLength}/>
            </Suspense>

            </TabsContent>
            <TabsContent id="tab3" className="p-4">
                <h1>Content for Tab Three</h1>
                <p>This is the detailed content for Tab Three.</p>
            </TabsContent>
        </Tabs>
      
    </div>



  );
};

export default PublicProfile;
