"use server"
import * as z from "zod"; 
import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "../routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import generateVerificationToken from "@/lib/tokens"
import { generateTwoFactorToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { sendTwoFactorTokenEmail} from "@/lib/mail";
import { db } from "@/lib/db";
import { getTwoFactorConformationByUserId } from "@/data/two-factor-conformation";

export const login = async (
   values:z.infer<typeof LoginSchema>,
   callbackUrl?:string| null,   
)=>{
   const validatedField = LoginSchema.safeParse(values);

   if(!validatedField.success){
      throw new Error("Invalid fields")
   }
    
   const{email, password , code}=validatedField.data

   const existingUser = await getUserByEmail(email)

   if(!existingUser ||!existingUser.email || !existingUser.password) {
         return {error: 'Email or password  does not exist! '};
         }
   

      if(!existingUser.emailVerified){
         const verificationToken = await generateVerificationToken(
            existingUser.email
         )
         await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
         )
         return {success: "Conformation email sent!"}
      }

if (existingUser.isTwoFactorEnabled && existingUser.email){
   if(code){
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if(!twoFactorToken){
         return {error:"Invalid code"}
      }

      if(twoFactorToken.token!== code){
         return{error: "Invalid code"}
      }

      const hasExpired = new Date(twoFactorToken.expires)< new Date();
      if (hasExpired){
         return {error: "Code expired!"}

      }

      await db.twoFactorToken.delete({
         where:{id: twoFactorToken.id}
      })

      const existingConfirmation = await getTwoFactorConformationByUserId(existingUser.id)

      if(existingConfirmation){
         await db.twoFactorConformation.delete({
            where: {id:existingConfirmation.id}
         })
      }

      await db.twoFactorConformation.create({
         data:{
            userId:existingUser.id
         }
      })
   }else{
      const twoFactorToken = await generateTwoFactorToken(existingUser.email)
      await sendTwoFactorTokenEmail(
         twoFactorToken.email,
         twoFactorToken.token
      )
      return{twoFactor: true}
   }
  
}
   try{
      await signIn("credentials",{
         email,
         password,
         redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
   })
   }catch(error){
      if(error instanceof AuthError){
         switch(error.type){
            case "CredentialsSignin" :
               return {error:"Invalid credentials"}
      }
   }
   
   throw error

}
}