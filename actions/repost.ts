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
            image:{select:{url:true}}, 
            originPost:{select:{userId:true}}
        }
    });

    if(!post){
        return {error:'Post is not found!'}
    };


const isReposted = await db.post.findFirst({
    where:{
        userId:user.id,
        originPostId:post?.originPostId ? post?.originPostId : post.PostId,
    },
    select:{repostCount:true}
})

const  isSelfRepost = user.id === post.originPost?.userId||post.userId ? true: false

// console.log(`Self repost status: ${isSelfRepost}`)

if(!isReposted&&!isSelfRepost){
    // console.log()
    try{
        await db.post.create({
            data:{
                originPostId:post.originPostId? post.originPostId :post.PostId,
                userId:user.id,
                superText:superText,
                text:post.text,
                authorAvatar:user.image,
                authorName:user.name,
                image:{
                    create:post.image
                },
                
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

