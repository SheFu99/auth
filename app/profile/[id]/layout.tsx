
"use server"
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import React from "react";
import Navbar from "@/components/navbar";
import SideBar from "@/components/SideBar";


interface ProtecteedLayoutProps{
    children: React.ReactNode;
    profileData: any;
}

const PublicProfileLayout = async ({children}:any) => {
    const session = await auth()

    return ( 
        
        <SessionProvider session={session}>
                
                <Navbar/>
                    <div className="col-span-12 col-start-1 row-span-2">
                        <div className="grid space-y-10 mr-2 ml-2 grid-cols-12">

                            <SideBar className="md:col-start-1 md:col-span-2 md:mt-5 hidden md:block "/>

                                <div className="md:col-start-3 md:col-span-9 col-start-1 col-span-12 ">
                                    {children} 
                            </div>
                        </div>
                    </div>

        </SessionProvider>
     );
}
 
export default PublicProfileLayout;