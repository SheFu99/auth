"use server";
import bcrypt from "bcryptjs"
import * as z from "zod"

import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";

export const register = async (data: z.infer<typeof RegisterSchema>) => {
  
    const validatedFields = RegisterSchema.safeParse(data);
    if (!validatedFields.success) {
        return {
            error: validatedFields.error.toString()
        }}
        console.log("written data in db"); // Check to see if `user` is a property of `db`

        const {email, password, name}= validatedFields.data
        const hashedPassword = await bcrypt.hash(password, 10);
            const existingUser = await getUserByEmail(email)
    
        if(existingUser){
            return {error: "User already exists"}
        }
        
     try{
        await db.user.create({
            data:{
                name,
                email,
                password: hashedPassword,
                
            }
        });
     } catch(error) {
       
        console.error("Registration error:", error);
        return { error: "An unexpected error occurred" };
    }
        
    
   
    //TODO: Send verification token email!
    // {
    //     return {error: "User already exists"}
    // }

    
    return {success: "Email send"}
};