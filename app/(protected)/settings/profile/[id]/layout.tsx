
"use server"
// import { auth } from "@/auth";
import React from "react";
import Navbar from "@/components/navbar";
import SideBar from "@/components/SideBar";
import QueryProvider from "@/util/QueryProvider";

import { getServerSession } from "next-auth";
import SessionProviderWrapper from "@/app/(protected)/sessionProviderWrapper";

type PublicProfileProps = {
    children?:React.ReactNode,
    searchParams?:{search:string},
}

const PublicProfileLayout = async ({children,searchParams}:PublicProfileProps) => {
  const search = searchParams?.search
console.log(search)
    const session = await getServerSession()
    const user = session?.user
    console.log('Render_SSSION_TRIGGERED')
    return ( 
        //Do not use session provider with <Link/> component!
        // <SessionProvider session={session}>
                <>
                <SessionProviderWrapper session={session}>
                <QueryProvider>
                    <Navbar user={user}/>
                        <div className="col-span-12 col-start-1 row-span-2">
                            <div className="grid space-y-10 mr-2 ml-2 grid-cols-12">
                            {/* <SideBar role={user?.role} className=" sticky top-0 z-10 bg-card shadow-sm"/> */}
                                    <div className="xl:col-start-4 xl:col-span-6 sm:col-span-10 sm:mr-5 sm:col-start-2 col-start-1 col-span-12 ">
                                      
                               
                                                                                           
                                                                                           {children} 
                                                                                    
                                </div>
                            </div>
                           
                            {/* <BottomNavBar user={user}/> */}
                            
                    
                        </div>
                        
                        </QueryProvider>
                        </SessionProviderWrapper>
                    </>
        // </SessionProvider>
     );
    }
 
export default PublicProfileLayout;