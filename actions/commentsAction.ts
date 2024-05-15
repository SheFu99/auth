"use server"
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { deleteImagefromS3 } from "./UserPosts"

export const CreateComment = async(commentCard,postId)=>{

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
         
            const existingPost = await db.comment.findFirst({
                where: {
                    text: commentCard.text,
                    userId: user.id,
                },
            });
            
            if (existingPost) {
                console.log(existingPost)
                return {error:"A Comment with this content already exists."}
            }
    
        try{
            
        const postData = {
            text:commentCard.text,
            userId:user.id,
            postId:postId
        } as any
    
        if(commentCard.image){
            const imagesCopy = [...commentCard.image];
            if(imagesCopy.length>0){
                postData.image = {create:imagesCopy.map(url=>({url}))}
            }
        }
          
    
            
            const createPost = await db.comment.create({
                data: postData,
              });
            //   console.log("after insert:", [...postCard.image])
            // console.log("Post created", createPost)
            return createPost
           
        }catch(error){
            if (error.code === 'P2002') { // Prisma's error code for unique constraint violation
                console.error("Failed to create a Comment: A Comment with this content already exists.");
            } else {
                console.error("Failed to create a Comment:", error);
            }
            throw error;
        }
}

export const DeleteComment = async(commentId:string,keys:string)=>{
    const user= await currentUser()

    const isCommentOwner = await db.user.findFirst({
        where:{id:user.id}
    })

    if(!isCommentOwner){
        return {error:'You can`t delete this comment'}
    }
    try{
        await deleteImagefromS3(keys)
    }catch(error){
        return{error:`Delete from s3 Error: ${error}`}
    }


try {
    await db.comment.delete({
        where:{CommentId:commentId}
    })

    return {success: 'You comment is delete!'}
}
 catch (error) {
    console.log(error)
    return {error:`Something was wrong:${error}`}
}

};

export const LikeComment = async (CommentId: string) => {
    console.log(CommentId)
    const user = await currentUser();
    if (!user) {
        return { error: "You need to be authorized!" };
    }

    const existingComment = await db.comment.findUnique({
        where: { CommentId: CommentId },
        include: { likes: true }  // Assuming 'likes' is the relation field name in your Prisma schema
    });

    if (!existingComment) {
        return { error: "Post does not exist" };
    }

    // Check if the current user has already liked the post
    const existingLike = existingComment.likes.find(like => like.userId === user.id);

    if (existingLike) {
        // User has liked this post before, remove the like
        await db.like.delete({
            where: { likeId: existingLike.likeId }  // Assuming 'id' is the identifier for likes
        });
        return { success: true, message: "Like removed", likesCount: existingComment.likes.length - 1,hasLike:false };
    } else {
        // User has not liked this post before, add a new like
        await db.like.create({
            data: {
                userId: user.id,
                commentId: CommentId
            }
        });
        return { success: true, message: "Post liked", likesCount: existingComment.likes.length + 1,hasLike:true };
        // return {error:"400"}
    }
};