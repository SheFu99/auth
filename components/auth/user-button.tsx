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
// import { useEffect } from "react"


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
                    variant={pathname === "/client" ? "default" : "outline"}
                    className="w-full"
                > 
                    <Link href="/client" className="grid grid-cols-6"
                    ><MdOutlineDevices className="col-start-1"/><p className="col-start-3">Client</p></Link>
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