import { RateLimiterMemory } from "rate-limiter-flexible";
import { adminRoutes, apiAuthPrefix, authRoutes, publicRoutes } from "./routes";
import { currentRole, currentUser } from "./lib/auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { Router } from "next/router";

// Rate limiter configuration
// const rateLimiter = new RateLimiterMemory({
//   points: 5, // 5 requests
//   duration: 1, // per 1 second
// });

// const debouncedPaths = ["/api/auth/session"];

export async function middleware(req) {
  // const ipAddr = req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";
  // console.log("Middleware is running");
  // console.log("Runtime Environment:", process.env);
  // console.log("Process Version:", process.version);
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  console.log("Request Path:", path); // Debugging output

  // // Apply rate limiter to specific paths
  // if (debouncedPaths.includes(path)) {
  //   try {
  //     await rateLimiter.consume(ipAddr);
  //   } catch (rateLimiterRes) {
  //     return new Response("Too Many Requests", { status: 429 });
  //   }
  // }

  // Fetch the JWT token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET});
  console.log('token_in_middleware:',token )
  // const userRole = fetch()
  // const userRole = currentRole()
  const userRole = token?.role
  const isLoggedIn = token;
  // console.log(isLoggedIn,'isLoggedIn',token)
  // console.log("Cookies:", req.cookies);

  // const isLoggedIn = !!token;
  // const userRole = token?.role || (await currentRole()); // Assuming `currentRole` fetches the role if not in token.

  const isProfileRoute = path.startsWith("/profile");
  const isPostRoute = path.startsWith("/post/");
  const isApiAuthRoute = path.startsWith(apiAuthPrefix);
  // console.log("ISAPIAUTH",isApiAuthRoute)
  const isPublicRoute = publicRoutes.includes(path);
  // console.log('isLoggedIn',isPublicRoute)
  const isAuthRoute = authRoutes.includes(path);
  const isAdminRoute = adminRoutes.includes(path);
  console.log('isAuthRoute',isAuthRoute)
  // Allow profile and post routes without additional checks
  if (isProfileRoute || isPostRoute) {
    return NextResponse.next();
  }

  // Handle custom error for OAuthAccountNotLinked
  if (nextUrl.pathname.startsWith("/auth/login")) {
    if (nextUrl.searchParams.get("error") === "OAuthAccountNotLinked") {
      return NextResponse.redirect(
        new URL("/auth/login?error=OAuthAccountNotLinked", nextUrl)
      );
    }
  }

  // Block unauthorized API auth routes
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Handle authenticated routes
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(`/settings/profile`, nextUrl));
    }
    return NextResponse.next();
  }
console.log('userRole',userRole)
  // Handle non-public routes for unauthenticated users
  if (!isLoggedIn && !isPublicRoute) {
    console.log("NotPublicRoute");
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );

  }

  // Block non-admin users from admin routes
  if (userRole !== "ADMIN" && isAdminRoute) {
    return NextResponse.redirect(new URL("/settings", nextUrl));
  }

  return NextResponse.next();
}

// Config for matching routes
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
