"use client"

import { FaUser } from "react-icons/fa"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useCurrentUser } from "@/hooks/use-current-user"
import { LogoutButton } from "./logout-button"
import { ExitIcon } from "@radix-ui/react-icons"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "../ui/button"
import { FiSettings } from "react-icons/fi";
import { FiServer } from "react-icons/fi";
import { MdAdminPanelSettings  } from "react-icons/md";
import { useCurrentRole } from "@/hooks/use-current-role"

import { ImProfile } from "react-icons/im";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { SlLogin } from "react-icons/sl";
import { LoginButton } from "./loginButton"
import { useEffect } from "react"
// import { useEffect } from "react"


 const UserButton =  ()=>{
 
    const pathname = usePathname()
    const user = useCurrentUser()
    const userImage = user?.image || ""
    const role = useCurrentRole()

    // useEffect(()=>{
    //     console.log(userImage)
    // },[])


    return(
        <DropdownMenu>
            {user ?(
            <DropdownMenuTrigger title="User interface">
                <Avatar>
                    <AvatarImage src={userImage} alt="User Menu Button" />
                    <AvatarFallback className="bg-sky-500">
                        <FaUser className="text-white"/>
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            ):(
                <div className="p-2 px-5 cursor-pointer" >
                <LoginButton mode="modal" asChild >
                    <SlLogin className="scale-150 " title="Log in" role="button"/>
                </LoginButton>
                </div>
            )}
            


            <DropdownMenuContent className="w-12" align="end">
{role === 'ADMIN' &&(
                <>
                <Button
                    asChild
                    variant={pathname === "/admin" ? "default" : "outline"}
                    className="w-full"
                > 
                    <a href="/admin" className="grid grid-cols-6"
                    ><MdAdminPanelSettings  className="col-start-1 h-5 w-5"/><p className="col-start-3">Admin</p></a>
                </Button>
                </>
           )}
          
                <Button
                    asChild
                    variant={pathname === "/settings/profile" ? "default" : "outline"}
                    className="w-full"
                > 
                    <a href="/settings/profile" className="grid grid-cols-6"
                    ><ImProfile className="col-start-1"/><p className="col-start-3">Profile</p></a>
                </Button>
{role === 'ADMIN' &&(
                <>
                <Button
                    asChild
                    variant={pathname === "/server" ? "default" : "outline"}
                    className="w-full"
                > 
                    <a href="/server" className="grid grid-cols-6">
                        <FiServer className="col-start-1"/>
                        <p className="col-start-3">Server</p>
                    </a>
                </Button>
                </> 
                )}
                <Button
                    asChild
                    variant={pathname === "/settings" ? "default" : "outline"}
                    className="w-full"
                > 
                    <a href="/settings" className="grid grid-cols-6"
                    ><FiSettings className="col-start-1"/><p className="col-start-3 ml-[-2px]">Settings</p></a>
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

export default UserButton