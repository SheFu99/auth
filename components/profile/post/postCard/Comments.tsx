"use client"
import { DeleteComment, LikeComment } from "@/actions/commentsAction";

import { ExtendedUser } from "@/next-auth";
import { startTransition, useState, useTransition } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { toast } from "sonner";
import PostHeader from "../Post-header";
import ImageGrid from "../Image-grid";
import LikeButton from "../Like-button";
import { awsBaseUrl } from "../private/UserPostList";
import { Comment } from "@/components/types/globalTs";
import InfiniteScroll from "../functions/infinite-scroll";
import { getCommentByPost } from "@/actions/post";

type commentsParams = {
    comments:Comment[];
    user?:ExtendedUser;
    commentsCount:number

}

const Comments: React.FC<commentsParams> = ({comments,user,commentsCount}) => {
    const [commentState,setComment] = useState<Comment[]>(comments)
    const [isPending,startTransition] = useTransition()

    const [page,setPage]=useState<number>(2)
    const [hasMore,setHasMore]=useState<boolean>(true)

    const fetchMoreData = ()=>{
        if(commentState.length>=commentsCount){
            setHasMore(false)
            return
        }
        getCommentByPost({PostId:comments[0].postId,page:page})
        .then(response=>{
            setComment((prevValue)=>[...prevValue,...response.comments]),
            setPage(p=>p+1)
        }).catch(err=>{
            toast.error(err)
        })

        
    }

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
                    // update()
                }
                if(data.error){
                    toast.success(data.error)
                }
            })
        })

    };
    return (  

        <>
        <InfiniteScroll page={page} loadMore={fetchMoreData} hasMore={hasMore} isloaded={!!commentState}>
        {commentState.map((comment,index)=>(
                        <div key={index} className="px-5 border-b -mb-5 py-5 relative hover:bg-neutral-900">
                            {user?.id === comment.userId&&(
                                <button title="delete commetn" 
                                className="text-black absolute right-0"
                                onClick={()=>DeleteCommentFunction(comment)}
                                >
                                    <RiDeleteBin5Line color="white"/>
                                </button>
                            )}
                            <PostHeader author={comment?.user} timestamp={comment?.timestamp}/>
                                
                            <p className="text-white ml-[3rem]">{comment?.text}</p>
                            
                            <ImageGrid images={comment?.image} className={' ml-[3rem]'}/>
                            <div className="mt-5 -mb-2">
                                <LikeButton className="bg-neutral-900 px-3 " post={comment} onLike={()=>CommentLike(comment)} isPending={isPending}/>

                            </div>
                        </div>
                    ))}
        </InfiniteScroll>
        </>
    );
}
 
export default Comments;