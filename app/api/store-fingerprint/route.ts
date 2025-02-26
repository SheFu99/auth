// app/api/store-fingerprint/route.ts
import { authConfig } from '@/auth.config'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    // req.json() is how you parse JSON in the App Router
    const { fingerprint } = await req.json()
    const currentSession = await getServerSession(authConfig)
 if (!currentSession){
  return NextResponse.json({status:404})
 }
    const existing = await db.session.findFirst({
      where: {
        userId: currentSession.user.id
        // maybe also check if the session is still active
      }
    })
    
    if (!existing) {
      try {
        await db.session.create({
          data: {
            userId: currentSession.user.id,
            fingerprint:fingerprint,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
      } catch (error) {
        return NextResponse.json({ error:error}, { status: 500 })
      }
    } else {
      try {
        await db.session.update({
          where: { id: existing.id },
          data: { fingerprint:fingerprint, updatedAt: new Date() }
        })
      } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
      }
     
    }
    

    // Create a response
    const response = NextResponse.json({ success: true })

    // Set the cookie on the response
    response.cookies.set('fp', fingerprint, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
