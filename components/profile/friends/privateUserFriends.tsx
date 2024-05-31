"use client"

import {  changeFriendOfferStatus, changeStatusParams, deleteFriend, deleteFriendParams, getUserFreinds } from "@/actions/friends"
import { FriendsOffer } from "@/components/types/globalTs"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Profiler, startTransition, useEffect, useState } from "react"
import { FaBan, FaUser } from "react-icons/fa"
import { IoMdMore } from "react-icons/io"
import { IoPersonRemoveSharp } from "react-icons/io5"
import { toast } from "sonner"

const UserFriends = () => {
    const [friendsList,setFriendList]=useState<FriendsOffer[]>([])
    const [refresh,setRefresh]=useState<boolean>(false)
    const {update}=useSession()
    const user = useCurrentUser()

    useEffect(()=>{
        getFriends()
    },[update])

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

    const changeFriendStatus = ({status,transactionId}:changeStatusParams)=>{
            changeFriendOfferStatus({status:status,transactionId:transactionId})
            .then(response => {
                if(response.success){
                    toast.success(response.message)
                }
            })
            .catch(err =>{
                toast.error(err)
            })
        
    };
    const deleteFriendButton = (userId:string)=>{
            deleteFriend(userId)
            .then(response=>{
                console.log(response)
                if(response.succes){
                    toast.success(`Your successfully delete friends from list`)
                    update()
                }
                if(response.error){
                    toast.error(response.error)
                }
            })
    };
    return ( 
        <div className=" w-full space-y-2">
            {/* <button title="refresh" onClick={()=>setRefresh(!refresh)}>Refresh</button> */}
            {/* <p className="text-white">{`You have: ${friendsList?.length} friends`}</p> */}

            {friendsList?.map((user,index)=>(
                <div className="grid grid-cols-12 border-white rounded-md border-2 p-2 w-full row-span-1" key={index}> 
                    <Link  href={`/profile/${user?.addressee?.userId||user?.requester?.userId}`} className="col-span-10 flex items-center gap-1 cursor-pointer">
                   <a>
                    <Avatar>
                        <AvatarImage 
                            src={user.addressee?.image || user.requester?.image } 
                            alt={user?.addressee?.firstName||user?.requester?.firstName}
                            className="rounded-sm w-[50px] h-[50px]"
                        />
                        <AvatarFallback>
                            <FaUser color="white" className="w-[50px] h-[50px] bg-neutral-400 rounded-sm p-1"/>
                        </AvatarFallback>
                   </Avatar>
                    <p className="text-white ml-2">{user?.addressee?.firstName||user?.requester?.firstName}</p>
                   </a>

                    </Link>

                    <div className="md:col-start-11 md:col-span-2 col-span-3 col-start-12 flex justify-end items-center allign-middle space-x-1 row-start-1">

                        <DropdownMenu>
                            <DropdownMenuTrigger className="px-2 ">
                                <IoMdMore className="scale-150" color='white'/>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-9 ">
                                <DropdownMenuItem>
                                    <div 
                                        title="Delete"
                                        className="flex w-full px-3 py-1 rounded-sm justify-evenly gap-2 cursor-pointer hover:bg-neutral-800"
                                        onClick={()=>deleteFriendButton(user?.addressee?.userId||user?.requester?.userId)}
                                        >
                                    <p>Delete</p>
                                        <button 
                                            title="Delete"
                                            className=" w-full flex justify-evenly items-center"
                                            >
                                            {/* <p>Delete</p> */}
                                            <IoPersonRemoveSharp color="white" className="scale-100" />
                                        </button>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem  >
                                <div 
                                    className="flex px-3 py-1 justify-evenly gap-2 cursor-pointer hover:bg-neutral-800 w-full rounded-sm"
                                    title="Block User"
                                    onClick={()=>changeFriendStatus({
                                        status:'BLOCKED',
                                        transactionId:user.transactionId,
                                    })}
                                    >
                                    <p>Ban</p>
                                <button 
                                    
                                    className=" flex justify-evenly items-center w-full"
                                    
                                    >
                                    <FaBan color="red" className="scale-100 ml-5"/>
                                </button>
                                </div>
                                </DropdownMenuItem>
                            
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {/* <button 
                            title="Confirm"
                            className=" flex justify-center items-center w-full bg-slate-400 rounded-md hover:bg-slate-300"
                            onClick={()=>changeStatus({status:'ACCEPTED',transactionId:user.transactionId,requesterId:user.requesterId})}
                            >
                            <MdDoneOutline color="white" className="scale-150"/>
                        </button> */}
                        
                               
                            
                        
                    </div>
                </div>
            ))}
        </div>
     )
}
 
export default UserFriends;