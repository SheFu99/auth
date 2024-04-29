"use server"

import { s3Client } from "@/app/api/s3-upload/route"
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { UserPost } from "@/schemas"
import { DeleteObjectsCommand } from "@aws-sdk/client-s3"
import * as z from "zod"

export type userPost = z.infer<typeof UserPost>
type Post = {
    text?:string,
    image?:any[],
    success?:boolean,
    likedByUser?:boolean
};
export type postPromise = {
    posts?:any[],
    success?: boolean,
    error?:string,
    message?:string,
    likesCount?:number,
    hasLike?:boolean,
   
};
type responsePromise = {
    success?:string,
    message?:string,
    error?:string,
};
type deleteS3promise = {
    success?:boolean,
    result?:any,
    error?:string,
};
type PostCard = {
    text:string,
    image:string[],
    userId:string,
}



export const CreatePost= async(postCard:PostCard)=>{
    console.log("POST", postCard)
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
     
        const existingPost = await db.post.findFirst({
            where: {
                text: postCard.text,
                userId: user.id,
            },
        });
        
        if (existingPost) {
            console.log(existingPost)
            return {error:"A post with this content already exists."}
        }

    try{
        
    const imagesCopy = [...postCard.image];

        
        const createPost = await prisma.post.create({
            data: {
              text: postCard.text,
              userId: user.id,
              image: {
                create: imagesCopy.map(url => ({ url })),  // Assumes 'postCard.images' is an array of image URLs
              },
            },
          });
        //   console.log("after insert:", [...postCard.image])
        // console.log("Post created", createPost)
        return createPost
       
    }catch(error){
        if (error.code === 'P2002') { // Prisma's error code for unique constraint violation
            console.error("Failed to create a post: A post with this content already exists.");
        } else {
            console.error("Failed to create a post:", error);
        }
        throw error;
    }
        
        
};

export const GetUserPostsById = async (userId: string,):Promise<postPromise> => {
    console.log(userId)
    const page=1
    const pageSize = 10;
    const skip = (page - 1) * pageSize; 

    const existingUser = await db.user.findFirst({
        where: { id: userId }
    });
    if (!existingUser) {
        return { error: "User not found" };
    }
    const user = await currentUser()
    const posts = await db.post.findMany({
        where: {
            userId: userId
        },
        orderBy: [
            { timestamp: "desc" }  // Assuming 'createdAt' is the correct field for timestamping posts
        ],
        skip: skip,  // Skip the previous pages
        take: pageSize,  // Limit the number of posts

        include: {
            _count: {
                select: {
                    likes: true,  // This will count the likes
                }
            },
            likes: {
                where: { 
                    userId: user.id 
                    }   ,
                select: { userId: true } ,
                
            },
            image:{
                select:{url:true},
                take:5,
            },
            coments:{
                take:5,
            }
        }
    });

    if (!posts.length) {
        return { error: "No posts found" };
    }

  
    // Map posts to include like counts
    const postsWithLikeCounts = posts.map(post => ({
        ...post,
        likeCount: post._count.likes,  // Each post object will now include a 'likeCount' property
        likedByUser: post.likes.some(like => like.userId === user.id)  // Boolean indicating if the user liked the post
    }));

    return { posts: postsWithLikeCounts, success: true };
};

export const DeleteUserPosts = async (postId:string,keys:string):Promise<responsePromise>=>{
    console.log(postId)
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
    const result = await deleteImagefromS3(keys)

    const post = await db.post.delete({
        where:{PostId:postId}
    })
    // console.log(result)
    if(!post){
        return {error:"Post not found"}
    }
    return {success:"Post deleted"}
};

    const deleteImagefromS3 = async(keys : any):Promise<deleteS3promise>=>{
        if(!keys||keys.lenght ===0){
            return {error:'Key is require'}
        };

    
        const deleteParams = {
            Bucket:process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
                Delete:{
                        Objects:keys.map((key:string)=>({Key:key})),
                        Quiet:false,
                },
            };

        try {
            const deleteCommand = new DeleteObjectsCommand(deleteParams);
            const deleteResult = await s3Client.send(deleteCommand);
            return {success:true,result:deleteResult}
        } catch (error) {
            console.log('Error',error)
            return {error:'Something was wrong!'}
        }
    };

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
