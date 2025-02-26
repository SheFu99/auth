
"use server"
import React from "react";
import Navbar from "@/components/navbar";
import SideBar from "@/components/SideBar";
import QueryProvider from "@/util/QueryProvider";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth.config";

import SessionProviderWrapper from "@/app/(protected)/sessionProviderWrapper";

type PublicProfileProps = {
    children?:React.ReactNode,
}

const PublicPostLayout:React.FC<PublicProfileProps> = async ({children}) => {
    const session = await getServerSession(authConfig)
    console.log('session',session)
    const user = session?.user
    console.log('Render_SSSION_TRIGGERED')
    
    return ( 
        //Do not use session provider with <Link/> component!
        // <SessionProvider session={session}>
                <>
                {session ? (
                    <SessionProviderWrapper session={session}>
                    <div> <Navbar user={user}/>
                    <div className="col-span-12 col-start-1 row-span-2">
                        <div className="grid space-y-10 mr-2 ml-2 grid-cols-12">
                        <SideBar role={user.role} bar={false}
                                                    className="xl:col-start-2 xl:col-span-2 
                                                            hidden 
                                                            sm:inline sm:col-start-1 sm:col-span-2"/>

                                <div className="xl:col-start-4 xl:col-span-6 
                                            sm:col-span-10 sm:mr-5 sm:col-start-3 
                                            sm:ml-8
                                            col-start-1 col-span-12 ">
                                    <QueryProvider>
                                        {children}
                                    </QueryProvider>
                                </div>
                                <SideBar role={user.role}  bar={true}                  
                                                 className="col-span-12 fixed inset-x-0 bottom-0
                                                            sm:hidden inline  
                                                            sm:col-start-1 sm:col-span-2"/>
                        </div>
                    </div>
                    </div>
                    </SessionProviderWrapper>
                ) :(
                    <div>
                         <QueryProvider>
                        <Navbar user={user}/>
                        <div className="col-span-12 col-start-1 row-span-2 mt-5">
                        <div className="grid space-y-10 mr-2 ml-2 grid-cols-12">
                     <div className="xl:col-start-4 xl:col-span-6 
                                            sm:col-span-10 sm:mr-5 sm:col-start-3 
                                            sm:ml-8
                                            col-start-1 col-span-12 ">
                                   
                                        {children}
                                   
                                </div>
                                </div>
                                </div>
                                </QueryProvider>
                    </div>
                )}
                   
                    </>
     );
    }
 
export default PublicPostLayout;