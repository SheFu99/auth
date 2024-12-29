import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { getUserByEmail } from "./data/user";
import { LoginSchema } from "./schemas";
import { db } from "./lib/db";
import { NextAuthOptions } from "next-auth";
import { UserRole } from "@prisma/client";

export const authConfig: NextAuthOptions = {
  // debug: true,
  // Secret for signing/encrypting tokens
  secret: process.env.NEXTAUTH_SECRET || "your-fallback-secret",

  // Authentication Providers
  providers: [
    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    // GitHub Provider
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),

    // Credentials Provider (custom authentication)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate credentials format
        const validatedFields = LoginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          console.error("Invalid credentials:", validatedFields.error);
          return null;
        }

        const { email, password } = validatedFields.data;
        const user = await getUserByEmail(email);

        if (!user || !user.password) {
          console.warn("User not found or missing password.");
          return null;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          console.warn("Password mismatch for user:", email);
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  // Database Adapter
  adapter: PrismaAdapter(db),

  // Session Configuration
  session: {
    strategy: "jwt", // Use JWT for session tokens
  },

  // Callback Functions
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Include user ID in the token
        token.id = user.id;
        token.email = user.email;
        console.log("User in JWT Callback:", user);
      }
      const userInDb = await db.user.findUnique({
        where:{
          id: token.sub
        },
        select:{
          shortName:true,
          role:true
        }
      })
      token.role = userInDb.role
      token.shortName = userInDb.shortName as string
      return token;
    },

    async session({ session, token }) {
      // Include user ID in the session
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.role = token.role as UserRole || null;;
      session.user.shortName  = token.shortName as string || null;
      return session;
    },
  },

  // Custom Pages
  pages: {
    signIn: "/auth/login", // Custom login page
    error: "/auth/error",  // Custom error page
  },

  // Enable Debugging for Development

};
