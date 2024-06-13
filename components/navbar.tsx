
import { GiHamburgerMenu } from "react-icons/gi";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet"
import SideBar from './SideBar';
import React from "react";
import UserButton from "./auth/user-button";
import { ExtendedUser } from "@/next-auth";
import HomiesLoader from "./HomiesLoader";
// const UserButton = React.lazy(()=> import ("./auth/user-button"));
  
type navbarProps = {
    user?:ExtendedUser;

}
 const Navbar:React.FC<navbarProps> = ({user})=>{
    const role = user?.role
    
    return(
        <>
     
            <nav className=" bg-opacity-30 bg-neutral-900  col-start-1 col-span-12 row-span-1  rounded-xs md:w-full h-auto grid grid-cols-12">
            
            <div className="">
          
            </div>
                <Sheet>
                    <SheetTrigger 
                        title="Humburger Menu" 
                        className="md:block p-2 ml-4 xl:hidden hidden">
                            <GiHamburgerMenu/>
                        </SheetTrigger>
                    <SheetContent className="g-f:w-[200px] sm:w-[225px] md:w-[225px] flex">
                        <SideBar role={role} className="justify-start "/>
                    </SheetContent>
                    </Sheet>
                <div className="col-start-12">
                    <div className='flex justify-end g-f:p-4 md:p-4 xl:p-3 '>
                        <UserButton user={user}/>
                    </div>
                </div>
            </nav>
   
    </>
    )
}
export default Navbar