
import { GiHamburgerMenu } from "react-icons/gi";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet"
import SideBar from './SideBar';
import React from "react";
import UserButton from "./auth/user-button";
// const UserButton = React.lazy(()=> import ("./auth/user-button"));
  

 const Navbar = ()=>{
  
    return(
        <nav className="bg-secondary col-start-1 col-span-12 row-span-1  rounded-xs md:w-full h-auto grid grid-cols-12">
            <Sheet>
                <SheetTrigger className="md:hidden xs:block p-2 ml-4 "><GiHamburgerMenu/></SheetTrigger>
                <SheetContent className="g-f:w-[200px] sm:w-[225px] md:w-[225px] flex">
                <SideBar className="justify-start "/>
                </SheetContent>
                </Sheet>
        <div className="col-start-12">
            <div className='flex justify-end g-f:p-4 md:p-4 xl:p-3'>
                <UserButton />
            </div>
        </div>
    </nav>
    
    )
}
export default Navbar