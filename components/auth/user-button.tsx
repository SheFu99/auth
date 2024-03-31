"use client"

import { FaUser } from "react-icons/fa"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useCurrentUser } from "@/hooks/use-current-user"
import { LogoutButton } from "./logout-button"
import { ExitIcon } from "@radix-ui/react-icons"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "../ui/button"
import { FiSettings } from "react-icons/fi";
import { FiServer } from "react-icons/fi";
import { MdOutlineDevices,MdAdminPanelSettings  } from "react-icons/md";
import { useCurrentRole } from "@/hooks/use-current-role"

import { ImProfile } from "react-icons/im";
// import { useEffect } from "react"

const activeElementClasses = 'text-sm md:text-md flex gap-1 md:gap-3 py-3 my-1 bg-socialBlue text-white md:-mx-7 px-6 md:px-7 rounded-md shadow-md shadow-gray-300 items-center';
const nonActiveElementClasses= 'text-sm md:text-md flex gap-1 md:gap-3 py-2 my-2 hover:bg-blue-500 hover:bg-opacity-20 md:-mx-4 px-6 md:px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300 items-center';

export const UserButton = ()=>{
    const pathname = usePathname();
    
    const user = useCurrentUser()
    const userImage = user?.image || ""
    const role = useCurrentRole()

    // useEffect(()=>{
    //     // console.log(role)
    // },[])


    return(
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={userImage}/>
                    <AvatarFallback className="bg-sky-500">
                        <FaUser className="text-white"/>
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>


            <DropdownMenuContent className="w-12" align="end">
{role === 'ADMIN' &&(
                <>
                <Button
                    asChild
                    variant={pathname === "/admin" ? "default" : "outline"}
                    className="w-full"
                > 
                    <Link href="/admin" className="grid grid-cols-6"
                    ><MdAdminPanelSettings  className="col-start-1 h-5 w-5"/><p className="col-start-3">Admin</p></Link>
                </Button>
                </>
           )}
          
                <Button
                    asChild
                    variant={pathname === "/settings/profile" ? "default" : "outline"}
                    className="w-full"
                > 
                    <Link href="/settings/profile" className="grid grid-cols-6"
                    ><ImProfile className="col-start-1"/><p className="col-start-3">Profile</p></Link>
                </Button>
{role === 'ADMIN' &&(
                <>
                <Button
                    asChild
                    variant={pathname === "/server" ? "default" : "outline"}
                    className="w-full"
                > 
                    <Link href="/server" className="grid grid-cols-6">
                        <FiServer className="col-start-1"/>
                        <p className="col-start-3">Server</p>
                    </Link>
                </Button>
                </> 
                )}
                <Button
                    asChild
                    variant={pathname === "/settings" ? "default" : "outline"}
                    className="w-full"
                > 
                    <Link href="/settings" className="grid grid-cols-6"
                    ><FiSettings className="col-start-1"/><p className="col-start-3 ml-[-2px]">Settings</p></Link>
                </Button>

               
                
                <LogoutButton >
                    <DropdownMenuItem className="grid grid-cols-6">
                    <ExitIcon className="col-start-1"/>
                       <p className="col-start-3">LogOut</p>  
                    </DropdownMenuItem>
                </LogoutButton>
              


            </DropdownMenuContent>
            
        </DropdownMenu>
    )
}