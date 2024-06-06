"use server"
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { deleteImagefromS3 } from "./UserPosts"
import { CommentPrev } from "@/components/profile/forms/CommentForm"
import { Comment } from "@/components/types/globalTs"

type CreateCommentParams = {
    postId:String,
    comment:CommentPrev
};
type CreateCommentPromise =  {
    createdComment?:Comment,
    error?:string,
    success?:boolean
}

export const CreateComment = async({comment,postId}:CreateCommentParams):Promise<CreateCommentPromise>=>{
    if(!postId){
        throw new Error ('postID is required')
    }
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
                    AND:[
                        {text: comment.text},
                        {userId: user.id},
                    ]
                },
            });
            
            if (existingPost) {
                console.log(existingPost)
                return {error:"A Comment with this content already exists."}
            }
    
        try{
            
        const postData = {
            text:comment.text,
            userId:user.id,
            postId:postId
        } as any
        if(comment.image){
            const imagesCopy = [...(comment.image as string[])];
            if(imagesCopy.length>0){
                postData.image = {create:imagesCopy.map(url=>({url}))}
            }
        }
            const createPost = await db.comment.create({
                data: postData,
                include:{
                    image:{
                        select:{url:true}
                    },
                    _count:{
                        select:{
                            likes:true
                        }
                    },
                    user:{
                        select:{
                            image:true,
                            name:true
                        }
                    }

                }
              });
            //   console.log("after insert:", [...postCard.image])
            return {createdComment:createPost , success:true}
           
        }catch(error){
            if (error.code === 'P2002') { // Prisma's error code for unique constraint violation
                console.error("Failed to create a Comment: A Comment with this content already exists.");
            } else {
                console.error("Failed to create a Comment:", error);
            }
            throw error;
        }
}

type DeleteCommentParams = {
    commentId:string,
    keys?:string
}
export const DeleteComment = async({commentId,keys}:DeleteCommentParams)=>{
     console.log('COMMENTDELETE',commentId)
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
    ///TODO: Add rate limit to each like action 
    console.log(CommentId)
    const user = await currentUser();
    if (!user) {
        return { error: "You need to be authorized!" };
    }

    const existingComment = await db.comment.findUnique({
        where: { CommentId: CommentId },
        include: { likes: true } 
    });
    if (!existingComment) {
        return { error: "Post does not exist" };
    }
    const existingLike = existingComment.likes.find(like => like.userId === user.id);

    if (existingLike) {
        await db.like.delete({
            where: { likeId: existingLike.likeId }
        });
        return { success: true, message: "Like removed", likesCount: existingComment.likes.length - 1,hasLike:false };
    } else {
        await db.like.create({
            data: {
                userId: user.id,
                commentId: CommentId
            }
        });
        return { success: true, message: "Post liked", likesCount: existingComment.likes.length + 1,hasLike:true };
    }
};