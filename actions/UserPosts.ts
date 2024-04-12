"use server"

import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { UserPost } from "@/schemas"
import * as z from "zod"

export type userPost = z.infer<typeof UserPost>
type Post = {
    text?:string,
    image?:string,
    success?:string,
    error?:string,
}
export const CreatePost= async(post:Post)=>{
   const user= await currentUser()
//    console.log("USER created post",user)
      if(!user){
        return {error:"You need to be autorize!"}
        }

        const existingUser = await db.user.findFirst({
                where:{id:user.id,}
        })

      if(!existingUser){
            return {error:"User not found"}
        }
        const existingPost = await db.post.findUnique({
            where: {
                text: post.text,
            },
        });
    
        if (existingPost) {
            console.log("error")
            return {error:"A post with this content already exists."}
        }

    try{
        const createPost = await db.post.create({
            data:{
                text:post.text,
                image:post.image,
                userId:user?.id,
                },
        })
        console.log("Post created", createPost)
        return createPost
       
    }catch(error){
        if (error.code === 'P2002') { // Prisma's error code for unique constraint violation
            console.error("Failed to create a post: A post with this content already exists.");
        } else {
            console.error("Failed to create a post:", error);
        }
        throw error;
    }
        
        
}

export const GetUserPosts= async(userId:string)=>{
    const user = await currentUser()
    if(userId!==user.id){
        return {error:"You need to be autorize!"}
        } ///allow only author 
    
    if(!user){
        return {error:"You need to be autorize!"}
        }
    const existingUser = await db.user.findFirst({
        where:{id:user.id}
    })
    if(!existingUser){
        return {error:"User not found"}
    }
    const posts = await db.post.findMany({
        where:{
            userId:user.id}
        })
    if(!posts){
        return {error:"No posts found"}
    }
    return {posts:posts , success:true}
}

export const DeleteUserPosts = async (postId:string)=>{
    const user = await currentUser()
    if(!user){
        return {error:"You need to be autorize!"}
        }
    const existingUser = await db.user.findFirst({
        where:{id:user.id}
    })
    if(!existingUser){
        return {error:"User not found"}
    }
    const existingPost = await db.post.findFirst({
        where:{PostId:postId}
    })

    if(!existingPost){
        return {error:"Post does not exist"}
    }

    const post = await db.post.delete({
        where:{PostId:postId}
    })
    if(!post){
        return {error:"Post not found"}
    }
    return {success:"Post deleted"}
}

export const EditUserPosts = async (postId:string, post:Post)=>{
    const user = await currentUser()
    if(!user){
        return {error:"You need to be autorize!"}
        }
    const existingUser = await db.user.findFirst({
        where:{id:user.id}
    })
    if(!existingUser){
        return {error:"User not found"}
    }
    const existingPost = await db.post.findFirst({
        where:{PostId:postId}
    })

    if(!existingPost){
        return {error:"Post does not exist"}
    }

    if(existingPost.userId!==existingUser.id){
        return {error:"You need to be author of this post!"}
    }

    const updatedPost = await db.post.update({
        where:{PostId:postId},
        data:{
            text:post.text,
            image:post.image,
        }
    })
    if(!updatedPost){
        return {error:"Post not found"}
    }
    return {success:"Post updated"}
}