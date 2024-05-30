import { auth } from "@/auth";
import { db } from "./db";


export const currentUser = async () =>{
    const session = await auth()
    console.log('CURRENT_USER_HOOK')
    return session?.user
}

export const currentRole = async () =>{
    const session = await auth()
    console.log("CurrentRole")
    return session?.user.role
}


///protected ADMIN only 
export const getAllUsers= async () => {
    const allUsers = await db.user.findMany();


    return allUsers
}
///

export const CurrentProfile = async ()=>{
    const session = await auth()
    const profile = await db.profile.findFirst({
        where:{
            userId:session?.user.id
        }
    })
    console.log("Profile", profile)

    return profile
}

export const getAllProfile = async()=>{
    const allProfiles = await db.profile.findMany();

    return allProfiles
}
