'use server'
import { redis } from './../../lib/upstash';
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { ExtendedUser } from "@/next-auth"
import {Ratelimit} from '@upstash/ratelimit'
import { headers } from 'next/headers';


type UserListPromise = {
    success?:boolean,
    error?:string,
    postResult?:ExtendedUser[]
};
type getUserListParams = {
    name:string,
    pageParams:number,
};

const rateLimit = new Ratelimit ({
    redis,
    limiter:Ratelimit.slidingWindow(5,'120s')
});


export const getUserListByName = async ({name,pageParams}:getUserListParams):Promise<UserListPromise>=>{
    const ip = headers().get('x-forwarded-for');
    const {remaining,limit,success:limitReached} = await rateLimit.limit(ip!)   
    console.error('Limit',remaining)
    
    if(!limitReached) {
        console.error('Limit',limitReached)
        return {error:'Please wait 1 minute to continue search '}
    }
    if(!name){ 
        return {error:'Params require!'}
    }
    const user = await currentUser()


    let page:number = pageParams
    if(!page){
         page = 1
    }
  
const pageSize = 10
const skip = (page-1)*pageSize
try {

    const userList = await db.user.findMany({
        where:{
            name:{
                contains:name,
                mode:'insensitive',
                not: {
                    contains: user.name,
                }
            },
            
        },
        take:pageSize,
        skip:skip,
        select:{
            id:true,
            name:true,
            email:true,
            image:true,
            role:true
        }
    });

    const filteredUserList = userList.filter(userObj=> userObj.id !==user.id)

    return {postResult:userList,success:true}
} catch (error) {
    return {error:error}
}
    


}

