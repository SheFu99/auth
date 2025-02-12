'use server'
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { ExtendedUser } from "@/next-auth"
// import { checkRateLimit } from '../tools/rateLimiting';

export type UserListPromise = {
    success?: boolean,
    error?: string,
    searchResult?: ExtendedUser[],
    matchCount?:number,
    nextCursor?:string,
    hasNextPage?:boolean
};

export type GetUserListParams = {
    name: string,
    cursor:string,
    pageSize: number,
};



export const getUserListByName = async ({ name, cursor, pageSize = 5 }: GetUserListParams): Promise<UserListPromise> => {
    console.log('getuserListByName_with_params:',name, cursor)
    if (!name) {
        return { error: 'Name parameter is required.' };
    }
    
    const user = await currentUser();
    if (!user) {
        return { error: 'You need to be authorized to search users.' };
    }
    // console.log('getUserListByName','Server_query',name);
    
    const queryBody = {
        where: {
            OR: [
                {
                    firstName: {
                        contains: name,
                        mode: 'insensitive',
                        not: {
                            contains: user.name,
                        }
                    }
                },
                {
                    shortName: {
                        contains: name,
                        mode: 'insensitive',
                        not: {
                            contains: user?.shortName,
                        }
                    }
                }
            ]
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: pageSize + 1, // Fetch one extra to check for next page
        skip: cursor ? 1 : 0, // Skip the cursor if provided
        ...(cursor ? { cursor: { id: cursor } } : {}),
        select: {
            userId: true,
            image: true,
            firstName: true,
            shortName: true
        }
    } as any;

    try {
        const userList = await db.profile.findMany(queryBody);
        console.log('getUserListByName',userList);

        const hasNextPage = userList.length > pageSize;
        const result = hasNextPage ? userList.slice(0, -1) : userList;
        const nextCursor = hasNextPage ? result[result.length - 1].id : null;

        let matchCount: number | undefined = undefined;
        if (!cursor) {
            matchCount = await db.profile.count({
                where: queryBody.where
            });
        }

        return {
            searchResult: result,
            success: true,
            nextCursor,
            hasNextPage,
            matchCount
        };
    } catch (error) {
        console.log('Error fetching user list:', {
            message: error?.message || 'Unknown error',
            stack: error?.stack || 'No stack trace',
        });
        return { error: error };
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
