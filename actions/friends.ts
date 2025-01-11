"use server"
import {  FriendsOffer, friendshipStatus } from "@/components/types/globalTs"
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"



export const sendFriendShipOffer = async (userId:string)=> {
    const user = await currentUser()
    if(!userId||!user){
        return {error:'Unacceptable behavior!'}
    }

    try {
        const recepient = await db.user.findFirst({
            where:{id:userId}
        })

        if(!recepient){
            return {error:'Recipient is not found'}
        }
        if(userId == user.id){
            return {error:'You can`t do that! =('}
        }
        const requester = await db.friendShip.findFirst({
            where:{
                AND:[
                    {requesterId:user.id},
                    {adresseedId:userId},
                ]
            }
        });
        const adresser = await db.friendShip.findFirst({
            where:{
                AND:[
                    { adresseedId:user.id},
                    { requesterId:userId}
                ]
            }
        }) ;
        const notFound = adresser ===null && requester ===null
   
        if(notFound){
            await db.friendShip.create({
                data:{
                    requesterId:user.id,
                    adresseedId:userId,
                }
            })
            return {success:true,message:'Your request has been successfully send!'}
          }
        if(adresser?.status ==='PENDING' ){
            await db.friendShip.update({
                where:{
                    transactionId:adresser.transactionId
                },
                data:{
                    status:'ACCEPTED'
                }
            })
        console.log('UPDATE_ACCEPTED')

            return {success:true , messsage:'You successfully apply this offer'}
        };
        if(adresser?.status === 'DECLINED'){
            await db.friendShip.update({
                where:{transactionId:adresser.transactionId},
                data:{
                    status:'PENDING'
                }
            });
        }
        if(requester?.status === 'DECLINED'){
            await db.friendShip.update({
                where:{transactionId:requester.transactionId},
                data:{
                    status:'PENDING'
                }
            })
        console.log('UPDATE_PENDING')

            return {success:true , message:'Your successfully resend offer'}
        }
    
        
    } catch (error) {
        return{error:error}
    }
};
export const deletePendingOffer = async (userId:string)=>{
    const user = await currentUser()
    if(!user||!userId){
        return {error:'Unacceptable behavior!'}
    }
    try {
        await db.friendShip.delete({
            where:{
                requesterId_adresseedId:{
                    requesterId:user.id,
                    adresseedId:userId
                },    
            }
        })
        return {success:true}
    } catch (error) {
        return {error:error}
    }
   
};
export const deleteFriend = async (userId:string)=>{
    const user = await currentUser()
    if(!user||!userId){
        return {error:'Unacceptable behavior!'}
    };
    const existingTransaction = await db.friendShip.findFirst({
        where:{
            OR:[
                {AND:[
                        {requesterId:user.id},
                        {adresseedId:userId}
                ]},
                {AND:[
                    {requesterId:userId},
                    {adresseedId:user.id}
                ]}
            ]
        }
    })
    if(!existingTransaction){
        return {error:'Relation is not found!'}
    }
    try {
        await db.friendShip.delete({
            where:{transactionId:existingTransaction.transactionId},
        });
        return {succes:true}
    } catch (error) {
        return {error:error}
    }
  
};
export type changeStatusParams = {
    transactionId:string,
    status:friendshipStatus,
}
export const changeFriendOfferStatus = async ({transactionId,status}:changeStatusParams)=>{
    const user = await currentUser()
    if(!user){
        return {error:'You need to be athorize!'}
    };
    const existingTransaction = await db.friendShip.findFirst({
        where:{transactionId:transactionId}
    })
    if(user.id !== existingTransaction.requesterId && user.id !== existingTransaction.adresseedId){
        return {error:'You can`t change status of unAuthorized transaction!'}
    }
    try {
        await db.friendShip.update({
            where:{
                transactionId:transactionId
            },
            data:{
                status:status
            }
        });
        return {success:true,message:`You are, ${status} offer!`}
    } catch (error) {
        return {error:error}
    }
};


