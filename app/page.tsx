

import { Poppins } from "next/font/google"
import {  cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LoginButton } from "@/components/auth/loginButton"
import { SessionProvider } from "next-auth/react"
import { useRouter } from "next/navigation"


const font = Poppins({
  subsets:["latin"],
  weight:['600']
})


 
export default async function Home() {
  const router = useRouter()

  return (
    <>
   
      <SessionProvider >
      <main className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradients-stops))] from-sky-300 to-blue-300 flex h-full flex-col items-center justify-center w-full">
        
        <div className="space-y-6">
          <h1 className={cn("text-6xl font-semibold text-white drop-shadow-md",
            font.className,
          )}>
          🔐auth
          </h1>
          <p className="text-lg text-white drop-shadow-sm"> A simple authentication service</p>
        </div>

        <div className="mt-5">
          <LoginButton mode="modal" asChild>
            <Button variant="secondary" size='lg'>
              Login
            </Button>
          </LoginButton>
        </div>

      </main>     
      </SessionProvider>  
      
    </>
    )
}


