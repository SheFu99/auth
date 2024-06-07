import { Comment } from "@/components/types/globalTs";
import { ExtendedUser } from "@/next-auth";
import { RiDeleteBin5Line } from "react-icons/ri";
import PostHeader from "../Post-header";
import ImageGrid from "../Image-grid";
import LikeButton from "../Like-button";
import {  useTransition } from "react";
import { awsBaseUrl } from "../private/UserPostList";
import { DeleteComment, LikeComment } from "@/actions/commentsAction";
import { toast } from "sonner";
import { PostPromise, usePosts } from "../lib/usePost";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { MutationContext } from "./lists/PrivatePostList";
import { changeLikeCount } from "./lib/changeLikeCount";


interface CommentProps {
    currentSession?:ExtendedUser,
    comment?:Comment,
    commentState?:Comment[],
    className?:string,
    index?:number,
    userId?:string
}

const OneComment = ({currentSession,comment,userId,className,index}:CommentProps) => {
    const [isPending,startTransition]=useTransition()
    const {data,isError,isLoading}=usePosts(userId)
    const queryClient = useQueryClient()
    const postQuery = ['posts',userId]

    const comentLikeMutation = useMutation({
        mutationFn:LikeComment,
        onMutate: async (CommentId:string):Promise<MutationContext>=>{
            await queryClient.cancelQueries({queryKey:postQuery});
            const preveousPosts = queryClient.getQueryData<InfiniteData<PostPromise>>(postQuery);
            
            queryClient.setQueryData<InfiniteData<PostPromise>>(
                postQuery,
                (old)=>{
                    if(!old) return old 

                    return {
                        ...old,
                        pages:old.pages.map(page=>({
                            ...page,
                            data:page.data.map(post=>({
                                ...post,
                                comments:post.comments.map(comment=>{
                                    if(comment.CommentId === CommentId){
                                        const changedCount = changeLikeCount(comment)
                                        return changedCount
                                    }
                                    return comment
                                })
                            }))
                        }))
                    }

                }
            )

            return {preveousPosts}
        },
        onError:(err,commentId,context)=>{
            if(context?.preveousPosts){
                queryClient.setQueryData(postQuery,context.preveousPosts)
            }
        },
        onSettled:()=>{
            queryClient.invalidateQueries({queryKey:postQuery})
        }
    })
    const commentDeleteMutation = useMutation({

        mutationFn:DeleteComment,
        onSuccess: (data,variables,context)=>{
            const { commentId }=variables
            queryClient.setQueryData<InfiniteData<PostPromise>>(postQuery,
                old=>{
                    if(!old) return old

                    const newPost = {
                        ...old,
                        pages:old.pages.map(page=>({
                            ...page,
                            data:page.data.map(post=>({
                                ...post,
                                comments:post.comments.filter(comment=>comment.CommentId !== commentId)
                            }))
                        }))
                    }
                    return newPost
                }
            )
        },
        onError:(err,variables,context)=>{
            if(err){
                toast.error("Error try again!")
            }
        },
        onSettled:()=>{
            queryClient.invalidateQueries({queryKey:postQuery})
        }

    })
     const CommentLike =  (comment:Comment) => {
        const commentId = comment.CommentId
        if (!currentSession) {
            toast.error("You must be authorized");
            return;
        }
        comentLikeMutation.mutateAsync(commentId);
    };


    const DeleteCommentFunction = (comment:Comment) =>{
        const keys:any = comment?.image?.map(item => {
            const result = item.url.split(awsBaseUrl)[1];
            return result
          });

          commentDeleteMutation.mutateAsync({commentId:comment.CommentId,keys:keys})

    };
    return ( 
        <div className={`${className} relative -mt-5 py-5 px-4`} key={index||1}>
             {currentSession?.id === comment.userId&&(
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