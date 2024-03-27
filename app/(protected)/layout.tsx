import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Navbar } from "./_component/navbar";

interface ProtecteedLayoutProps{
    children: React.ReactNode;
}
const ProtectedLayout = async ({children}:ProtecteedLayoutProps) => {
    const session = await auth()
    return ( 
        <SessionProvider session={session}>
        <div className="grid grid-cols-12 grid-rows-12 h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
        <Navbar/>
            <div className="col-start-4 col-span-6 row-start-3">
                {children} 
            </div>
        </div>
        </SessionProvider>
     );
}
 
export default ProtectedLayout;