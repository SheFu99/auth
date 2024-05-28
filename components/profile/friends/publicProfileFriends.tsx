'use client'

import { getProfileFriends, getPublicFriendsPromise } from "@/actions/friends";
import { FriendsOffer } from "@/components/types/globalTs";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import Link from "next/link";
import { Profiler, startTransition, useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";

interface props {
    userId:string
}
const PublicProfileFriends:React.FC<props> = ({userId}) => {
    
    const [friendsList,setFriendList]=useState<FriendsOffer[]>()
    const [refresh,setRefresh]=useState<boolean>(false)

    useEffect(()=>{
        getFriends()
       
    },[refresh])   
    const getFriends = ()=>{
        startTransition(()=>{
            getProfileFriends(userId)
            .then(response=>{
                setFriendList(response.profileFirendsList)
               
            })
        })
 
    }
    return ( 
        <div className=" w-full space-y-2">
            <button title="refresh" onClick={()=>setRefresh(!refresh)}>Refresh</button>
            <p className="text-white">{`User have: ${friendsList?.length} friends`}</p>
            {friendsList?.map((user,index)=>(
                <div className="grid grid-cols-12 border-white rounded-md border-2 p-2 w-full" key={index}> 
                 
                <Link  href={`/profile/${user?.addressee?.userId||user?.requester?.userId}`} className="col-span-10 flex items-center gap-1 cursor-pointer">
                   <Avatar>
                        <AvatarImage 
                        src={user.addressee?.image || user.requester?.image }
                        className="w-[50px] h-[50px] rounded-sm"
                        />
                        <AvatarFallback>
                                <FaUser color="white"/>
                        </AvatarFallback>
                   </Avatar>
                   
                   
                    <p className="text-white ml-2">{user?.addressee?.firstName||user?.requester?.firstName}</p>
                </Link>
                </div>
            ))}
        </div>
     );
}
 
export default PublicProfileFriends;