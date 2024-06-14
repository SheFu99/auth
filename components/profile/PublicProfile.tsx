"use client"
import React from "react";
import { ProfileData } from "../types/globalTs";
import { relation } from "@/actions/UserProfile";
import HeaderAvatar from "../ui/AvatarCoustom";
import FriendStatusButton from "./friends/function/publicFriendButton";
import PublicAccordion from "./post/public/profileAccordion";
import CoverPublic from "./post/public/publicCover";
import { ExtendedUser } from "@/next-auth";




export interface Profile{
    profile?:ProfileData,
    sessionUser?:ExtendedUser;
    friendStatus?:relation,

}

const  PublicProfile =  ({profile,sessionUser,friendStatus}:Profile) => {


const user = sessionUser
const userId = profile?.userId
const isTheSameUser = user?.id === userId


  return (
    
    <div className="col-span-12 grid-row-6 ">
        <div className=''>
        
        <div>
                <CoverPublic
                    url={profile?.coverImage} 
                    editable={false} 
                    className="z-1 rounded-md shadow-xs col-span-12"
                />
        </div>
            <div className="flex items-center relative ">
                <div className="absolute md:left-0 md:-bottom-15 m-auto w-fit md:p-[1rem] z-30 -bottom-15 left-0 p-[1rem] justify-center ">
                                <HeaderAvatar
                                 src={profile?.image}
                                 width={100}
                                 height={100}
                                 alt={profile?.firstName}
                                />
                </div>


                {user&&!isTheSameUser&&(
                    <div className="absolute -bottom-15  md:right-[4rem] right-8 z-30 bg-black rounded-full ">
                        <FriendStatusButton 
                            friendStatus={friendStatus}
                            userId={profile?.userId}/>
                    </div>
                )}
              
           
            </div>
        </div>
          

            <div className=" col-start-1 col-span-12 mt-1  bg-white  rounded-md shadow-md relative z-20 p-1">
              <PublicAccordion profile={profile}/>
            </div>

       
      
    </div>



  );
};

export default PublicProfile;
