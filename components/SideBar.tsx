'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiSettings } from "react-icons/fi";
import { MdAdminPanelSettings } from "react-icons/md";
import { RiAccountBoxFill } from "react-icons/ri";
import { TbNews } from "react-icons/tb";
import LoginForm from "./auth/loginForm";


interface SideBarProps{
    className?:string;
    role?:string;
    bar?:boolean
}



const SideBar :React.FC<SideBarProps>=  ({className,role,bar}) => {
    const pathname = usePathname();

    return ( 
     

        <div className={`${className}  `}>
            <div className={bar ? 'space-x-2 w-full sticky bottom-0 p-3 rounded-xl flex justify-center items-center backdrop-blur-md' : "space-y-1 border p-5 rounded-xl mt-10 sticky top-3 "} >
            {role?(
                <>
            {role === 'ADMIN'&&role &&(
                  <>
                  <Button 
                      asChild
                      variant={pathname === "/admin" ? "default" : "outline"}
                      className={bar? 'w-1/6 rounded-xl ':'w-full'}
                  > 
                      <a href="/admin" className="flex items-center justify-start gap-3">
                          <MdAdminPanelSettings className="xl:h-5 xl:w-5 size-7 " />
                          <p className="hidden  xl:inline">Admin</p>
                      </a>

                      
                  </Button>
              </>
              
            )}
            <>

                <Button 
                      asChild
                      variant={pathname === "/news" ? "default" : "outline"}
                      className={bar? 'w-1/6 rounded-xl':'w-full'}
                  > 
                      <a href="/news" className="flex items-center justify-start gap-3">
                          <TbNews className="xl:h-5 xl:w-5 size-7" />
                          <p className=" hidden xl:inline ">News</p>
                      </a>
                  </Button>
                </>

                <>
                <Button 
                      asChild
                      variant={pathname === "/settings/profile" ? "default" : "outline"}
                      className={bar? 'w-1/6 rounded-xl':'w-full'}
                  > 
                      <Link href="/settings/profile" className="flex items-center justify-start gap-3">
                          <RiAccountBoxFill className="xl:h-5 xl:w-5 size-7" />
                          <p className=" hidden xl:inline">Profile</p>
                      </Link>
                  </Button>
                </>

                <>
                <Button 
                      asChild
                      variant={pathname === "/settings" ? "default" : "outline"}
                      className={bar? 'w-1/6 rounded-xl':'w-full'}
                  > 
                      <a href="/settings" className="flex items-center justify-start gap-3">
                          <FiSettings className="xl:h-5 xl:w-5 size-7" />
                          <p className=" hidden xl:inline">Settings</p>
                      </a>
                  </Button>
                </>
                </>
            ):(
                <div>
                    <div className="sm:hidden md:block">
                        <LoginForm />
                    </div>

                </div>
            )}
           </div>
        </div>
       
     );
}
 
export default SideBar;
