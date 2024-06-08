import { toast } from "sonner";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { changeLikeCount } from "./changeLikeCount";

import { CreateComment, DeleteComment, LikeComment } from "@/actions/commentsAction";
import { CommentQueryPromise, CommentsMutationContext } from "../../lib/useComment";

export const usePostCommentMutations = (postId:string)=>{
    const commentQuery = ['comments',postId]
    const queryClient = useQueryClient()
   
    const deleteComment = useMutation({
        mutationFn:DeleteComment,
        onSuccess :(data, variables, context)=> {
            const {commentId}=variables
            queryClient.setQueryData<InfiniteData<CommentQueryPromise>>(commentQuery,
                old=> {
                    if(!old) return old

                    const newPost = {
                        ...old,
                        pages:old.pages.map(page=>({
                            ...page,
                            data:page.data.filter(comment=> comment.CommentId !==commentId)
                        }))
                    }
                    console.log(newPost)
                    return newPost
                }
            )
        },
        onError(error, variables, context) {
            queryClient.invalidateQueries({queryKey:commentQuery})
        },
        onSettled:()=>{
            queryClient.invalidateQueries({queryKey:commentQuery})
        }
    });
    const likeComment = useMutation({
        mutationFn:LikeComment,
        onMutate: async (CommentId:string):Promise<CommentsMutationContext>=> {
            await queryClient.cancelQueries({queryKey:commentQuery})
            const preveousComments = queryClient.getQueryData<InfiniteData<CommentQueryPromise>>(commentQuery)

            const newData ={
                ...preveousComments,
                pages:preveousComments.pages.map(page=>({
                    ...page,
                    data:page.data.map(comment=>{
                        if(comment.CommentId===CommentId){
                            const LikeCount = changeLikeCount(comment)
                            console.log(LikeCount)
                            return LikeCount
                        }
                        return comment
                    })
                }))
            };
            queryClient.setQueryData(commentQuery,newData)
            
            return {preveousComments}
        },
        onError(error, variables, context) {
            if(context?.preveousComments){
                queryClient.setQueryData(commentQuery,context.preveousComments)
            }
        },
        onSettled:()=>{
            queryClient.invalidateQueries({queryKey:commentQuery})
        }
    });
    const createComment = useMutation({
        mutationFn:CreateComment,
        onSuccess :(newComment)=>{
            const existingData = queryClient.getQueryData<InfiniteData<CommentQueryPromise>>(commentQuery)
            if(existingData){
                const updatedData = {
                    ...existingData,
                    pages:existingData.pages.map(page=>({
                        ...page,
                        data:[newComment.createdComment,...page.data]
                    }))
                }
                queryClient.setQueryData(commentQuery,updatedData)
                return updatedData
            }
        },
        onError(error, variables, context) {
            toast.error("Network error!")
            queryClient.invalidateQueries({queryKey:commentQuery})
        },
        onSettled: ()=>{
            queryClient.invalidateQueries({queryKey:commentQuery})
        }
    })
  

    return {
        commentQuery,
        deleteComment,
        likeComment,
        createComment
    }
}
  