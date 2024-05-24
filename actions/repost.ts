"use server"
import { db } from "@/lib/db"
import { currentUser } from "@/lib/auth"
import { DeleteUserPosts } from "./UserPosts"

export type repostProps = {
    postId:string,
    superText?:string
}

export const repostAction = async ({postId,superText}:repostProps)=>{
    const user= await currentUser()

    if(!user){
        return {error:"You need to be Authorize!"}
    };

    const existingUser = await db.user.findFirst({
        where:{id:user.id},
        select:{id:true}
    })
    if(!existingUser){
        return {error:'User does not exist in DB!'}
    }
    const post = await db.post.findFirst({
        where:{
            PostId:postId
        },
        
        include:{
            image:{
                select:{url:true}
            },
            
            
        }
    });

    if(!post){
        return {error:'Post is not found!'}
    };

    const originUser = await db.user.findFirst({
        where:{id:post.originUserId?post.originUserId:post.userId},
        select:{
            image:true,
            name:true
        }
    })

    if(!originUser){
        return {error:'Something wrong origin user not found!'}
    }
const isReposted = await db.post.findFirst({
    where:{
        userId:user.id,
        originPostId:post?.originPostId ? post?.originPostId : post.PostId,
    },
    select:{repostCount:true}
})
let isSelfRepost

if(post?.userId && post.originUserId){
     isSelfRepost = user.id === post.originUserId? true: false
}

console.log(`Self repost status: ${isSelfRepost}`)

if(!isReposted&&!isSelfRepost){
    // console.log()
    try{
        await db.post.create({
            data:{
                originUserId:post.originUserId ? post.originUserId: post.userId,
                originPostId:post.originPostId? post.originPostId :post.PostId,

                userId:user.id,
                superText:superText,
                text:post.text,
                image:{
                    create:post.image
                },
                originUserName:originUser.name,
                originAvatar:originUser.image,
                originTimeStamp:post.timestamp
                
            }
            
        })
    }catch(error){
        return {error:`Something went wrong: ${error}`}
    };



    const repostCountifFirstRepost = post?.repostCount<1 ? 1 : {increment:1}

  await db.post.update({
        where:{
            PostId:postId
        },
        data:{
            repostCount: repostCountifFirstRepost
        }
    })
    return {success:true}

}else{
    return {error:'You already have this post!'}
}

}

