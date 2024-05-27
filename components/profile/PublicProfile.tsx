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
import { Profile } from "@/actions/UserProfile";
import { IoAddCircle, IoPersonCircle, IoPersonCircleSharp } from "react-icons/io5";
import { deletePendingOffer, getProfileFriends, sendFriendShipOffer } from "@/actions/friends";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";
import { friendRelation, friendshipStatus } from "../types/globalTs";
import PublicProfileFriends from "./friends/publicProfileFriends";
const UserPostList = React.lazy(()=>import('./UserPostList'))
// import UserPostList from "./forms/UserPostList";

export interface ProfileData{
    profile:Profile
    userImage:string;
    friendStatus:friendRelation
    
}
interface profileProps {
    profile:ProfileData;
}

const  PublicProfile =  ({profile}:profileProps) => {
const [updateState, setUpdate] = useState<boolean>(false)
const [isLoading, setIsLoading]=useState<boolean>(true)
const [friendStatus,setFriendStatus]=useState<friendshipStatus>(profile?.friendStatus?.status ||undefined)
const [isPending,startTransition]=useTransition()
console.log(profile)
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
  
                      
  const friendStatusButton = () =>{
    console.log(friendStatus)
    switch(friendStatus){
        case "PENDING":
            return (
                <div  
                title="Cancel friendship offer" 
                    className="bg-white rounded-full border-black border-4 cursor-pointer"
                    onClick={()=>cancelOffer(userId)}
                    >
                            <MdOutlinePendingActions className="md:w-[45px] md:h-[45px] w-[30px] h-[30px] p-1 " color="black"/>
                </div>
            )
        case "ACCEPTED":
            return (
                <div 
                    title="Delete this profile from your friends"
                    className="bg-white rounded-full border-black border-4 cursor-pointer"
                    onClick={()=>cancelOffer(userId)}

                    >
                    <FaHandshake className='md:w-[45px] md:h-[45px] w-[30px] h-[30px] p-1' color="black"/>
                </div>
            )
        default :
            return(
                <div title="Send friendship request"  
                    className="cursor-pointer" 
                    onClick={()=>addToFriends(userId)} >
                    <IoAddCircle color="white" className=" md:w-[50px] md:h-[50px] w-[35px] h-[35px]"/>
                </div>
            )
    }
  };

  const addToFriends = (userId:string)=>{
    startTransition(()=>{
        sendFriendShipOffer(userId)
        .then(response=>{
            if(response.success){
                toast.success(response.message)
            }
        }).catch(err=>{
            toast.error(err)
        }).finally(()=>setFriendStatus('PENDING'))
    })
  };
  const cancelOffer = (userId:string)=>{
    startTransition(()=>{
        deletePendingOffer(userId)
        .then(response=>{
            if(response.success){
                toast.success('Your offer has been cancelled')
            }
        }).catch(err=>{
            toast.error(err)
        }).finally(()=>setFriendStatus(undefined))
    })
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
    setFriendStatus(profile?.friendStatus?.status)
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
                        <div className="flex justify-center relative rounded-full w-[52px] h-[50px] md:w-[102px] md:h-[100px] z-30">
                            
                                {profile.userImage !==undefined ?(
                                <div className="bg-black rounded-full  flex justify-center items-center align-middle p-1">

                                    <Image
                                    src={profile.userImage}
                                    alt='Avatar'
                                    // layout="fill"
                                    width={100}
                                    height={100}
                                    className={`rounded-full z-30 `}
                                    
                                />
                                </div>
                                ):(
                                <IoPersonCircleSharp className="w-[70px] h-[55px] md:w-[102px] md:h-[100px] bg-black rounded-full -mt-1 mr-[1px]"/>
                                )}
                                
                            
                            
                            
                        </div>
                </div>
                {user&&!isTheSameUser&&(
                    <div className="absolute -bottom-15  md:right-[4rem] right-8 z-30 bg-black rounded-full ">
                        {friendStatusButton()}
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
                <TabsTrigger id="tab2" className="text-sm font-medium text-center flex gap-2 align-middle items-center"><FaUser/>Friends</TabsTrigger>
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

                <PublicProfileFriends userId={profile?.profile?.userId}/>
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
