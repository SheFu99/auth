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
    message?:string,
    success?:boolean;
    error?:string
}
export const getProfileFriends = async (userId:string):Promise<getPublicFriendsPromise>=>{
    if(!userId){
        return {error:'Profile is not found'}
    }
    try {
            const userFriendsList:FriendsOffer[] = await db.friendShip.findMany({
                where:{
                    AND:[
                        {requesterId:userId},
                        {status:'ACCEPTED'}
                    ]
                },
                include:{
                    addressee:{
                        select:{
                            firstName:true,
                            image:true,
                            userId:true,
                        }
                    }
                }
            })
            const userFriendsListRight = await db.friendShip.findMany({
                where:{
                    AND:[
                        {adresseedId:userId},
                        {status:'ACCEPTED'}
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
                }
            })
    
            userFriendsList.push(...userFriendsListRight)
        return {success:true,profileFirendsList:userFriendsList}
    } catch (error) {
        return {error:error}
    }
};
 
export type getPrivateFriendsPromise = {
    userFriendsList?:FriendsOffer[],
    message?:string,
    success?:boolean,
    error?:string,
};
export const getUserFreinds = async (page:number):Promise<getPrivateFriendsPromise> =>{
    const user = await currentUser()
    if(!user){
        return {error:'Error!You need to be authorized!'}
    }
    const pageSize = 3;
    let newPage = page || 1
    const skip = (newPage - 1) * pageSize; 

    try {
        const userFriendsList:FriendsOffer[] = await db.friendShip.findMany({
            
            where:{
                AND:[
                    {requesterId:user.id},
                    {status:'ACCEPTED'}
                ]
            },
            skip:skip,
            take:pageSize,
            include:{
                
                addressee:{
                    select:{
                         firstName:true,
                            image:true,
                            userId:true,
                    }
                }
            }

        })
        const userFriendsListRight = await db.friendShip.findMany({
            where:{
                AND:[
                    {adresseedId:user.id},
                    {status:'ACCEPTED'}
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
            }
        })

         userFriendsList.push(...userFriendsListRight)
        return {success:true ,userFriendsList:userFriendsList }
    } catch (error) {
        return {error:error}
    }
};



///filter friends list and infinite loading 