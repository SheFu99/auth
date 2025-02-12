// utils/auth.ts (Create a separate utils file for better organization)
import { db } from '@/lib/db'
import { ExtendedUser } from '@/next-auth'
import { JWT } from 'next-auth/jwt'

interface RefreshedToken extends JWT {
    accessToken?: string
    accessTokenExpires?: number
    refreshToken?: string
    error?: string
    provider?: string
  }
export async function refreshAccessToken({token,user}:{token:RefreshedToken,user:ExtendedUser}): Promise<RefreshedToken> {

  // console.log("token_refreshAccessToken",token,token.accessToken)
  const provider = token.provider as string
  
  if (!provider) {
    console.error('No provider found in token.')
    return { ...token, error: 'NoProviderError' }
  }
  console.log('RefreshTokenProvider:',provider)
  console.log('Token in cooke:',token)

  let tokenEndpoint = ''
  let body: any = {}
  
  switch (provider) {
    case 'google':
      tokenEndpoint = 'https://oauth2.googleapis.com/token'
      body = {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      }
     
      break
      
    case 'github':
      // tokenEndpoint = 'https://github.com/login/oauth/access_token'
      // body = {
      //   client_id: process.env.GITHUB_ID,
      //   client_secret: process.env.GITHUB_SECRET,
      //   grant_type: 'refresh_token',
      //   refresh_token: token.refreshToken,
      // } 
      console.log('RefreshAccessTokenError')

      return {error:'RefreshAccessTokenError'}

      
    //   case 'microsoft':
    //     tokenEndpoint = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
    //     body = {
    //       client_id: process.env.MICROSOFT_CLIENT_ID!,
    //       client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
    //       grant_type: 'refresh_token',
    //       refresh_token: token.refreshToken,
    //       scope: 'user.read offline_access', // Adjust scopes as needed
    //     }
    //     break

    // case 'linkedin':
    //     tokenEndpoint = 'https://www.linkedin.com/oauth/v2/accessToken'
    //     body = {
    //       grant_type: 'refresh_token', // Verify if LinkedIn supports this grant type
    //       refresh_token: token.refreshToken,
    //       client_id: process.env.LINKEDIN_CLIENT_ID!,
    //       client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
    //     }
    //     break
      
    
    default:
      console.error(`Unsupported provider: ${provider}`)
      return { ...token, error: 'UnsupportedProviderError' }
  }
  
  try {
    // console.log('ReqBody:',JSON.stringify(body))

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Some providers require specific headers, adjust as needed
        'Accept': 'application/json', // For GitHub and others to get JSON response
      },
      body: JSON.stringify(body),
    })
    
    const refreshedTokens = await response.json()
    
    console.log('refreshedTokens',Date.now() + refreshedTokens.expires_in +(1000*60*15))
    if (!response.ok) {
      console.error('Failed to refresh access token:', refreshedTokens)
      return { ...token, error: 'RefreshAccessTokenError' }
    }
    try {
      const update = await db.account.update({
        where: {
          userId_access_token: {
            userId: token.sub,
            access_token: token.accessToken as string
          }
        }
  ,      
          data:{
            expires_at:token.accessTokenExpires,
            access_token:refreshedTokens.accessToken,
            refresh_token:token.refreshToken
        },
      })
  console.log('update',update)
  
    } catch (error) {
  console.log('update',error)
      
    }
// TEST_CASE:test when user is not exist 
    const refreshTokenSecurity  = !!await db.user.findFirst({
      where:{
        id:token.sub
    },
    select: { id: true },
  })
  console.log('refreshTokenSecurity',refreshTokenSecurity)
  
  // // ADD: Cache layer for repeted request or find method to determinate it 
  // if(refreshTokenSecurity==false){
  //   return {error:'You can`t use this token!'}
  // }


    
// const existing = await prisma.account.findUnique({
//   where: {
//     userId_access_token: {
//       userId: token.sub,
//       access_token: token.accessToken,
//     },
//   },
// })

//       console.log('response_query',token.sub)
//       console.log('response_update',token.accessToken)
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + (1000*60*15),
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Some providers may not return a new refresh token
      error: undefined,
    }
    
  } catch (error) {
    console.error('Error refreshing access token:', error)
    return { ...token, error: 'RefreshAccessTokenError' }
  }
}
