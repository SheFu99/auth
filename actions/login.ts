"use server"
import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import * as z from "zod"
import { DEFAULT_LOGIN_REDIRECT } from "../../routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import generateVerificationToken from "@/data/tokens";
import { sendVerificationEmail } from "@/data/mail";


export const login = async (values:z.infer<typeof LoginSchema>)=>{
   const validatedField = LoginSchema.safeParse(values);

   if(!validatedField.success){
      throw new Error("Invalid fields")
   }
    
   const{email, password}=validatedField.data

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

      
   try{
      await signIn("credentials",{
         email,
         password,
         redirectTo: DEFAULT_LOGIN_REDIRECT
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