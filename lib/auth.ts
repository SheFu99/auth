import { auth } from "@/auth";
import { db } from "./db";


export const currentUser = async () =>{
    const session = await auth()

    return session?.user
}

export const currentRole = async () =>{
    const session = await auth()
    console.log("CurrentRole",session?.user.role)
    return session?.user.role
}


///protected ADMIN only 
export const getAllUsers= async () => {
    const allUsers = await db.user.findMany();


    return allUsers
}