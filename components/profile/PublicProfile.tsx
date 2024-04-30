"use client"
import React, {  Suspense,useEffect, useState } from "react";
import {  BsGenderFemale, BsGenderMale } from "react-icons/bs";
import { FaGenderless, FaPhone, FaUser } from "react-icons/fa";
const Cover = React.lazy(() => import("./Cover"))
import Image from 'next/image';
import { RiGalleryFill, RiProfileLine } from 'react-icons/ri';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { MdElderly, MdLocationCity } from "react-icons/md";
import { BounceLoader, FadeLoader } from "react-spinners";
import { Profile } from "@/actions/UserProfile";
import { IoPersonCircle, IoPersonCircleSharp } from "react-icons/io5";
const UserPostList = React.lazy(()=>import('./UserPostList'))
// import UserPostList from "./forms/UserPostList";

export interface ProfileData{
    profile:Profile
    userImage:string;
}
interface profileProps {
    profile:any;
}


const  PublicProfile =  ({profile}:profileProps) => {
  const [updateState, setUpdate] = useState<boolean>(false)
const [isLoading, setIsLoading]=useState<boolean>(true)



  const gender = profile.profile?.gender
  const getGenderIcon = (gender:any)=>{
      switch(gender){
          case 'Male':
              return <BsGenderMale color='black'/>
          case 'Female':
              return <BsGenderFemale color='black'/>
          default:
              return <FaGenderless color='black'/>
      }
      
  }
  
  useEffect(()=>{console.log(profile.userImage)},[profile])
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
                        <div className="absolute left-4 md:mt-[1px] md:-ml-[6px] mt-[2px] rounded-full w-[60px] h-[60px] md:w-[112px] md:h-[111px] bg-black -ml-[5px] z-10 shadow-md">
                        {!isLoading &&(
                            <BounceLoader className="w-[55px] h-[55px] md:w-[102px] md:h-[100px] z-20 rounded-md shadow-xs col-span-12 absolute" color="white"/>   
                        )}
                        </div>
                  <div className="absolute md:left-0 md:-bottom-15 m-auto w-fit md:p-[1rem] z-30 -bottom-15 left-0 p-[1rem] justify-center ">

                
                   <div className="flex justify-center relative rounded-full w-[52px] h-[50px] md:w-[102px] md:h-[100px] z-30">
                    
                        {profile.userImage !==undefined ?(
                            <Image
                            src={profile.userImage}
                            alt='Avatar'
                            // layout="fill"
                            width={100}
                            height={100}
                            className={`rounded-full z-30 md:-ml-[2px] mr-[1px]`}
                            
                          />
                        ):(
                         <IoPersonCircleSharp className="w-[60px] h-[60px] md:w-[102px] md:h-[100px] bg-black rounded-full -mt-1 "/>
                        )}
                        
                    
                    
                    
                 </div>
              </div>

           
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
            <Suspense fallback={<div>Loading...</div>}> 
                <UserPostList profile={profile.profile?.userId}/>  
            </Suspense>
            </div>
                    
            </TabsContent>

            <TabsContent id="tab2" className="p-4">
                <h1>Content for Tab Two</h1>
                <p>This is the detailed content for Tab Two.</p>
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
