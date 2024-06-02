import NextAuth, {type DefaultSession} from "next-auth"
import {JWT} from '@auth/core/jwt'
import { UserRole } from "@prisma/client"
export type ExtendedUser = DefaultSession['user'] & {
    role?:UserRole;
    isTwoFactorEnabled?: boolean;
    isOAuth?: boolean;
    
}

declare module "next-auth"{
  interface Session {
    user: ExtendedUser
  }
  
  declare module "next-auth/jwt" {
    interface JWT {
      role?: UserRole;
      isTwoFactorEnabled?: boolean;
      isOAuth?: boolean;
      
    }
  }
}

///here is we will define a coustom type inside our next/auth session 