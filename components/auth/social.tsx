'use client'
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "../../routes";
import { useSearchParams } from "next/navigation";

interface socialButton {
    className?:string,
    // buttonSize?:"default" | "sm" | "lg" | "icon"
}

export const Social = ({className}:socialButton) =>{
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl");

const onClick = (provider:"google"| "github") => {
    signIn(provider ,{
        callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    })
}


    return(
        <div className={`${className} flex items-center gap-x-2 w-full`}>
            <Button 
                title="Log/id with Google"
                size='default'
                className="w-full"
                variant="outline"
                onClick={()=>onClick("google")}
                // onClick={handleSignInGoogle}
                >
                    <FcGoogle className={`h-5 w-5`}/>
            </Button>

            <Button 
                title="Log/id with GitHub"
                size="default"
                className="w-full"
                variant="outline"
                onClick={()=>onClick("github")}
                // onClick={handleSignIn}
                >
                    <FaGithub className={`h-5 w-5`}/>
            </Button>
        </div>
    )
}