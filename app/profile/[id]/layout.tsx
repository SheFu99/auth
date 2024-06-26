
"use server"
import { auth } from "@/auth";
import React from "react";
import Navbar from "@/components/navbar";
import SideBar from "@/components/SideBar";
import QueryProvider from "@/util/QueryProvider";

type PublicProfileProps = {
    children?:React.ReactNode,
    searchParams?:{search:string},
}

const PublicProfileLayout = async ({children,searchParams}:PublicProfileProps) => {
  const search = searchParams?.search
console.log(search)
    const session = await auth()
    const user = session?.user
    console.log('Render_SSSION_TRIGGERED')
    return ( 
        //Do not use session provider with <Link/> component!
        // <SessionProvider session={session}>
                <>
                
                    <Navbar user={user}/>
                        <div className="col-span-12 col-start-1 row-span-2">
                            <div className="grid space-y-10 mr-2 ml-2 grid-cols-12">
                            <SideBar role={user?.role} className=" xl:col-start-1 xl:col-span-3 xl:mt-5 hidden xl:block  sm:col-start-1 sm:col-span-2"/>
                                    <div className="xl:col-start-4 xl:col-span-6 sm:col-span-10 sm:mr-5 sm:col-start-2 col-start-1 col-span-12 ">
                                       <QueryProvider> {children} </QueryProvider>
                                </div>
                            </div>
                           
                            {/* <BottomNavBar user={user}/> */}
                            
                    
                        </div>
                    </>
        // </SessionProvider>
     );
    }
 
export default PublicProfileLayout;