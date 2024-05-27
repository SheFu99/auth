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
   
    if(!user ){
        return {error:"User dosent exists"}
    }
        try {
            await db.user.update({
                where:{ 
                    email: user?.email!
                },
                data:{
                    image:image
                },
            })

            await db.profile.update({
                where:{
                    userId:user.id
                },
                data:{
                    image:image
                }
                
            })
            console.log('QUERY_EXECUTEd')
            return {success:"Image was changed!"}
        } catch (error) {
            return {error:error}
        }
        
}



