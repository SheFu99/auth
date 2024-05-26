'use client'

import { getProfileFriends, getPublicFriedsList, getPublicFriendsPromise } from "@/actions/friends";
import Image from "next/image";
import Link from "next/link";
import { startTransition, useEffect, useState } from "react";

interface props {
    userId:string
}
const PublicProfileFriends:React.FC<props> = ({userId}) => {
    console.log(userId)
    const [friendsList,setFriendList]=useState<getPublicFriedsList[]>()
    const [refresh,setRefresh]=useState<boolean>(false)
    useEffect(()=>{
        getFriends()
        console.log(friendsList)
    },[refresh])   
    const getFriends = ()=>{
        startTransition(()=>{
            getProfileFriends(userId)
            .then(response=>{
                setFriendList(response.profileFirendsList)
                console.log(response.profileFirendsList)
            })
        })
 
    }
    return ( 
        <div className=" w-full space-y-2">
            <button title="refresh" onClick={()=>setRefresh(!refresh)}>Refresh</button>
            {friendsList?.map((user,index)=>(
                <div className="grid grid-cols-12 border-white rounded-md border-2 p-2 w-full"> 
                 
                <Link  href={`/profile/${user.userId}`} className="col-span-10 flex items-center gap-1 cursor-pointer">
                    <Image 
                        className="rounded-full"
                        src={user.user.image}
                        alt={user.user.name}
                        width={55}
                        height={55}
                        />
                    <p className="text-white ml-2">{user?.user.name}</p>
                </Link>
                </div>
            ))}
        </div>
     );
}
 
export default PublicProfileFriends;