"use server"
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { UserInfoSchema } from '@/schemas';
import * as z from "zod"


export const updateImage = async ({image}:z.infer<typeof UserInfoSchema>)=>{
    if (!image){
        return {error: "Image required!"}
    }
   const user= await currentUser()
   
   const existedUser = await db.user.findFirst({
    where:{
        email:user?.email
    }
   })
    if(user || existedUser){

        const selectedUser = await db.user.update({
            where:{ 
                email: user?.email!
            },
            data:{
                image:image
            },
        })
        return {success:"Image has changed!"}
        }
return {error:"User dosent exists"}
}

