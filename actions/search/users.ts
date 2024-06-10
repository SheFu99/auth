'use server'
import { db } from "@/lib/db"
import { ExtendedUser } from "@/next-auth"

type UserListPromise = {
    success?:boolean,
    error?:string,
    postResult?:ExtendedUser[]
}

type getUserListParams = {
    name:string,
    pageParams:number,
}

export const getUserListByName = async ({name,pageParams}:getUserListParams):Promise<UserListPromise>=>{
    if(!name){ 
        return {error:'Has no params!'}
    }
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
                mode:'insensitive'
            }
        },
        take:pageSize,
        skip:skip
    });


    return {postResult:userList,success:true}
} catch (error) {
    return {error:error}
}
    


}