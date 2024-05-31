"use client"
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import RegisterForm from "./registerform";
interface LoginButtonProps{
    children:React.ReactNode;
    mode?:"modal"|"redirect"|"poppover",
    asChild?: boolean;
};

export const RegisterButton = ({children,mode="redirect",asChild}:LoginButtonProps)=>{
    const router = useRouter();

    const onClick=()=>{
     
           router.push("auth/login")}
    

        if(mode==="modal"){
           return(
            <Dialog >
                <DialogTrigger asChild={asChild}>
                    {children}
                </DialogTrigger>
                <DialogContent className="p-1 w-full bg-transparent border-none">
                    <RegisterForm/>
                </DialogContent>
            </Dialog>
           )
        }
    
    return(
        <span className=" cursor-pointer" onClick={onClick}>
            {children}
        </span>
     )
}