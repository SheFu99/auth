"use server"


import { deletePostParams } from "@/components/types/globalTs"
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { UserPost } from "@/schemas"
import { DeleteObjectsCommand, S3Client } from "@aws-sdk/client-s3"
import * as z from "zod"

export type userPost = z.infer<typeof UserPost>

export type postPromise = {
    posts?:any,
    success?: boolean,
    error?:string,
    message?:string,
    likesCount?:number,
    hasLike?:boolean,
    totalPostCount?:number,
   
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


const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_S3_REGION as string,
    credentials:{
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_KEY as string,
    }
});
export const CreatePost= async(postCard:PostCard)=>{
  
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
            // console.log(existingPost)
            return {error:"A post with this content already exists."}
        }

    try{
        
    const postData = {
        authorAvatar:user.image,
        authorName:user.name,
        text:postCard.text,
        userId:user.id,
    } as any

    if(postCard.image){
        const imagesCopy = [...postCard.image];
        if(imagesCopy.length>0){
            postData.image = {create:imagesCopy.map(url=>({url}))}
        }
    }
      

        
        const createPost = await db.post.create({
            data: postData,
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
///add cache 
let PostsCacheKey = {
    userId:undefined,
    page:null,
    time:undefined,
    posts:undefined,
    success:undefined,
    totalPostCount:undefined
    
}
export const GetUserPostsById = async (userId: string,page:number):Promise<postPromise> => {
    console.log(page)
    // const time = new Date()
    // let now = time.getTime()
    // console.log(now,PostsCacheKey.time)
    // let cacheId = PostsCacheKey.userId === userId
    // let cachePage = PostsCacheKey.page ===page
    // let cacheTime = PostsCacheKey.time > now - 2000
  
    // if(cacheId===cachePage===cacheTime){
    //     console.log('Retrive from cache')

    //     return {success:true, posts: PostsCacheKey.posts ,totalPostCount:PostsCacheKey.totalPostCount}
    // }
   
if(!userId){
    return {error:'ID required!'}
}
    const pageSize = 3;
    const skip = (page - 1) * pageSize; 

    const existingUser = await db.user.findFirst({
        where: { id: userId },
    })
    if (!existingUser) {
        return { error: "User not found" };
    };
    // console.log(existingUser)

    const user = await currentUser()


    const postsQuery={
        where: {userId: userId},
    orderBy: [
        { timestamp: "desc" }  // Assuming 'createdAt' is the correct field for timestamping posts
    ],
    skip: skip,  // Skip the previous pages
    take: pageSize,  // Limit the number of posts

    include: {
        _count: {
            select: {
                likes: true, 
                comments:true // This will count the likes
            }
        },
        image:{
            select:{url:true},
            take:5,
        },
        comments:{
            take:2,
            include:{
                image:{
                    select:{url:true},
                    take:5
                },
                user:{
                    select:{
                        name:true,
                        image:true,
                        id:true
                    }
                },
                likes:true,
                _count:{
                    select:{
                        likes:true
                    }
                }
            }
        },
        originPost:{
            select:{
                authorAvatar:true,
                authorName:true,
                userId:true,
                timestamp:true
            }
           
        }
    }
        
    } as any

    if (user) {
        postsQuery.include.likes = {
            where: { 
                userId: user.id
            },
            select: { userId: true }
        };
    };
// console.log(postsQuery)

    const [posts, totalPostCount] = await Promise.all([
     await db.post.findMany(postsQuery) as any,
     await db.post.count({where:{userId:userId}}),
    ])
  
    // console.log(posts)
    if (!posts.length||totalPostCount<=0) {
        return { error: "No posts found" };
    }

  
    // Map posts to include like counts
    const postsWithLikeCounts = posts.map(post => {
        const likedByUser = user && post.likes && post.likes.some(like => like.userId === user.id);


        const commentsWithAuthor = post.comments.map(comment=>{
            const commentLikedByUser = user && comment.likes&& comment.likes.some(like=>like.userId===user.id)
            return{
                ...comment,
                likeCount:comment._count.likes,
                likedByUser: commentLikedByUser ?? false
            }
        });
        // console.log(likedByUser,commentsWithAuthor)
        return {
            ...post,
            likedByUser: likedByUser ?? false ,
            comments:commentsWithAuthor
            
        };
    });
    // PostsCacheKey= {
    //     userId:userId,
    //     page:page,
    //     time:now,
    //     posts: postsWithLikeCounts,
    //     success: true,
    //     totalPostCount:totalPostCount
    // }
    return { posts: postsWithLikeCounts, success: true,totalPostCount:totalPostCount };
};

export const DeleteUserPosts = async ({postId,keys}:deletePostParams):Promise<responsePromise>=>{
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
    if(keys){
        try{
            await deleteImagefromS3(keys)
        }catch(error){
            return{error:`Delete from s3 Error: ${error}`}
        }
    }

    let currentPost

try{
     currentPost = await db.post.findFirst({
        where:{PostId:postId}
    })
}catch(err){
    return {error:err}
}
// console.log(currentPost)

     let originPostId = currentPost?.originPostId
    // console.log(originPostId)
if(originPostId){
    try {
        await db.post.update({
            where:{
                PostId:originPostId
            },
            data:{
                repostCount:{
                    decrement:1
                }
            }
        })
        // console.log("DECREMENT repostCOUNT")
    } catch (error) {
       return{error:'Error decrement repost count'} 
    }
}

    try {
        const currentPost = await db.post.findFirst({
            where:{PostId:postId},
            select:{originPostId:true}
        })
        if(currentPost?.originPostId){
            await db.post.update({
                where:{
                    PostId:currentPost.originPostId
                },
                data:{
                    repostCount:{
                        decrement:1
                    }
                }
            })
        }

        await db.post.delete({
            where:{PostId:postId}
        })
        await db.post.deleteMany({
            where:{
                originPostId:postId
            }
        })
    } catch (error) {
        return {error:'Something gone wrong!'}
    }

   
    return {success:"Post deleted"}
};
      export  const deleteImagefromS3 = async(keys : any):Promise<deleteS3promise>=>{
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
                // console.log('Error',error)
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

