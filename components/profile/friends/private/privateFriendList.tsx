import { FriendsOffer } from "@/components/types/globalTs"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FaBan, FaUser } from "react-icons/fa"
import { IoMdMore } from "react-icons/io"
import { IoPersonRemoveSharp } from "react-icons/io5"

type friendistProp = {
    friendList:FriendsOffer[],
    onDelete:(id:string)=>void,
    onBan:({status,transactionId}:{status:string,transactionId:string})=>void
}

const PrivateFriendList = ({friendList,onDelete,onBan}:friendistProp) =>{

return(
    <>
        {friendList?.map((user,index)=>(
                <div className="grid grid-cols-12 border-white rounded-md border-2 p-2 w-full row-span-1" key={index}> 
                    <a  href={`/profile/${user?.addressee?.userId||user?.requester?.userId}`} className="col-span-10 flex items-center gap-1 cursor-pointer">
                   
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
                                        onClick={()=>onDelete(user?.addressee?.userId||user?.requester?.userId)}
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
                                    onClick={()=>onBan({
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
                    </div>
                </div>
            ))}
    </>

)

  
}

export default PrivateFriendList