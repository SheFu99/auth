'use client'

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { useCurrentRole } from "@/hooks/use-current-role";
import { currentRole } from "@/lib/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiSettings } from "react-icons/fi";
import { MdAdminPanelSettings } from "react-icons/md";
import { RiAccountBoxFill } from "react-icons/ri";
import LoginForm from "./auth/loginForm";

interface SideBarProps{
    className?:string;
    role?:string;
}



const SideBar :React.FC<SideBarProps>=  ({className,role}) => {

    console.log(role)
    const pathname = usePathname();

    

    return ( 
        <div className={`${className} p-5 space-y-1`}>
            {role?(
                <>
                     {role === 'ADMIN'&&role &&(
                  <>
                  <Button 
                      asChild
                      variant={pathname === "/admin" ? "default" : "outline"}
                      className="w-full"
                  > 
                      <a href="/admin" className="grid grid-cols-6">
                          <MdAdminPanelSettings className="col-start-1 h-5 w-5" />
                          <p className="col-start-3">Admin</p>
                      </a>
                  </Button>
              </>
           )}
                <>
                <Button 
                      asChild
                      variant={pathname === "/settings/profile" ? "default" : "outline"}
                      className="w-full"
                  > 
                      <Link href="/settings/profile" className="grid grid-cols-6">
                          <RiAccountBoxFill className="col-start-1 h-5 w-5" />
                          <p className="col-start-3">Profile</p>
                      </Link>
                  </Button>
                </>
                <>
                <Button 
                      asChild
                      variant={pathname === "/settings" ? "default" : "outline"}
                      className="w-full"
                  > 
                      <a href="/settings" className="grid grid-cols-6">
                          <FiSettings className="col-start-1 h-5 w-5" />
                          <p className="col-start-3">Settings</p>
                      </a>
                  </Button>
                </>
                </>
            ):(
                <LoginForm/>
            )}
           
        </div>
     );
}
 
export default SideBar;
