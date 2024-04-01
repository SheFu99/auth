"use server"

import { db } from "@/lib/db"


export const getUserProfile = async (userId:string)=>{
  if(!userId){
    return {error: 'userId is required'}
  }
    const profileInfo = await db.profile.findFirst({
        where:{
            userId:userId
        }
    })
    return profileInfo
}

