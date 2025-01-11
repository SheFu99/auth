
import { getSession } from "next-auth/react";
import { db } from "./db";
import { getUserById } from "@/data/user";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth.config";


export const currentUser = async () =>{
    const session = await getServerSession(authConfig)
    // console.log('CURRENT_USER_HOOK',session)
    if(!session||session == null){
        return 
    }
    // const userFromAPI = await getUserById(session?.user?.id)
    // if (!userFromAPI){
    //     return null 
    // }
    return session.user
}

export const currentRole = async () =>{
    const session = await getServerSession(authConfig)

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

///

export const CurrentProfile = async ()=>{
    const session = await getSession()
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
