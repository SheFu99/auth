"use server";

import { currentRole, getAllUsers } from "@/lib/auth";

 const UserRole = {
    ADMIN: "ADMIN",
    USER: "USER",
    EDITOR: "EDITOR",
    GUEST: "GUEST",
} as const;


export const admin = async () =>{
    const role =await currentRole();
   


    if(role!==UserRole.ADMIN){
        return {error: "Frobidden!"}
    }
        

    const AllUser = await getAllUsers()
    
    return AllUser
    
}