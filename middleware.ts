import { RateLimiterMemory } from 'rate-limiter-flexible';
import {adminRoutes, apiAuthPrefix, authRoutes, publicRoutes } from './routes';
import authConfig from "./auth.config"
import NextAuth from "next-auth"
import { currentRole } from './lib/auth';
import { NextRequest, NextResponse } from 'next/server';


const {auth} =NextAuth(authConfig)
const debouncedPaths = ['/api/auth/session'];

const rateLimiter = new RateLimiterMemory({
  points: 5, // 10 requests
  duration: 1, // per 1 second by IP
});


export default auth(async (req) => {
  // console.log(req)
  const ipAddr = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';
  if (debouncedPaths.includes(req.nextUrl.pathname)) {
    try {
        await rateLimiter.consume(ipAddr);
    } catch (rateLimiterRes) {
        // Rate limiter response if too many requests
        return new Response('Too Many Requests', { status: 429 });
    }
}
const userRole = await currentRole()           
const {nextUrl}=req;
const isLoggedIn = !!req.auth;
const url = req.nextUrl;
// const errorRedirect = nextUrl.pathname.includes('?error=')
const path = nextUrl.pathname;

  console.log("Request Path:", path);  // Debugging output
  const isProfileRoute = path.startsWith('/profile');
  const isApiPostRoute = path.startsWith('/api/posts/');
  const isApiAuthRoute = path.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(path);
  const isAuthRoute = authRoutes.includes(path);
  const isAdminRoute = adminRoutes.includes(path);

  if (isProfileRoute) {
    
    return NextResponse.next();  // Allow API posts route
  }


///cosutom error handler 
if (url.pathname.startsWith('/auth/login')) {
  if (url.searchParams.get('error') === 'OAuthAccountNotLinked') {
      return null;
  }
}
if (url.searchParams.get('error') === 'OAuthAccountNotLinked') {
 return Response.redirect(new URL('/auth/login?error=OAuthAccountNotLinked', nextUrl));
}
///cosutom error handler  

if(isApiAuthRoute){
  return null
}

if (isAuthRoute){
  if(isLoggedIn ){
    let callbackUrl = nextUrl.pathname
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)
    return Response.redirect(new URL(
    `/settings/profile`,
    nextUrl))
  }

  return null
}
if(!isLoggedIn&& !isPublicRoute){
  let callbackUrl = nextUrl.pathname
  if(nextUrl.search){
    callbackUrl +=nextUrl.search
  }
  const encodedCallbackUrl = encodeURIComponent(callbackUrl)
  return Response.redirect(new URL(
  `/auth/login?callbackUrl=${encodedCallbackUrl}`,
  nextUrl
))
}
if(userRole !=="ADMIN" && isAdminRoute) {
  return Response.redirect(new URL('/settings',nextUrl))
}


return null
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
  // matcher: ["/settings", "/api"],

}