"use client"
import React, {  Suspense,useEffect, useState, useTransition } from "react";
import {  BsGenderFemale, BsGenderMale } from "react-icons/bs";
import { FaGenderless, FaPhone, FaUser } from "react-icons/fa";
const Cover = React.lazy(() => import("./Cover"))
import { RiGalleryFill, RiProfileLine } from 'react-icons/ri';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { MdElderly, MdLocationCity } from "react-icons/md";
import { BounceLoader, FadeLoader } from "react-spinners";
import {  relation } from "@/actions/UserProfile";
import { useCurrentUser } from "@/hooks/use-current-user";
const PublicProfileFriends = React.lazy(()=> import ('./friends/publicProfileFriends'))
// import PublicProfileFriends from "./friends/publicProfileFriends";
import AvatarWithFallback from "../ui/AvatarCoustom";
import FriendStatusButton from "./friends/function/publicFriendButton";

import ListSkeleton from "./friends/FriendSkeleton";
import { getProfileFriends } from "@/actions/friends";
import PublicAccordion from "./post/public/profileAccordion";
import { ProfileData } from "../types/globalTs";


const UserPostList = React.lazy(()=>import('./post/private/UserPostList'))
// import UserPostList from "./forms/UserPostList";

export interface Profile{
    profile:profileProps,
}
interface profileProps {
    profile:ProfileData;
    friendStatus:relation

}

const  PublicProfile =  ({profile}:Profile) => {
const [updateState, setUpdate] = useState<boolean>(false)
const [isLoading, setIsLoading]=useState<boolean>(true)
const [totalPostCount,setTotalCount]=useState<number>(0)

const [isPending,startTransition]=useTransition()
const [friendsLength,setFriendsLength] = useState<number>(0)
const user = useCurrentUser()
const userId = profile?.profile?.userId
const isTheSameUser = user?.id === userId
  const gender = profile.profile?.gender

  
                      console.log(profile)


  const getListOfFriends = async (userId:string)=>{
  startTransition(()=>{
    getProfileFriends(userId)
        .then(response=>{
            console.log(response)
        })
  })
      
      
    
  };
  
  useEffect(()=>{
    getListOfFriends(userId)
    // setFriendStatus(profile?.friendStatus?.relationFrom?.status || profile.friendStatus?.relationTo?.status)
  },[userId])
//   useEffect(()=>{console.log(avatar)},[avatar])
 if(!profile){
    return <FadeLoader/>
 }

  return (
    
    <div className="col-span-12 grid-row-6 ">
        <div className=''>
        
        <div>
                <Cover 
                    url={profile?.profile?.coverImage} 
                    onChange={() => setUpdate(!updateState)}
                    editable={false} 
                    className="z-1 rounded-md shadow-xs col-span-12"
                />
        </div>
            <div className="flex items-center relative ">
                        {!isLoading &&(
                            <BounceLoader className="w-[65px] h-[65px] md:w-[102px] md:h-[100px] z-20 rounded-md shadow-xs col-span-12 absolute" color="white"/>   
                        )}
                       
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
