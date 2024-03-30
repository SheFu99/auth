"use server";

import { currentRole, getAllUsers } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const admin = async () =>{
    const role =await currentRole();
    const AllUser = await getAllUsers()


    if(role!==UserRole.ADMIN){
        return {error: "Frobidden!"}
    }else {
        return AllUser
    }

    

    
}