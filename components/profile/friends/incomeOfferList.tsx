'use client'

import {  changeStatusParams, getCurrentUserOffer } from "@/actions/friends";
import {changeFriendOfferStatus} from '@/actions/friends'
import { FriendsOffer, friendshipStatus, requester } from "@/components/types/globalTs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdDoneOutline } from "react-icons/md";
import { toast } from "sonner";
import { TiCancel } from "react-icons/ti";


const IncomeOfferList = () => {
    const [userList,setUserList]=useState<FriendsOffer[]>([])
    const [click,setClick]=useState<boolean>(false)
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
    const changeStatus = ({status,transactionId,requesterId}:changeStatusParams) => {
        changeFriendOfferStatus({ status, transactionId, requesterId })
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
    },[click])

    return ( 
        <div className="flex space-y-2 flex-wrap">
            <button title="button" onClick={()=>{setClick(!click)}}>Refresh</button>
            {userList?.map((user,index)=>(
                <div className="grid grid-cols-12 border-white rounded-md border-2 p-2 w-full "> 
                 
                        <Link  href={`/profile/${user.requester.id}`} className="md:col-span-10 col-span-9 flex items-center gap-1 cursor-pointer">
                            <Image 
                                className="rounded-full"
                                src={user.requester.image}
                                alt={user.requester.name}
                                width={55}
                                height={55}
                                />
                            <p className="text-white ml-2">{user?.requester?.name}</p>
                        </Link>
                  
                    <div className="md:col-start-11 md:col-span-2 col-span-3 col-start-10 flex justify-around space-x-1">

                        <button 
                            title="Confirm"
                            className=" flex justify-center items-center w-full bg-slate-400 rounded-md hover:bg-slate-300"
                            onClick={()=>changeStatus({status:'ACCEPTED',transactionId:user.transactionId,requesterId:user.requesterId})}
                            >
                            <MdDoneOutline color="white" className="scale-150"/>
                        </button>
                        
                        <button 
                            title="Reject"
                            className=" w-full flex justify-center items-center bg-red-800 rounded-md hover:bg-red-700"
                            onClick={()=>changeStatus({
                                status:'DECLINED',
                                transactionId:user.transactionId,
                                requesterId:user.requesterId
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