type getOfferProps ={
    currentOfferList?:FriendsOffer[],
    error?:string,
    success?:boolean
};
export const getCurrentUserOffer = async ():Promise<getOfferProps>=>{
    // console.log('getCurrentOfferListActions')
        const user = await currentUser()
        if(!user){
            return {error: 'You need to be authorize!'}
        }
        try {
            const currentOfferList = await db.friendShip.findMany({
                where:{
                     adresseedId: user.id,
                     status:'PENDING'
                    },
                    include:{
                        requester:{
                                select:{
                                    firstName:true,
                                    image:true,
                                    userId:true,
                                }    
                            }
                    }
                })
            
            return {success:true,currentOfferList:currentOfferList}
        } catch (error) {
            return {error:error};
        }
};

export type deleteFriendParams = {
    transactionId:string,
    userId:string,
};



export type getPublicFriendsPromise ={
    profileFirendsList?:FriendsOffer[];
    totalFriendsCount?:number,
    message?:string,
    success?:boolean;
    error?:string
}

export const getProfileFriends = async ({userId,cursor}:{userId:string,cursor?:Date}):Promise<getPublicFriendsPromise>=>{
    if(!userId){
        return {error:'Profile is not found'}
    }
    // console.log('CURSOR',cursor)
    const isFirstPage:boolean = !cursor

    let totalFriendsCount :number
    if(isFirstPage){
        const {error , count} = await getCountFriends(userId)
        // console.log('CountFriends:',count   )
        if(!error){
            totalFriendsCount = count
        }
    }

    const pageSize = 2
    let pageSizeAdopted:number
    ////TODO: Need wrapper for relation search skip logic 
    try {
            const userFriendsList:FriendsOffer[] = await db.friendShip.findMany({ 
                where:{
                    AND:[
                        {requesterId:userId},
                        {status:'ACCEPTED'},
                        cursor ? { createdAt: { gt: cursor } } : {}
                    ]
                },
                take:pageSize + 1 ,
                orderBy: { createdAt: 'asc' },
                include:{
                    addressee:true,
                },
            })

            //  pageSizeAdopted = userFriendsList?.length>0 ? pageSize - userFriendsList?.length : pageSize
            // console.log("COUNT to get next side ",pageSizeAdopted)
            const userFriendsListRight = await db.friendShip.findMany({
                where:{
                    AND:[
                        {adresseedId:userId},
                        {status:'ACCEPTED'},
                        cursor ? { createdAt: { gt: cursor } } : {}
                    ]
                },
                take:pageSize + 1 ,

                orderBy: { createdAt: 'asc' },
                include:{
                    requester:true
                }
            })
    
            userFriendsList.push(...userFriendsListRight)
            
            // console.log('totalFriendsCount',userFriendsList)

        return {success:true,profileFirendsList:userFriendsList,totalFriendsCount}
    } catch (error) {
        return {error:error}
    }
};
 type getCountPromise = {
    error?:string,
    count?:number,
 }
    const getCountFriends= async (userId:string):Promise<getCountPromise> =>{
        if(!userId){
            throw new Error ('User Id is required')
        }


        try{
            const totalFriendsCount = await db.friendShip.count({
                where:{
                    OR:[
                        {AND:[
                            {adresseedId:userId},
                            {status:'ACCEPTED'}
                        ]},
                        {AND:[
                            {requesterId:userId},
                            {status:'ACCEPTED'}
                        ]}
                    ]
                   
                   
                },
            

            })
        // console.log('CountFriendsInside:',totalFriendsCount)

            if(!totalFriendsCount){
                return {count:0}
            }
    
            return {count:totalFriendsCount}
    
        }catch(err){
            return {error:err}
        }
       
    };

