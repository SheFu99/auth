import { FriendsOffer } from "@/components/types/globalTs"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import Link from "next/link"
import { FaUser } from "react-icons/fa"

type friendistProp = {
    friendList:FriendsOffer[]
}

const FriendList = ({friendList}:friendistProp) =>{

return(
    <>
        {friendList?.map((page)=>(
        <div className="grid grid-cols-12 border-white rounded-md border-2 p-2 w-full" key={page.transactionId}> 
        <a 
            href={`/profile/${page?.addressee?.userId||page?.requester?.userId}`} 
            className="col-span-10 flex items-center gap-1 cursor-pointer"
        >
           <Avatar>
                <AvatarImage
                src={page?.addressee?.image || page?.requester?.image }
                className="w-[50px] h-[50px] rounded-sm"
                />
                <AvatarFallback>
                        <FaUser color="white" className="w-[50px] h-[50px] bg-neutral-400 rounded-sm p-1"/>
                </AvatarFallback>
           </Avatar>
            <p className="text-white ml-2">{page?.addressee?.firstName||page?.requester?.firstName}</p>
        </a>
        </div>)
    )}
    </>

)

  
}

export default FriendList