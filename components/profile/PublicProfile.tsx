"use client"
import React from "react";
import { ProfileData } from "../types/globalTs";
import { relation } from "@/actions/UserProfile";
import HeaderAvatar from "../ui/AvatarCoustom";
import FriendStatusButton from "./friends/function/publicFriendButton";
import PublicAccordion from "./post/public/profileAccordion";
import CoverPublic from "./post/public/publicCover";
import { ExtendedUser } from "@/next-auth";
import { useSession } from "next-auth/react";
import { authConfig } from "@/auth.config";




export interface Profile{
    profile?:ProfileData,
    sessionUser?:ExtendedUser;
    friendStatus?:relation,

}

const  PublicProfile =  ({profile,sessionUser,friendStatus}:Profile) => {

const data = useSession()
const userId = profile?.userId
const currentUserId = data?.data.user.id
const isTheSameUser = currentUserId=== userId
console.log('SeconUser',data)


  return (
    
    <div className="col-span-12 grid-row-6 ">
        <div className='mb-5 border-b-2 rounded-xl'>
        
                <CoverPublic
                    url={profile?.coverImage} 
                    editable={false} 
                    className="z-1 rounded-md shadow-xs col-span-12"
                />
        
            <div className="flex items-center relative ">
                <div className="absolute md:left-0 md:-bottom-15 m-auto w-fit 
                                md:p-[1rem] z-1 -bottom-15 left-0 p-[1rem] justify-center mt-12">
                                <HeaderAvatar
                                 src={profile?.image}
                                 width={100}
                                 height={100}
                                 alt={profile?.firstName}
                                />
                </div>
                {currentUserId&&!isTheSameUser&&(
                    <div className="absolute mt-[4.4rem]  
                                    md:right-[6rem] right-8 z-[1] bg-black rounded-full ">
                        <FriendStatusButton 
                            friendStatus={friendStatus}
                            userId={profile?.userId}/>
                    </div>
                )}
              
              <div className="absolute 
                      text-card-foreground text-xl font-bold md:text-2xl

                      md:ml-[5rem] ml-[2rem] md:mr-[5rem] mr-[6rem] mt-[4rem] 
                      rounded-md pl-[4rem] md:pl-[3rem] w-auto  z-0 ">
          {profile?.firstName}
        </div>
            </div>
            
        </div>
          {/* <div className="absolute  z-50  "> 
            <p className="text-xl">{profile.firstName}</p> 
        </div> */}

      

    <div className="pl-3 pr-3 pt-3 mt-10">
      <div className="col-start-1 col-span-12 mt-3
                      border-2 rounded-md shadow-md relative z-[0] p-2">
                    <PublicAccordion profile={profile}/>
                  </div>
      </div> 
    </div>



  );
};

export default PublicProfile;
