"use client"
import React, {  Suspense,startTransition,useEffect, useState, useTransition } from "react";
import {  BsGenderFemale, BsGenderMale } from "react-icons/bs";
import { FaGenderless, FaHandshake, FaPhone, FaRegHandshake, FaUser } from "react-icons/fa";
const Cover = React.lazy(() => import("./Cover"))
import Image from 'next/image';
import { RiGalleryFill, RiProfileLine } from 'react-icons/ri';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { MdElderly, MdLocationCity, MdOutlinePendingActions } from "react-icons/md";
import { BounceLoader, FadeLoader } from "react-spinners";
import { Profile, relation } from "@/actions/UserProfile";
import { IoAddCircle, IoPersonCircle, IoPersonCircleSharp } from "react-icons/io5";
import { deletePendingOffer, getProfileFriends, sendFriendShipOffer } from "@/actions/friends";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";
import { friendRelation, friendshipStatus } from "../types/globalTs";
const PublicProfileFriends = React.lazy(()=> import ('./friends/publicProfileFriends'))
// import PublicProfileFriends from "./friends/publicProfileFriends";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import AvatarWithFallback from "../ui/AvatarCoustom";
import FriendStatusButton from "./friends/function/publicFriendButton";
import PostSkeleton from "./post/skeleton";
import ListSkeleton from "./friends/FriendSkeleton";

const UserPostList = React.lazy(()=>import('./UserPostList'))
// import UserPostList from "./forms/UserPostList";

export interface ProfileData{
    profile:Profile
    userImage:string;
    friendStatus:relation
    
}
interface profileProps {
    profile:ProfileData;
}

const  PublicProfile =  ({profile}:profileProps) => {
const [updateState, setUpdate] = useState<boolean>(false)
const [isLoading, setIsLoading]=useState<boolean>(true)
const [isPending,startTransition]=useTransition()
const [friendsLength,setFriendsLength] = useState<number>(0)
const user = useCurrentUser()
const userId = profile?.profile?.userId
const isTheSameUser = user?.id === userId
  const gender = profile.profile?.gender
  const getGenderIcon = (gender:string)=>{
      switch(gender){
          case 'Male':
              return <BsGenderMale color='black'/>
          case 'Female':
              return <BsGenderFemale color='black'/>
          default:
              return <FaGenderless color='black'/>
      }
      
  };
  
                      


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
                                 src={profile.userImage}
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

              <div className=''>
                  <Accordion type="single" collapsible className='p-2'>
                    <AccordionItem value="item-1" >
                      <AccordionTrigger className='text-black  font-semibold flex justify-between p-1 md:text-xl g-f:text-sm md:ml-0 g-f:ml-2'>{profile?.profile?.firstName}</AccordionTrigger>
                        <AccordionContent>
                            <div className='grid grid-cols-12 '>

                                <div className='g-f:col-span-12 g-f:mt-2 col-start-1 sm:col-span-6 flex space-x-2 border border-black rounded-md p-3'>
                                    <FaPhone color='black'/>
                                    <p className='text-black col-span-12 md:text-md g-f:text-sm'>{`${profile?.profile?.phoneNumber}`}</p>
                                </div>

                                <div className='g-f:col-span-12 g-f:mt-2 sm:ml-1 sm:col-span-6 sm:col-start-7 flex items-center p-3 space-x-2 border border-black rounded-md'>
                                    <MdLocationCity color='black'/>
                                    <p className='text-black col-span-12 md:text-md  g-f:text-sm'>{`${profile?.profile?.adres}`}</p>
                                </div>

                                <div className='g-f:col-span-12  mt-2 sm:col-span-6  col-start-1 flex items-center p-3 space-x-2 col-span-6 border border-black rounded-md'>
                                    <MdElderly color='black'/>
                                    <p className='text-black col-span-12 md:text-md  g-f:text-sm'>{`Age: ${profile?.profile?.age}`}</p>    
                                </div>

                                <div className='g-f:col-span-12 sm:ml-1 mt-2 sm:col-start-7 sm:col-span-6   flex items-center p-3 space-x-2 border border-black rounded-md'>
                                    <i className='text-black col-span-1 md:text-md'>{getGenderIcon(gender)}</i>
                                    <p className='text-black col-span-12 md:text-md  g-f:text-sm'>{`Gender: ${profile?.profile?.gender}`}</p>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                  </Accordion>
              </div>
                  
            </div>

        <Tabs defaultId="tab1" >
            <TabsList className=" p-1 rounded-lg flex justify-around flex-wrap mt-1">
                <TabsTrigger id="tab1" className="text-sm font-medium text-center flex gap-2 align-middle items-center"><RiProfileLine/>Posts</TabsTrigger>
                <TabsTrigger id="tab2" className="text-sm font-medium text-center flex gap-2 align-middle items-center"><FaUser/> {friendsLength}  Friends</TabsTrigger>
                <TabsTrigger id="tab3" className="text-sm font-medium text-center flex gap-2 align-middle items-center"><RiGalleryFill/>Gallery</TabsTrigger>
            </TabsList>

            <TabsContent id="tab1" className="grid grid-cols-12 ">
                
            <div className='col-span-12 space-y-5'>
            <Suspense fallback={<div className="flex justify-center align-middle items-center mt-10"><BounceLoader color="white"/></div>}> 
                <UserPostList profile={profile.profile?.userId}/>  
            </Suspense>
            </div>
                    
            </TabsContent>

            <TabsContent id="tab2" className="p-4">

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
