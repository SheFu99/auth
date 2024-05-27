
"use server"
import * as z from "zod"
import { db } from "@/lib/db"
import { UserProfile } from "@/schemas"
import { CurrentProfile, currentUser } from "@/lib/auth"


// type UserProfile = z.infer<typeof UserProfile>

// const ProfileResponse = UserProfile.extend({
//   success:z.boolean().nullable(),
//   error:z.string().nullable()
// })
export type Profile = z.infer<typeof UserProfile>

export const getProfileById = async (userId:string)=>{
  
  if(!userId){
    return {error: 'userId is required'}
  }
  const existingProfile = await CurrentProfile()
    if(!existingProfile){
      return {error: 'Profile not found'}
    }
    
    // console.log(existingProfile)
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
    // This case might indicate a more serious issue: the user is authenticated but not in the DB
    return { error: 'User not found in the database. Authorization mismatch.' };
  }

  console.log(existingUser.role)

  try {
    // Proceed to create the profile with values provided and connect to the existing user
    const profile = await db.profile.create({
      data: {
        ...values,
        userId: existingUser.id, // Directly using the ID from `existingUser`
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

type publicProfileParams = {
  userId:string,
  requesterId?:string,
}
export const getPublicProfile = async (userId:string)=>{
    const user = await currentUser()
  
    if(!userId){
      return {error: 'userId is required'}
    }
    const ExtendedProfile = await db.user.findFirst({
      where: {
        id: userId
      },
      select: {
        image: true,  // Assuming the image is stored directly in the user record
      }
    });
  
    if (!ExtendedProfile) {
      return { error: "User not found" };
    }
   console.log(user)
  try {
    const existingProfile = await db.profile.findFirst({
      where:{
        userId:userId,
      }, 
    });
    console.log('adresat:',userId,'reqestner:',user.id)
    const relations = user ? await db.friendShip.findFirst({
      where:{
        adresseedId:userId,
        requesterId:user.id
      },
      select:{
        transactionId:true,
        status:true,
      }
      
    }):undefined
    console.log(relations)
  
    console.log(existingProfile)

      if(!existingProfile){
        return {error: 'Profile not found'}
      }
      
       return {
      profile: existingProfile,
      userImage: ExtendedProfile.image,
      friendStatus: relations
    };
  } catch (error) {
    return {error:error}
  }
  }