export type getPrivateFriendsPromise = {
    userFriendsList?:FriendsOffer[],
    totalFriendsCount?:number,
    message?:string,
    success?:boolean,
    error?:string,
};
export const getUserFreinds = async (cursor:Date):Promise<getPrivateFriendsPromise> =>{
    const user = await currentUser()
    if(!user){
        return {error:'Error!You need to be authorized!'}
    }
    const isFirstPage:boolean = !cursor

    let totalFriendsCount :number
    if(isFirstPage){
        const {error , count} = await getCountFriends(user.id)
        // console.log('CountFriends:',count   )
        if(!error){
            totalFriendsCount = count
        }
    }
    const pageSize = 3;
    try {
        const userFriendsList:FriendsOffer[] = await db.friendShip.findMany({
            where:{
                    AND:[
                        {requesterId:user.id},
                        {status:'ACCEPTED'},
                        cursor ? { createdAt: { gt: cursor } } : {}
                    ],
            },

            take:pageSize,
            include:{
                addressee:{
                    select:{
                         firstName:true,
                            image:true,
                            userId:true,
                    }
                },
            }

        });

        const userFriendsListRight = await db.friendShip.findMany({
            where:{
                AND:[
                    {adresseedId:user.id},
                    {status:'ACCEPTED'},
                    cursor ? { createdAt: { gt: cursor } } : {}
                ]
            },
            take:pageSize,
            include:{
                requester:{
                    select:{
                        firstName:true,
                            image:true,
                            userId:true,
                    }
                }
            }
        });
        userFriendsList.push(...userFriendsListRight)
        return {success:true ,userFriendsList:userFriendsList,totalFriendsCount}
    } catch (error) {
        return {error:error}
    }
};
type searchProfileFriendist = {
    cursor?:Date,
    name:string,
    profileId:string
}
type fiterfriendsPromise = {
    friendships:FriendsOffer[],
    count?:number
}
export const filterFirendsWithCursor = async ({cursor,name,profileId}:searchProfileFriendist):Promise<fiterfriendsPromise>=>{
    ///TODO: test case: create 20 users , connect with admin and check how its works with cursor pointer 
    
    const take = 10
    if(!profileId||!name){
        throw new Error ('Params is required')
    }
    let count:number
    if(!cursor){
        count = await totalSearchResult({profileId, name})
    }
    console.log('FilterFriends:',count)
    try {
        const friendships:FriendsOffer[]= await prisma.friendShip.findMany({
            where:{
                        AND:[
                        { requester: { firstName: { contains: name, mode: 'insensitive' } } },
                        {adresseedId:profileId},
                        {status:'ACCEPTED'},
                        cursor ? { createdAt: { gt: cursor } } : {}
                        ]
            },
          include:{
            requester:{
                select:{
                    firstName:true,
                        image:true,
                        userId:true,
                }
            }
          },
          take,

          orderBy: {
            createdAt: 'asc',
          },
        });

        const rightList = await db.friendShip.findMany({
            where:{
                AND:[
                    { addressee: { firstName: { contains: name, mode: 'insensitive' } } },
                    {requesterId:profileId},
                    {status:'ACCEPTED'},
                    cursor ? { createdAt: { gt: cursor } } : {}
                    ]
            },
            include:{
                addressee:{
                    select:{
                         firstName:true,
                            image:true,
                            userId:true,
                    }
                },
            },
            take,
            orderBy: {
                createdAt: 'asc',
            },
        })


        friendships.push(...rightList)
        console.log(friendships)
        if(!count){
            return {friendships,count:0}

        }

        return {friendships,count};
      } catch (error) {
        if (error.code === 'P2025') {
          // Record not found (cursor deleted)
          // Handle the scenario, e.g., by fetching without a cursor
          const friendships = await prisma.friendShip.findMany({
            include: {
              requester: true,
              addressee: true,
            },
            take,
            orderBy: {
              createdAt: 'asc',
            },
          });
    
          return {friendships};
        } else {
          throw error
        }
      }
};
const totalSearchResult = async ({profileId,name}:searchProfileFriendist)=>{
    if(!profileId||!name){
        return 
    }
    const count = await db.friendShip.count({
        where:{
            AND:[
                {OR: [
                    { requester: { firstName: { contains: name, mode: 'insensitive' } } },
                    { addressee: { firstName: { contains: name, mode: 'insensitive' } } }
                  ]},{
                OR:[
                        {AND:[
                            {adresseedId:profileId},
                            {status:'ACCEPTED'}
                        ]},
                        {AND:[
                            {requesterId:profileId},
                            {status:'ACCEPTED'}
                        ]}
                    ]
                  }
                ]
        }
    })
    console.log(count)

    return count 

}

///filter friends list and infinite loading 