'use client'

import {  changeStatusParams, getCurrentUserOffer } from "@/actions/friends";
import {changeFriendOfferStatus} from '@/actions/friends'
import { FriendsOffer, friendshipStatus } from "@/components/types/globalTs";
import Image from "next/image";
import Link from "next/link";
import { Profiler, useEffect, useState } from "react";
import { MdDoneOutline } from "react-icons/md";
import { toast } from "sonner";
import { TiCancel } from "react-icons/ti";
import AvatarWithFallback from "@/components/ui/AvatarCoustom";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
import { useSession } from "next-auth/react";


const IncomeOfferList = () => {
    const [userList,setUserList]=useState<FriendsOffer[]>([])
    const [click,setClick]=useState<boolean>(false)
    const {update}=useSession()
    
    const getIncomeOfferList = ()=>{
        getCurrentUserOffer()
        .then(response=>{
            if(response.success){
                setUserList(response.currentOfferList)
            }
            if(response.error){
                toast.error(`Something was wrong: ${response.error}`)
            }
        })
        .catch(err=>{
            toast.error(err)
        })
    };
    const changeStatus = ({status,transactionId}:changeStatusParams) => {
        changeFriendOfferStatus({ status, transactionId })
        .then(response=>{
            if(response.success){
                toast.success(response.message)
            }
            if(response.error){
                toast.error(response.error)
            }
        })
    }
    useEffect(()=>{
        getIncomeOfferList() 
        console.log(userList)
    },[update])

    return ( 
        <div className="flex space-y-2 flex-wrap">
            {/* <button title="button" onClick={()=>{setClick(!click)}}>Refresh</button> */}
            {userList?.map((user,index)=>(
                <div className="grid grid-cols-12 border-white rounded-md border-2 p-2 w-full "> 
                        <Link  href={`/profile/${user.requester.userId}`} className="md:col-span-10 col-span-9 flex items-center gap-1 cursor-pointer">
                            <Avatar>
                                <AvatarImage
                                    src={user.requester.image}
                                    alt={user.requester.firstName}
                                    className="rounded-sm w-[50px] h-[50px]"

                                    />
                                     <AvatarFallback>
                                        <FaUser className="text-white"/>
                                    </AvatarFallback>
                            </Avatar>
                               
                            <p className="text-white ml-2">{user?.requester?.firstName}</p>
                        </Link>
                  
                    <div className="md:col-start-11 md:col-span-2 col-span-3 col-start-10 flex justify-around space-x-1">

                        <button 
                            title="Confirm"
                            className=" flex justify-center items-center w-full bg-slate-400 rounded-sm hover:bg-slate-300"
                            onClick={()=>changeStatus({status:'ACCEPTED',transactionId:user.transactionId})}
                            >
                            <MdDoneOutline color="white" className="scale-150"/>
                        </button>
                        <button 
                            title="Reject"
                            className=" w-full flex justify-center items-center bg-red-800 rounded-sm hover:bg-red-700"
                            onClick={()=>changeStatus({
                                status:'DECLINED',
                                transactionId:user.transactionId,
                            })}

                            >
                            <TiCancel color="white" className="scale-150" />
                        </button>
                    </div>
                </div>
            )
            )}
        </div>
     );
}
 
export default IncomeOfferList;