'use client'

import { Button } from "@/components/ui/button";
import { useCurrentRole } from "@/hooks/use-current-role";
import { usePathname } from "next/navigation";
import { FiSettings } from "react-icons/fi";
import { MdAdminPanelSettings } from "react-icons/md";
import { RiAccountBoxFill } from "react-icons/ri";

interface SideBarProps{
    className?:string;
}



const SideBar :React.FC<SideBarProps>= ({className}) => {
    console.log("ROLE_FETCH")
    const pathname = usePathname();
    const role = useCurrentRole()


    return ( 
        <div className={`${className} p-5 space-y-1`}>
            {role === 'ADMIN' &&(
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
                      <a href="/settings/profile" className="grid grid-cols-6">
                          <RiAccountBoxFill className="col-start-1 h-5 w-5" />
                          <p className="col-start-3">Profile</p>
                      </a>
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
        </div>
     );
}
 
export default SideBar;
