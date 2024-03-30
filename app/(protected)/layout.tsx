import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Navbar } from "./_component/navbar";
import SideBar from "./_component/SideBar";

interface ProtecteedLayoutProps{
    children: React.ReactNode;
}
const ProtectedLayout = async ({children}:ProtecteedLayoutProps) => {
    const session = await auth()
    return ( 
        <SessionProvider session={session}>
        <div className="grid grid-cols-12 grid-rows-12 h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
                <Navbar/>
            <div className="col-span-9 col-start-2 row-span-2">
                <div className="grid space-y-10 grid-cols-8">
                    <SideBar className="col-start-1 col-span-2 mt-5"/>
                        <div className="col-start-3 col-span-7">
                            {children} 
                       </div>

                </div>
            </div>
        </div>
        </SessionProvider>
     );
}
 
export default ProtectedLayout;