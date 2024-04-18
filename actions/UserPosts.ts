"use server"

import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { UserPost } from "@/schemas"
import * as z from "zod"

export type userPost = z.infer<typeof UserPost>
type Post = {
    text?:string,
    image?:string,
    success?:boolean,
    likedByUser?:boolean
}
export type postPromise = {
    posts?:any[],
    success?: boolean,
    error?:string,
    message?:string,
    likesCount?:number,
    hasLike?:boolean,
   
}
type responsePromise = {
    success?:string,
    message?:string,
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

export const GetUserPostsById = async (userId: string):Promise<postPromise> => {
 

    const existingUser = await db.user.findFirst({
        where: { id: userId }
    });
    if (!existingUser) {
        return { error: "User not found" };
    }

    const posts = await db.post.findMany({
        where: {
            userId: userId
        },
        orderBy: [
            { timestamp: "desc" }  // Assuming 'createdAt' is the correct field for timestamping posts
        ],
        include: {
            likes: {
                select: { userId: true }  // Select only the 'id' because we just need to count likes
            }
        }
    });

    if (!posts.length) {
        return { error: "No posts found" };
    }

    // Map posts to include like counts
    const postsWithLikeCounts = posts.map(post => ({
        ...post,
        likeCount: post.likes.length,  // Each post object will now include a 'likeCount' property
        likedByUser: post.likes.some(like => like.userId === userId)  // Boolean indicating if the user liked the post
    }));

    return { posts: postsWithLikeCounts, success: true };
};


export const DeleteUserPosts = async (postId:string):Promise<responsePromise>=>{
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


///TODO: get first 10 post and load next with paginaton

export const LikePost = async (postId: string):Promise<postPromise> => {
    const user = await currentUser();
    if (!user) {
        return { error: "You need to be authorized!" };
    }

    const existingPost = await db.post.findUnique({
        where: { PostId: postId },
        include: { likes: true }  // Assuming 'likes' is the relation field name in your Prisma schema
    });

    if (!existingPost) {
        return { error: "Post does not exist" };
    }

    // Check if the current user has already liked the post
    const existingLike = existingPost.likes.find(like => like.userId === user.id);

    if (existingLike) {
        // User has liked this post before, remove the like
        await db.like.delete({
            where: { likeId: existingLike.likeId }  // Assuming 'id' is the identifier for likes
        });
        return { success: true, message: "Like removed", likesCount: existingPost.likes.length - 1,hasLike:false };
    } else {
        // User has not liked this post before, add a new like
        await db.like.create({
            data: {
                userId: user.id,
                postId: postId
            }
        });
        return { success: true, message: "Post liked", likesCount: existingPost.likes.length + 1,hasLike:true };
        // return {error:"400"}
    }
};
