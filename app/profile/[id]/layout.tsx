
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
    console.log('Render_SSSION_TRIGGERED')

    return ( 
        
        // <SessionProvider session={session}>
                <>
                
                <Navbar/>
                    <div className="col-span-12 col-start-1 row-span-2">
                        <div className="grid space-y-10 mr-2 ml-2 grid-cols-12">

                            <SideBar className=" xl:col-start-2 xl:col-span-2 xl:mt-5 hidden sm:block  sm:col-start-1 sm:col-span-2"/>

                                <div className="xl:col-start-4 xl:col-span-6 sm:col-span-10 sm:mr-5 sm:col-start-3 col-start-1 col-span-12 ">
                                    {children} 
                            </div>
                        </div>
                    </div>
                    </>
     );
     {/* </SessionProvider> */}
    }
 
export default PublicProfileLayout;