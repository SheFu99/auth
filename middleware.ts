import { DEFAULT_LOGIN_REDIRECT, adminRoutes, apiAuthPrefix, authRoutes, publicRoutes } from './../routes';
import authConfig from "./auth.config"
import NextAuth from "next-auth"
import { currentRole } from './lib/auth';


const {auth} =NextAuth(authConfig)

export default auth(async (req) => {
  const userRole = await currentRole()           
  const {nextUrl}=req;
const isLoggedIn = !!req.auth;
const url = req.nextUrl;
// const errorRedirect = nextUrl.pathname.includes('?error=')
const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
const isAuthRoute = authRoutes.includes(nextUrl.pathname);
const isAdminRoute = adminRoutes.includes(nextUrl.pathname)

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
if(userRole !=="ADMIN" && isAdminRoute) {
  return Response.redirect(new URL('/settings',nextUrl))
}


return null
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}