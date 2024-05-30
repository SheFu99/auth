'use client'

import { FriendsOffer } from "@/components/types/globalTs";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";
import { FaUser } from "react-icons/fa";

interface props {
    friendsList:FriendsOffer[],
}
const PublicProfileFriends:React.FC<props> = ({friendsList}) => {
    ///TEST: in production check how is work <Link with next auth session 
   
    return ( 
        <div className=" w-full space-y-2">
            {friendsList?.map((user,index)=>(
                <div className="grid grid-cols-12 border-white rounded-md border-2 p-2 w-full" key={index}> 
                
                <Link  href={`/profile/${user?.addressee?.userId||user?.requester?.userId}`} className="col-span-10 flex items-center gap-1 cursor-pointer">
                   <Avatar>
                        <AvatarImage 
                        src={user.addressee?.image || user.requester?.image }
                        className="w-[50px] h-[50px] rounded-sm"
                        />
                        <AvatarFallback>
                                <FaUser color="white" className="w-[50px] h-[50px] bg-neutral-400 rounded-sm p-1"/>
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