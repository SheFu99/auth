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
        await db.friendShip.create({
            data:{
                requesterId:user.id,
                adresseedId:userId,
            }
        })
        return {success:true,message:'Your request has been succesfully send!'}
    } catch (error) {
        return{error:error}
    }
}
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
   
}



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



export type changeStatusParams = {
    transactionId:string,
    requesterId?:string
    status:friendshipStatus,
}
export const changeFriendOfferStatus = async ({transactionId,status,requesterId}:changeStatusParams)=>{
    const user = await currentUser()

    if(!user){
        return {error:'You need to be athorize!'}
    };
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




export type getPublicFriendsPromise ={
    profileFirendsList?:FriendsOffer[];
    message?:string,
    success?:boolean;
    error?:string
}
export const getProfileFriends = async (userId:string):Promise<getPublicFriendsPromise>=>{
    console.log(userId)
    if(!userId){
        return {error:'Profile is not found'}
    }
    try {
            const userFriendsListLeft = await db.friendShip.findMany({
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
    
            const profileFirendsList = [...userFriendsListLeft,...userFriendsListRight]
            // console.log("LEFT",userFriendsListLeft)
            // console.log("Right",userFriendsListRight)
            
    
    
          
        return {success:true,profileFirendsList:profileFirendsList}
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
export const getUserFreinds = async ():Promise<getPrivateFriendsPromise> =>{
    const user = await currentUser()
    if(!user){
        return {error:'Error user not found!'}
    }
    try {
        const userFriendsListLeft = await db.friendShip.findMany({
            where:{
                AND:[
                    {requesterId:user.id},
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

        const userFriendsList = [...userFriendsListLeft,...userFriendsListRight]
        // console.log("LEFT",userFriendsListLeft)
        // console.log("Right",userFriendsListRight)
        


        return {success:true ,userFriendsList:userFriendsList }
    } catch (error) {
        return {error:error}
    }
};



export type deleteFriendParams = {
    transactionId:string,
    status:friendshipStatus
}

export const deleteFriend = async ({transactionId,status}:deleteFriendParams)=>{
    const user = currentUser()
    if(!user){
        return {error:'You need to be authorize!'}
    }
    if(!transactionId){
        return {error:'Unacceptable behavior!'}
    };
    try {
        await db.friendShip.update({
            where:{transactionId:transactionId},
            data:{
                status:status
            }
        });
        return {succes:true}
    } catch (error) {
        return {error:error}
    }
  
}