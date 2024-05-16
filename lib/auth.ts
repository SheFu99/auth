import { auth } from "@/auth";
import { db } from "./db";
import {debounce} from 'lodash'

const debouncedAuth = debounce(auth ,console.log("DEBOUCNE"),1024);



export const currentUser = async () =>{
    const session = await debouncedAuth()

    return session?.user
}

export const currentRole = async () =>{
    const session = await debouncedAuth()
    // console.log("CurrentRole",session?.user.role)
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
