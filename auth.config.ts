import { signOut } from 'next-auth/react';
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
import { JWT } from "next-auth/jwt";
import { refreshAccessToken } from "./util/refreshToken";

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
      authorization: {
        params: {
          access_type: 'offline', // Important for obtaining refresh tokens
          prompt: 'consent', // Forces refresh token issuance
        }
      }
    }),

    // GitHub Provider
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      authorization: {
        params: {
          scope: 'read:user user:email',
        },
      },
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
jwt:{
  secret: process.env.NEXTAUTH_SECRET,
  // encryption: true, // Enable encryption for added security
  // encryptionKey: process.env.NEXTAUTH_ENCRYPTION_KEY, // Must be 32 characters for AES-256
  // signingKey: process.env.NEXTAUTH_SIGNING_KEY, // Optional: specify a separate signing key
    maxAge: 30 * 24 * 60 * 60, // 30 days 
},
  // Callback Functions
  callbacks: {
    async jwt({ token, user,account  }) {
      if (user && account) {
        // Include user ID in the token
        token.provider = account.provider
        token.id = user.id;
        token.email = user.email;
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.accessTokenExpires = account.expires_at 
        // console.log("User in JWT Callback:", account);
        console.log('TokenExpires:',token.accessTokenExpires )
      }
      const BUFFER_TIME = 30000;
      if (Date.now() > ((token.accessTokenExpires as number) * 1000)- BUFFER_TIME) {
        ///TODO: if provider is credentials, send verfification email 
        console.log("Refreshing_token_inProgress",Date.now())
     
        return refreshAccessToken(token)

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
events:{
  async signOut({ token }) {
    try {
        if (token) {
            console.log("Signing out and revoking token:", token.accessToken);

            // Example: Revoke access token via provider API
            await fetch("http://localhost:3000/api/tokens/revoke", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: token.accessToken }),
            });
        }
    } catch (error) {
        console.error("Error during sign-out:", error);
    }
},
}
};
