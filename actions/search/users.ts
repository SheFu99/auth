'use server'
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { ExtendedUser } from "@/next-auth"
// import { checkRateLimit } from '../tools/rateLimiting';

export type UserListPromise = {
    success?: boolean,
    error?: string,
    searchResult?: ExtendedUser[]
};

export type GetUserListParams = {
    name: string,
    pageParams: number,
};



export const getUserListByName = async ({ name, pageParams }: GetUserListParams): Promise<UserListPromise> => {
    console.log('getUserListByName')
   
    if (!name) {
        return { error: 'Name parameter is required.' };
    }

    const user = await currentUser();
    if (!user) {
        return { error: 'User not found.' };
    }

    const page = pageParams || 1;
    const pageSize = 5;
    const skip = (page - 1) * pageSize;

    try {
        const userList = await db.user.findMany({
            where: {
                name: {
                    contains: name,
                    mode: 'insensitive',
                    not: {
                        contains: user.name, // Assuming you want to exclude current user's name
                    }
                },
            },
            take: pageSize,
            skip: skip,
            select:{
                id:true,
                image:true,
                role:true,
                name:true,
                shortName:true
            },

        });

        return { searchResult: userList, success: true };
    } catch (error) {
        console.error('Error fetching user list: ', error);
        return { error: 'Failed to fetch user list.' };
    }
};

export const getUserListByShortName = async ({shortName,pageParams}:{shortName:string,pageParams:number}):Promise<UserListPromise>=>{
    // const isOk = await checkRateLimit({tokens:15,duration:'120s'})
    // console.log('isOk',isOk)

    // if(!isOk){
    //     console.error('RateLimit is Reached!')
    //     return {error:'RateLimit!'}
    // }
    console.log('GetUserListwithShortName',shortName)
    if(!shortName){ 
        return {error:'Params require!'}
    }

    const user = await currentUser()

    let page:number = pageParams
    if(!page){
         page = 1
    }
const pageSize = 5
const skip = (page-1)*pageSize
try {

    const userList = await db.user.findMany({
        where:{
            shortName:{
                contains:shortName,
                mode:'insensitive',
                not: {
                    contains: user.shortName,
                }
            },
            // shortName: {
            //     not: {
            //         in: ["", null]  
            //     }
            // }
            
        },
        select:{
            id:true,
            image:true,
            role:true,
            name:true,
            shortName:true
        },
        take:pageSize,
        skip:skip,
       
    });

    // const filteredUserList = userList.filter(userObj=> userObj.id !==user.id)

    return {searchResult:userList,success:true}
} catch (error) {
    return {error:error}
}
    


};
