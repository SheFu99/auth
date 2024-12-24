import { auth } from "@/auth";
import { db } from "./db";
import { getUserById } from "@/data/user";


export const currentUser = async () =>{
    const session = await auth()
    console.log('CURRENT_USER_HOOK',session)
    if(!session||session == null){
        return 
    }
    const userFromAPI = await getUserById(session?.user?.id)
    if (!userFromAPI){
        return null 
    }
    return userFromAPI
}

export const currentRole = async () =>{
    const session = await auth()
    // console.log('CURRENT_USER_HOOK',session)
    if(!session||session == null){
        return 
    }
    const userFromAPI = await getUserById(session?.user?.id)
    if (!userFromAPI){
        return  
    }
    return userFromAPI?.role
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
