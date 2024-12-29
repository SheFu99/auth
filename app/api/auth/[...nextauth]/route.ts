import { authConfig } from "@/auth.config";
import NextAuth from "next-auth";


export const POST = NextAuth(authConfig);
export const GET = NextAuth(authConfig);