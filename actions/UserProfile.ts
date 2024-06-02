
"use server"
import * as z from "zod"
import { db } from "@/lib/db"
import { UserProfile } from "@/schemas"
import { CurrentProfile, currentUser } from "@/lib/auth"
import { ProfileData, friendshipStatus } from "@/components/types/globalTs"


// type UserProfile = z.infer<typeof UserProfile>

// const ProfileResponse = UserProfile.extend({
//   success:z.boolean().nullable(),
//   error:z.string().nullable()
// })

export type relation = {
  relationTo?:FRtransaction;
  relationFrom?:FRtransaction;
}
export type FRtransaction={
  transactionId:string;
  status:friendshipStatus
}
export type Profile = z.infer<typeof UserProfile>

export const getProfileById = async (userId:string)=>{
  
  if(!userId){
    return {error: 'userId is required'}
  }
  const existingProfile = await CurrentProfile()
    if(!existingProfile){
      return {error: 'Profile not found'}
    }
    return  existingProfile
}

export const createUserProfile = async (values: Profile) => {

  const user = await currentUser();

  if (!user) {
    return { error: 'You need to be authorized!' };
  }


  const existingUser = await db.user.findUnique({
    where: {
      id: user.id, 
    },
  });

  if (!existingUser) {
    return { error: 'User not found in the database. Authorization mismatch.' };
  }

  console.log(existingUser.role)

  try {
    // Proceed to create the profile with values provided and connect to the existing user
    const profile = await db.profile.create({
      data: {
        ...values,
        userId: existingUser.id, 
      },
    });

    return profile; 
  } catch (error) {
    console.error('Failed to create user profile:', error);
    return { error: 'Failed to create user profile.' };
  }
};

export const updateUserProfile = async (values: Profile)=>{
  console.log("update user profile")
  const user = await currentUser()

  if(!user){return {error: "you need to be authorized"}}

  const existingUser = await db.user.findFirst({
    where:{
      id:user.id
    }
  })

  if(!existingUser){return {error:"User is not found"}}

  try{
    const editedProfile = await db.profile.update({
      where:{userId:existingUser.id},
      data:{...values}
    })
    return {
      editedProfile:editedProfile,
      success: true
    }
  }catch(error){
    console.log("Failed updateUserProfile",error)
    return {error:'Failed to update user profile'}
  }
}

export type getProfilePromise ={
  error?: string;
  profile?: ProfileData;
  friendStatus?: relation;
}
export const getPublicProfile = async (userId:string):Promise<getProfilePromise>=>{
  console.log("Get_Public_Profile")
    const user = await currentUser()
  
    if(!userId){
      return {error: 'userId is required'}
    }
    let relation:relation
  
  
   if(user){
    try {
      const relationsFrom = await db.friendShip.findFirst({
        where:{
            AND:[
              {adresseedId:userId},
              {requesterId:user.id}
            ]
        },
        select:{
          transactionId:true,
          status:true,
        }
        
      });
      const relationsTo = await db.friendShip.findFirst({
        where:{
          AND:[
            {adresseedId:user.id},
            {requesterId:userId}
          ]
        
        
        },
        select:{
          transactionId:true,
          status:true,
        }
        
      });
      relation = relationsFrom !==null||undefined ? {relationFrom:relationsFrom}:{relationTo:relationsTo}
    } catch (error) {
      return {error:'Error with profile FR.relation'}
    }
 }
   
    const existingProfile = await db.profile.findFirst({
      where:{
        userId:userId,
      }, 
    });
    
      if(!existingProfile){
        return {error: 'Profile not found'}
      }
       return {
        profile: existingProfile,
        friendStatus: relation
      };

  }

