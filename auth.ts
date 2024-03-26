import NextAuth  from "next-auth"
import { UserRole } from "@prisma/client"
import {PrismaAdapter} from '@auth/prisma-adapter'
import { db } from "./lib/db"
import authConfig from "./auth.config"
import { getUserById } from "./data/user"
import { getTwoFactorConformationByUserId } from "./data/two-factor-conformation"



export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  pages:{
    signIn: "/login",
    error:  "/error",
  },
  events:{
    async linkAccount({user}){
      await db.user.update({
        where:{id:user.id},
        data: {emailVerified: new Date()}
      })
    }
  },
  callbacks:{
    async signIn({user ,account}){
      console.log({
        user,
        account,
      })
      if(account?.provider === "credentials")  {
        const userId: string = user.id!
          if (userId === undefined){
            throw new Error('User ID is not defined')
          }

        const existingUser = await getUserById(userId)
        if(!existingUser?.emailVerified) {
          const error = new Error ('Email address is not verified.')
          throw error
        }

        if (existingUser.isTwoFactorEnabled){
          const twoFactorConfirmation = await getTwoFactorConformationByUserId(existingUser.id);

          if (!twoFactorConfirmation) return false;
        }

        
    }
    return true;
    },

    async session({token , session}) {
        if(token.sub&&session.user){
          session.user.id = token.sub
        }

        if(token.role && session.user){
          session.user.role= token.role as UserRole
        }

        if(session.user){
          session.user.isTwoFactorEnabled= token.isTwoFactorEnabled as boolean
        }
     return session;
    },
    async  jwt({token}){
      if(!token.sub) return token

      const existingUser = await getUserById(token.sub);

      if(!existingUser) return token;

      token.role = existingUser.role
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled
       return token
     } ,
    },

  
  adapter: PrismaAdapter(db),
  session:{strategy:"jwt"},
  ...authConfig,
})