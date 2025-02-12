

"use server"
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

 const baseURL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000/'
// 'http://localhost:3000/api/users?name=cheif searchExample


export async function GET(req: Request): Promise<Response>{
    const requset = req.url
    const url = new URL (requset,baseURL)
    const searchParams = url.searchParams.get('name')
    console.log(requset,searchParams)
    // const isLimitReached = await checkRateLimit()
    // if(isLimitReached){
    //   console.log('limit is reached')
    //   return NextResponse.json({error:'limit is reachd'})
    // }
    try {

        if(req){
            return NextResponse.json({ succes: searchParams || req})
        }
      } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error }, { status: 400 });

      }
}

export async function POST(req: Request): Promise<Response> {
  return NextResponse.json({ message: "POST request to /users", data: req.body },{status:400});
}
