
"use server"
import * as z from "zod"
import { db } from "@/lib/db"
import { UserProfile } from "@/schemas"
import { currentUser } from "@/lib/auth"
import { ProfileData, friendshipStatus } from "@/components/types/globalTs"
import { error } from "console"


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
 interface getProfileByIDPromise {
  error?:string,
  success?:boolean;
  profile?:ProfileData

 }

 ////TODO: change method of serch 
export const getCurrentProfile = async (userId:string):Promise<getProfileByIDPromise>=>{
  
  // const existingProfile = await CurrentProfile()
  const existingProfile = await db.profile.findFirst({
    where:{userId:userId}
  })
    if(!existingProfile){
      return {error: 'Profile not found'}
    }
    return  {profile:existingProfile}
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

const initialCurrentRelation = async (userId:string)=>{
  const user = await currentUser()
  if(!userId){
    return {error:'UserId requered!'}
  }
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
     const relation:relation = relationsFrom !==null||undefined ? {relationFrom:relationsFrom}:{relationTo:relationsTo}
      return {relation}
    } catch (error) {
      console.log(error)
      return {error:'Error with profile FR.relation'}
    }
  
  }
  else {
    return {error:'No user is auth!'}
  }


}
export const getPublicProfile = async (userId:string):Promise<getProfilePromise>=>{
  console.log("Get_Public_Profile")
    const user = await currentUser()
    const existingProfile = await db.profile.findFirst({
      where:{
        userId:userId,
      }, 
    });
    
      if(!existingProfile){
        return {error: 'Profile not found'}
      }
    if(!userId){
      return {error: 'userId is required'}
    }
  
    const {relation,error} = await initialCurrentRelation(userId)

       return {
        profile: existingProfile,
        friendStatus: relation
      };

  }

  export const getProfileByShortName = async (shortName:string):Promise<getProfilePromise> =>{
    console.log('shortName',shortName)
   let shortNameUser
    if(shortName.length<26){
      shortNameUser = await db.profile.findFirst({
        where:{shortName:shortName},
        }
      )
    }
    try {
      shortNameUser = await db.profile.findFirst({
        where:{
          OR:[
            {shortName:shortName},
            {userId:shortName}
          ]
         
        },
   
      })
      console.log(shortNameUser,'shortNameUser') 
      const {relation,error} = await initialCurrentRelation(shortNameUser.userId)
      console.log('relationLOG',relation)

      if(error){
        console.log('error',error)
      }

      if(shortNameUser&&relation){
        return {profile:shortNameUser,friendStatus:relation}
      }else if(shortNameUser){
        console.log('next')
        return {profile:shortNameUser}

      }
      if(!shortNameUser){
        return {error:'Found Nothing!'}
      }
    } catch (error) {
      // console.log(error)
        return {error:error}
    }
        
  }

