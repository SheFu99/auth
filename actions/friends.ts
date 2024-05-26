"use server"
import { friendshipStatus, requester } from "@/components/types/globalTs"
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
export type getCurrentUserOfferPromise ={
    requester: requester;
    transactionId: string;
    requesterId: string;
    adresseedId: string;
    status: friendshipStatus;
    createdAt: Date;
    updatedAt?: Date;
}
type getOfferProps ={
    currentOfferList?:getCurrentUserOfferPromise[],
    error?:string,
    success?:boolean
}
export type getCurrentUserOfferResult = getCurrentUserOfferPromise[] | {error?:string};

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
                                    name:true,
                                    image:true,
                                    id:true,
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
    if(status==='ACCEPTED'&&requesterId){
        try {
            await db.friendsList.create({
                data:{
                    profileId:user.id,
                    userId:requesterId,
                }
            })
        } catch (error) {
            return {error:error}
        }
        
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
type user = {
    name:string,
    image?:string
}
export type getPublicFriedsList={
    user:user;
    id: number;
    profileId: string;
    createdAt: Date;
    userId: string
}
export type getPublicFriendsPromise ={
    profileFirendsList?:getPublicFriedsList[];
    success?:boolean;
    error?:string
}
export const getProfileFriends = async (userId:string):Promise<getPublicFriendsPromise>=>{
    if(!userId){
        return {error:'Profile is not found'}
    }
    try {
        const profileFirendsList = await db.friendsList.findMany({
            where:{
                profileId:userId
            },
            
            include:{
                user:{
                    select:{
                        name:true,
                        image:true
                    }
                }
            }

        });
        return {success:true,profileFirendsList:profileFirendsList}
    } catch (error) {
        return {error:error}
    }
   

}