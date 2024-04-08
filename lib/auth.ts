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
const logCurrentRole = async () => {
    const role = await currentRole();
    console.log("CurrentRole outside function", role);
};
logCurrentRole();

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
