'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiSettings } from "react-icons/fi";
import { MdAdminPanelSettings } from "react-icons/md";
import { RiAccountBoxFill } from "react-icons/ri";
import { TbNews } from "react-icons/tb";
import LoginForm from "./auth/loginForm";
import { CardFooter } from "./ui/card";
import { Social } from "./auth/social";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";


interface SideBarProps{
    className?:string;
    role?:string;
    bar?:boolean
}



const SideBar :React.FC<SideBarProps>=  ({className,role,bar}) => {
    const pathname = usePathname();

    return ( 
     

        <div className={`${className}  `}>
            <div className="z-40">
            <div className={bar ? 'space-x-2 w-full sticky bottom-0 p-3 rounded-xl flex justify-center items-center backdrop-blur-md' : "space-y-1 border p-5 rounded-xl mt-10 sticky top-3 z-20"} >
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
                <div className="w-full z-[999]">
                    <div className="hidden md:block w-full">
                        <div className="flex items-center justify-center align-bottom w-full">
                        
                                    <LoginForm />
                            
                        </div>
                    </div>
                    <div className="xl:hidden sm:hidden md:hidden g-f:block w-full mb-[-15px]">
                            <div className="flex items-center justify-center align-bottom w-full">
                                <Accordion type="single" collapsible className="w-full " defaultValue="item-1">
                                    <AccordionItem value="item-1" className="border-none">
                                    <AccordionTrigger className="text-white hover:no-underline bg-black bg-opacity-50 backdrop-blur-md rounded-t-lg px-4 py-2 w-full">
                                        Login/Sign-in
                                    </AccordionTrigger>
                                    <AccordionContent className="text-white bg-black bg-opacity-50 backdrop-blur-md rounded-b-lg px-4 py-2">
                                        <LoginForm />
                                    </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                    <div className="hidden sm:block md:hidden">
               
                                    <Social className='flex flex-wrap gap-2' />
                   
                    </div>
                </div>
            )}
           </div>
        </div>
        </div>
     );
}
 
export default SideBar;
