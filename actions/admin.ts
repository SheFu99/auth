"use server";

import { currentRole } from "@/lib/auth";
import { db } from "@/lib/db";

 const UserRole = {
    ADMIN: "ADMIN",
    USER: "USER",
    EDITOR: "EDITOR",
    GUEST: "GUEST",
} as const;


export const admin = async () =>{
    const role =await currentRole();
    console.log('AdminActionRole:',role)


    if(role!==UserRole.ADMIN){
        return {error: "Frobidden!"}
    }
        
    try {
        const AllUser =  await db.user.findMany()
        console.log('AdminActionAllUser:',AllUser)
        return AllUser
    } catch (error) {
        console.log('AdminActionError:',error)
        return {error}
    }
    
   
    
}