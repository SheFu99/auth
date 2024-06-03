import { Comment } from "@/components/types/globalTs";
import { ExtendedUser } from "@/next-auth";
import { RiDeleteBin5Line } from "react-icons/ri";
import PostHeader from "../Post-header";
import ImageGrid from "../Image-grid";
import LikeButton from "../Like-button";
import { useState, useTransition } from "react";
import { awsBaseUrl } from "../private/UserPostList";
import { DeleteComment, LikeComment } from "@/actions/commentsAction";
import { toast } from "sonner";


interface CommentProps {
    user?:ExtendedUser,
    comment?:Comment,
    commentState?:Comment[],
    setComment?: (comments:Comment[])=>void,
    className?:string,
    index?:number,
}

const OneComment = ({user,comment,commentState,setComment,className,index}:CommentProps) => {
    const [isPending,startTransition]=useTransition()
    const commentLikeAction = (CommentId:string)=>{
        startTransition(()=>{
            LikeComment(CommentId)
            .then((data)=>{
                if(data.error){
                    toast.error('Comment Like Error')
                }
                if(data.success){
                    return
                }
            })
        })
    };

     const CommentLike =  (comment:Comment) => {
        const commentId = comment.CommentId
        if (!user) {
            toast.error("You must be authorized");
            return;
        }
       
        
        if(commentState){
            const updatedPosts = commentState.map((com) => {
                if (com.CommentId !== commentId) {
                    return com; // No changes for other comments
                }
              
             
                // Update the comment here
                return {
                    ...com,
                    likedByUser: !com.likedByUser,
                    _count: {
                        ...com._count,
                        likes: com.likedByUser ? com._count?.likes - 1 : com._count?.likes + 1
                    }
                };
         
            // Return the updated post with the updated comments
          
        });
            setComment(updatedPosts);

        }
        commentLikeAction(commentId);
        
    };

    const DeleteCommentFunction = (comment:Comment) =>{
        const keys:any = comment?.image?.map(item => {
            const result = item.url.split(awsBaseUrl)[1];
            return result
          });


        startTransition(()=>{
            DeleteComment(comment.CommentId,keys)
            .then((data)=>{
                if(data.success){
                    toast.success(data.success)

                    if(commentState){
                        const filteredState = commentState.filter(com=>{
                           return com.CommentId !== comment.CommentId
                        })
                        setComment(filteredState)
                    }
                 


                    // update()
                }
                if(data.error){
                    toast.success(data.error)
                }
            })
        })

    };
    return ( 
        <div className={`${className} relative -mt-5 py-5`} key={index||1}>
             {user?.id === comment.userId&&(
                                <button title="delete commetn" 
                                className="text-black absolute right-1"
                                onClick={()=>DeleteCommentFunction(comment)}
                                >
                                    <RiDeleteBin5Line color="white"/>
                                </button>
                            )}
                            <div className="">
                            <PostHeader author={comment?.user} timestamp={comment?.timestamp} />
                                
                                <p className="text-white ml-[3rem]">{comment?.text}</p>
                                
                                <ImageGrid images={comment?.image} className={' ml-[3rem]'}/>
                                <div className=" ">
                                   
                                        <LikeButton className="bg-neutral-900 px-3 " post={comment} onLike={()=>CommentLike(comment)} isPending={isPending}/>
                                   
    
                                </div>
                            </div>
                            
        </div>
     );
}
 
export default OneComment;