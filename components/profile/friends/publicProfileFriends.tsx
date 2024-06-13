'use client'

import { FriendsOffer } from "@/components/types/globalTs";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { FaUser } from "react-icons/fa";
import { ExtendedUser } from "@/next-auth";
import { useState } from "react";
import SearchStateFilter from "@/components/search/user/SearchStateFilter";


interface props {
    friendsList:FriendsOffer[]&ExtendedUser[],
    search?:string,
    profileId?:string,
}
const PublicProfileFriends:React.FC<props> = ({friendsList,profileId}) => {
    const [friendsState,setFriends] = useState(friendsList)
    const [searchState,setSearch]=useState('')
    const search = searchState.toLowerCase()
    const filteredFriendsList = friendsState?.filter(transaction=> transaction?.addressee?.firstName.toLowerCase().includes(search) || transaction?.requester?.firstName.toLowerCase().includes(search) )
    const friends= filteredFriendsList || friendsState
    ///TEST: in production check how is work <Link with next auth session 
//    const router = useRouter()
//    const linkRef= useRef()
//     const handleRoute = (userId)=>{
//         router.push(`/profile/${userId}`)
//     }
    return ( 
        <div className=" w-full space-y-2">
            <SearchStateFilter setSearch={setSearch} search={searchState} />
            {friends?.map((user,index)=>(
                <div className="grid grid-cols-12 border-white rounded-md border-2 p-2 w-full" key={index}> 
                
                <a 
                    href={`/profile/${user?.addressee?.userId||user?.requester?.userId}`} 
                    className="col-span-10 flex items-center gap-1 cursor-pointer"
                // scroll={false}
                // replace={false}
                // prefetch={false}
                >
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
                </a>
                </div>
            ))}
        </div>
     );
}
 
export default PublicProfileFriends;