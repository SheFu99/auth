"use client"

import {  deleteFriend, deleteFriendParams, getUserFreinds } from "@/actions/friends"
import { FriendsOffer, friendshipStatus } from "@/components/types/globalTs"
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { startTransition, useEffect, useState } from "react"
import { IoPersonRemoveSharp } from "react-icons/io5"
import { MdMoreVert } from "react-icons/md"
import { TiCancel } from "react-icons/ti"
import { toast } from "sonner"

const UserFriends = () => {
    const [friendsList,setFriendList]=useState<FriendsOffer[]>([])
    const [refresh,setRefresh]=useState<boolean>(false)
    const {update}=useSession()
    const user = useCurrentUser()
    useEffect(()=>{
        getFriends()
       console.log(user)
    },[refresh])   
    const getFriends = ()=>{
        startTransition(()=>{
            getUserFreinds()
            .then(response=>{
                console.log(response)
                if(response?.success){
                        console.log(response.userFriendsList)
                        setFriendList(response?.userFriendsList)
               }
            })
        })
 
    };
    const changeFriendStatus = ({
        status,
        transactionId,
        }:deleteFriendParams)=>{
            const operation = (status:friendshipStatus)=>{
                switch(status){
                    case 'DECLINED':
                        return 'delete'
                    case 'BLOCKED':
                        return 'block'
                }
            }
            deleteFriend({
                transactionId:transactionId,
                status:status
            }).then(response=>{
                if(response.succes){
                    toast.success(`Your successfully ${operation} friend!`)
                    update()
                }
                if(response.error){
                    toast.error(response.error)
                }
            })
    }
    return ( 
        <div className=" w-full space-y-2">
            <button title="refresh" onClick={()=>setRefresh(!refresh)}>Refresh</button>
            {friendsList?.map((user,index)=>(
                <div className="grid grid-cols-12 border-white rounded-md border-2 p-2 w-full"> 
                 
                    <Link  href={`/profile/${user?.addressee?.id||user?.requester?.id}`} className="col-span-10 flex items-center gap-1 cursor-pointer">
                    <Image 
                        className="rounded-full"
                        src={user?.addressee?.image||user?.requester?.image}
                        alt={user?.addressee?.name||user?.requester?.name}
                        width={55}
                        height={55}
                        />
                    <p className="text-white ml-2">{user?.addressee?.name||user?.requester?.name}</p>
                    </Link>

                    <div className="md:col-start-11 md:col-span-2 col-span-3 col-start-10 flex justify-end items-center allign-middle space-x-1">

                        {/* <button 
                            title="Confirm"
                            className=" flex justify-center items-center w-full bg-slate-400 rounded-md hover:bg-slate-300"
                            onClick={()=>changeStatus({status:'ACCEPTED',transactionId:user.transactionId,requesterId:user.requesterId})}
                            >
                            <MdDoneOutline color="white" className="scale-150"/>
                        </button> */}
                        
                                <button 
                                    title="Delete"
                                    className=" w-full flex justify-center items-center bg-red-800 rounded-md hover:bg-red-700"
                                    onClick={()=>changeFriendStatus({
                                        status:'DECLINED',
                                        transactionId:user.transactionId,
                                    })}
                                    >
                                    {/* <p>Delete</p> */}
                                    <IoPersonRemoveSharp color="white" className="scale-150" />
                                </button>
                            
                        
                    </div>
                </div>
            ))}
        </div>
     )
}
 
export default UserFriends;