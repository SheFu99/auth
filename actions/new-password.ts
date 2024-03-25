"use server"
import * as z from "zod"
import { NewPasswordSchema } from "@/schemas"
import { getPasswordResetTokenByToken } from "@/data/paswordResetToken"
import { getUserByEmail } from "@/data/user"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

export const NewPassword = async (
    values: z.infer<typeof NewPasswordSchema>,
    token?:string| null,
)=>{
        if(!token){
            return {error:"Missing token!"}
        }

    const validatedField =NewPasswordSchema.safeParse(values);

        if(!validatedField.success){
            return {error:"invalid fields!"}
        }

    const {password} = validatedField.data;

    const existingToken = await getPasswordResetTokenByToken(token);

    if(!existingToken){
        return {error: "Invalid token!"}
    }  
    const hasExpired = new Date(existingToken.expires)<new Date()
    if(hasExpired){
        return {error: "Token has expired!"}
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if(!existingUser){
        return{
            error:"Email does not exist!"
        }
    }

    const hashedPassword = await bcrypt.hash (password, 9)

    await db.user.update({
        where: {id: existingUser.id},
        data :{ password: hashedPassword},
    });

    await db.passwordResetToken.delete({
        where: {id:existingToken.id}
    })

    return{ success: "Password updated"}
}