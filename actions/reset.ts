"use server"
import * as z from "zod"

import { ResetSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user";
import { sendPasswordResendEmail } from "@/data/mail";
import  {generatePasswordResetToken} from "@/data/tokens";

export const reset = async (values: z.infer<typeof ResetSchema>)=>{
    const validatedFields = ResetSchema.safeParse(values);

    if(!validatedFields.success){
        return {error: "Invalid Email!"}
    }
    const {email} = validatedFields.data
    
    const existingUser = await getUserByEmail(email)

    if(!existingUser){
        return {error:"Email not found!"}
    }

    const passwordResetToken = await
    generatePasswordResetToken(email);
    await sendPasswordResendEmail(
        passwordResetToken.email,
        passwordResetToken.token,
    )

    return {success: 'Resend email send'}
}

