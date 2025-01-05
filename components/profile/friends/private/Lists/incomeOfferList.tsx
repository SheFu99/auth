'use client'

import {  changeStatusParams, getCurrentUserOffer } from "@/actions/friends";
import {changeFriendOfferStatus} from '@/actions/friends'
import { FriendsOffer } from "@/components/types/globalTs";
import Link from "next/link";
import {  useEffect, useState } from "react";
import { MdDoneOutline } from "react-icons/md";
import { toast } from "sonner";
import { TiCancel } from "react-icons/ti";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { FaUser } from "react-icons/fa";
import { useCurrentUser } from "@/hooks/use-current-user";
import queryClientConfig from "@/lib/QueryClient";


const IncomeOfferList = () => {
    const [userList,setUserList]=useState<FriendsOffer[]>([])
    const [click,setClick]=useState<boolean>(false)
    const user = useCurrentUser()
    const queryKey = ['friendList',user?.id]

    ///TODO: make react query for income list , or websocket to push notification
    
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
                queryClientConfig.invalidateQueries({queryKey})
                setClick(true)
            }
            if(response.error){
                toast.error(response.error)
            }
        })
    }
    useEffect(()=>{
        getIncomeOfferList() 
        console.log('getIncomeOfferList')
    },[click])

    return ( 
        <div key={'incomeOfferList'}>
            {userList?.map((user,index)=>(
                <div className="flex space-y-2 flex-wrap bg-slate-800 rounded-md">
                    <h3 className="text-center w-full mt-2">🆕you have friends offer:</h3>
                <div className="grid grid-cols-12 border-white rounded-md border-2 p-2 w-full "key={index}> 
                
                        <Link  href={`/profile/${user.requester.userId}`} className="md:col-span-10 col-span-9 flex items-center gap-1 cursor-pointer">
                            <Avatar>
                                <AvatarImage
                                    src={user.requester.image}
                                    alt={user.requester.firstName}
                                    className="rounded-sm w-[50px] h-[50px]"
                                    />
                                     <AvatarFallback>
                                         <FaUser color="white" className="w-[50px] h-[50px] bg-neutral-400 rounded-sm p-1"/>
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
                </div>
            )
            )}
        </div>
     );
}
 
export default IncomeOfferList;