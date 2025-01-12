'use client'
import React from "react";
import UserButton from "./auth/user-button";
import { ExtendedUser } from "@/next-auth";
import { IoChevronBackOutline } from "react-icons/io5";
import { NavSearch } from "./search/user/searchBar/SerchBar_server";
import { useRouter } from "next/navigation";
// const UserButton = React.lazy(()=> import ("./auth/user-button"));
  
type navbarProps = {
    user?:ExtendedUser;


}
 const Navbar:React.FC<navbarProps> = ({user})=>{
    const role = user?.role
    const goBack = ()=>{
        window.history.back()
    }
    const baseURL = process.env.NEXT_PUBLIC_APP_URL
    const currentPath = window.location.href
    const route = currentPath.replace(baseURL,'')
    console.log('currentPath',route)
    return(
        <>
        
            <nav className=" bg-opacity-30 bg-neutral-900  col-start-1 col-span-12 row-span-1  rounded-xs md:w-full h-auto 
            grid grid-cols-12
            item-center jus">
            
            <div className="">
                
            </div>
                    <button 
                        type="button"
                        title="goBack"
                        onClick={()=>goBack()}
                        className="col-start-1 p-3"
                        >
                        <IoChevronBackOutline color="white" className="scale-120"/>
                    </button>
                    <div className="col-start-3 col-span-8 p-5 ml-5">
                        <NavSearch user={user}/>

                    </div>
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