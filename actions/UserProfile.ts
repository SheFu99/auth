"use server"
import * as z from "zod"
import { db } from "@/lib/db"
import { UserProfile } from "@/schemas"
import { CurrentProfile, currentUser } from "@/lib/auth"


export const getCurrentProfile = async (userId:string)=>{
  if(!userId){
    return {error: 'userId is required'}
  }
  const existingProfile = await CurrentProfile()
    if(!existingProfile){
      return {error: 'Profile not found'}
    }
    console.log(existingProfile)
    return existingProfile
}

export const createUserProfile = async (values: z.infer<typeof UserProfile>) => {

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
    // Return or throw a more generic error to avoid leaking details
    return { error: 'Failed to create user profile.' };
  }
};

