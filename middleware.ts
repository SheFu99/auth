import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from './../routes';
import authConfig from "./auth.config"
import NextAuth from "next-auth"

const {auth} =NextAuth(authConfig)

export default auth((req) => {
const {nextUrl}=req;
const isLoggedIn = !!req.auth;
const url = req.nextUrl;
// const errorRedirect = nextUrl.pathname.includes('?error=')
const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
const isAuthRoute = authRoutes.includes(nextUrl.pathname);


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
  if(isLoggedIn){
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
  }
  return null
}
if(!isLoggedIn&& !isPublicRoute){
  return Response.redirect(new URL("/auth/login",nextUrl))
}
return null
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}