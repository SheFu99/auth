
"use server"
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
// const Navbar =React.lazy(()=>import ('@/components/navbar'))
// import SideBar from "@/components/SideBar";
import React from "react";
import Navbar from "@/components/navbar";
import SideBar from "@/components/SideBar";


// interface ProtecteedLayoutProps{
//     children: React.ReactNode;
//     profileData: any;
// }

const ProtectedLayout = async ({children}:any) => {
    const session = await auth()
    // console.log('ProtectedLayout',session)
    const user = session.user

    return ( 
        
        <SessionProvider session={session}>
        
                <Navbar user={user}/>
            {/* <div className="col-span-12 col-start-1 row-span-2">
                <div className="grid space-y-5 mr-2 ml-2 grid-cols-12">

                    <SideBar className="md:col-start-1 md:col-span-2 md:mt-5 hidden md:block "/>

                        <div className="md:col-start-3 md:col-span-9 col-start-1 col-span-12 ">
                            {children} 
                       </div>
                </div>
            </div> */}
            <div className="col-span-12 col-start-1 row-span-2">
                        <div className="grid space-y-10 mr-2 ml-2 grid-cols-12 ">
                            
                            <SideBar role={user.role} bar={false}
                                                        className="xl:col-start-2 xl:col-span-2 
                                                                hidden 
                                                                sm:inline sm:col-start-1 sm:col-span-2"/>

                                <div className="xl:col-start-4 xl:col-span-6 
                                                sm:col-span-10 sm:mr-5 sm:col-start-3 
                                                sm:ml-8
                                                col-start-1 col-span-12 ">
                                    {children} 
                            </div>
                            <SideBar role={user.role}  bar={true}                  
                                                     className="col-span-12 fixed inset-x-0 bottom-0
                                                                sm:hidden inline  
                                                                sm:col-start-1 sm:col-span-2"/>

                        </div>
                    </div>
  
        </SessionProvider>
     );
}
 
export default ProtectedLayout;