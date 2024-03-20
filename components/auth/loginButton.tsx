"use client"
import { useRouter } from "next/navigation";
interface LoginButtonProps{
    children:React.ReactNode;
    mode?:"modal"|"redirect"|"poppover",
    asChild?: boolean;
};

export const LoginButton = ({children,mode="redirect",asChild}:LoginButtonProps)=>{
    const router = useRouter();

    const onClick=()=>{
        if(mode==="redirect"){
           router.push("auth/login")
        }

        if(mode==="modal"){
           console.log("modal")
        }
    }
    return(
        <span className=" cursor-pointer" onClick={onClick}>
            {children}
        </span>
     )
}