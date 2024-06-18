"use client"

import {  changeFriendOfferStatus, changeStatusParams, deleteFriend } from "@/actions/friends"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { FaUser } from "react-icons/fa"
import { toast } from "sonner"
import { ExtendedUser } from "@/next-auth"

const SearchResultOrFriendList = ({searchResult}:{searchResult:ExtendedUser[]}) => {
    console.log(searchResult)
    // const [friendsList,setFriendList]=useState<ExtendedUser[]>([...searchResult])
    const {update}=useSession()


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

            {searchResult?.map((user,index)=>(
                <div className="grid grid-cols-12 border-white rounded-md border-2 p-2 w-full row-span-1" key={index}> 
                    <Link  href={`/profile/${user.id}`} className="col-span-10 flex items-center gap-1 cursor-pointer">
                   
                    <Avatar>
                        <AvatarImage 
                            src={user.image} 
                            alt={user.name}
                            className="rounded-sm w-[50px] h-[50px]"
                        />
                        <AvatarFallback>
                            <FaUser color="white" className="w-[50px] h-[50px] bg-neutral-400 rounded-sm p-1"/>
                        </AvatarFallback>
                   </Avatar>
                    <p className="text-white ml-2">{user.name}</p>
                  

                    </Link>
                </div>
            ))}
        </div>
     )
}
 
export default SearchResultOrFriendList;