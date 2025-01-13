// utils/auth.ts (Create a separate utils file for better organization)
import { db } from '@/lib/db'
import { JWT } from 'next-auth/jwt'

interface RefreshedToken extends JWT {
    accessToken?: string
    accessTokenExpires?: number
    refreshToken?: string
    error?: string
    provider?: string
  }
export async function refreshAccessToken(token: JWT): Promise<RefreshedToken> {

  console.log("token_refreshAccessToken",token)
  const provider = token.provider as string
  
  if (!provider) {
    console.error('No provider found in token.')
    return { ...token, error: 'NoProviderError' }
  }
  console.log('RefreshTokenProvider:',provider)
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
    
    
    if (!response.ok) {
      console.error('Failed to refresh access token:', refreshedTokens)
      return { ...token, error: 'RefreshAccessTokenError' }
    }
    const update = await db.account.update({
      where:{
        access_token:refreshedTokens.accessToken
      },
      data:{expires_at:refreshedTokens.exp}
    })
      console.log('response_update',update)
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: refreshedTokens.expires_in
        ? Math.floor(Date.now() / 1000) + refreshedTokens.expires_in
        : (token.accessTokenExpires as number),
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Some providers may not return a new refresh token
      error: undefined,
    }
    
  } catch (error) {
    console.error('Error refreshing access token:', error)
    return { ...token, error: 'RefreshAccessTokenError' }
  }
}
