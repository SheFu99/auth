import { DeleteUserPosts, LikePost } from "@/actions/UserPosts";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { PostQueryPromise } from "../../lib/usePost";
import { changeLikeCount } from "./changeLikeCount";
import { toast } from "sonner";
import { post } from "@/components/types/globalTs";
import { ExtendedUser } from "@/next-auth";
import { CreateComment, DeleteComment, LikeComment, LoadMoreComment } from "@/actions/commentsAction";
import { useState } from "react";

export type PostListProps={
    postState:post[],
    currentSession?:ExtendedUser,
    userId:string,
    
}
export interface PostMutationContext {
    preveousPosts: InfiniteData<PostQueryPromise> | undefined;
}

export const usePostListMutation = (userId:string)=>{
    const queryClient = useQueryClient()
    const queryKey = ['posts', userId]
    const [isMutateSucces, setIsSuccesMutate]=useState(false)
        ///createPostMutation?
        const PostLikeMutation = useMutation({
            mutationFn: LikePost,
            onMutate: async (postId:string):Promise<PostMutationContext>=>{
                await queryClient.cancelQueries({queryKey});
                const preveousPosts = queryClient.getQueryData<InfiniteData<PostQueryPromise>>(queryKey);
                queryClient.setQueryData<InfiniteData<PostQueryPromise>>
                    (
                        queryKey,
                        (old)=>{
                            if(!old) return old 
                                return {
                                    ...old,
                                    pages:old.pages.map(page=>({
                                        ...page,
                                        data: page.data.map(post=>{
                                            if(post.PostId===postId){
                                                const changedCount = changeLikeCount(post)
                                                return changedCount
                                                }
                                                return post
                                            })
                                        }))
                                    }
                    })
                    return {preveousPosts}
                },
            onError:(err,postId,context)=>{
                if(context?.preveousPosts){
                    queryClient.setQueryData(queryKey,context.preveousPosts)
                }
            },
            onSettled:()=>{
                queryClient.invalidateQueries({queryKey})
            }
        });
        const deletePostMutation = useMutation({
            mutationFn:DeleteUserPosts,
            onSuccess: (data,variables,context)=>{
                const {postId} = variables;
                queryClient.setQueryData<InfiniteData<PostQueryPromise>>(
                    queryKey,
                    (old)=>{
                        if(!old) return old
                        return {
                            ...old,
                            pages:old.pages.map(page=>({
                                ...page,
                                data:page.data.filter(post=>post.PostId !==postId)
                            }))
                        }
                    })
            },
            onError:(err,variables,context)=>{
                if(err){
                    toast.error('ERROR!')
                }
            },
            onSettled:()=>{
                queryClient.invalidateQueries({queryKey})
            }
    
        });
        const createCommentMutation = useMutation({
            mutationFn:CreateComment,
            onSuccess: (newComment)=>{
                // const {comment,postId}=variables
                const existingData = queryClient.getQueryData<InfiniteData<PostQueryPromise>>(queryKey,
                )
    
    
                if(existingData){
                    const updatedData = {
                        ...existingData,
                        pages:existingData.pages.map(page=>({
                            ...page,
                            data:page.data.map(post=>{
                                if(post.PostId === newComment.createdComment.postId){
                                    return {
                                        ...post,
                                        comments:[newComment.createdComment,...post.comments]
                                    }
                                } 
                                return post
                                
                            })
                        }))
                    }
                    // console.log(updatedData)
                    queryClient.setQueryData(queryKey,updatedData)
                }
                return newComment
            },
            onError:(error,variables,context)=>{
                toast.error("ERROR")
                queryClient.invalidateQueries({queryKey:queryKey})

            },
            onSettled:()=>{
                queryClient.invalidateQueries({queryKey:queryKey})
                setIsSuccesMutate(false)
            }
    
    
        });
        const comentLikeMutation = useMutation({
            mutationFn:LikeComment,
            onMutate: async (CommentId:string):Promise<PostMutationContext>=>{
                await queryClient.cancelQueries({queryKey:queryKey});
                const preveousPosts = queryClient.getQueryData<InfiniteData<PostQueryPromise>>(queryKey);
                
                queryClient.setQueryData<InfiniteData<PostQueryPromise>>(
                    queryKey,
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
                    queryClient.setQueryData(queryKey,context.preveousPosts)
                }
            },
            // onSettled:()=>{
            //     queryClient.invalidateQueries({queryKey:queryKey})
            // }
        });
        const commentDeleteMutation = useMutation({
    
            mutationFn:DeleteComment,
            onSuccess: (data,variables,context)=>{
                const { commentId }=variables
                queryClient.setQueryData<InfiniteData<PostQueryPromise>>(queryKey,
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
                queryClient.invalidateQueries({queryKey:queryKey})
            }
    
        });
       const loadMoreCommentMutation = useMutation({
                  mutationFn:LoadMoreComment,
                  onSuccess: (newComment)=>{
                    // console.log("newComment",newComment)
                    if (!Array.isArray(newComment)) {
                        console.error("Unexpected response format", newComment);
                        return;
                    }
                    
                      // const {comment,postId}=variables
                      const existingData = queryClient.getQueryData<InfiniteData<PostQueryPromise>>(queryKey)
                    
                    
                      if(existingData){
                          const updatedData = {
                              ...existingData,
                              pages:existingData.pages.map(page=>({
                                  ...page,
                                  data:page.data.map(post=>{
                                    
                                      if(post.PostId === newComment[0].postId){
                                          return {
                                              ...post,
                                              comments: [...post.comments,...newComment]
                                          }
                                      } 
                                      return post
                                      
                                  })
                              }))
                          }
                        //   console.log("updateDAtaz",updatedData)
                          queryClient.setQueryData(queryKey,updatedData)
                      }
                    setIsSuccesMutate(true)
                    // console.log("updateDAtaz",isMutateSucces)

                      return newComment
                      
                  },
                  onError: (error, variables, context) => {
                    console.error("Mutation failed", { error, variables, context });
                    toast.error("Something went wrong!");
                }
                
                //   onMutate:()=>{
                //     setIsSuccesMutate(true)
                //   },
                //  

                //   onSettled:()=>{
                //     //   queryClient.invalidateQueries({queryKey:queryKey})
                //   }
          
          
              });
       
      
        return {
            deletePostMutation,
            PostLikeMutation,
            createCommentMutation,
            comentLikeMutation,
            commentDeleteMutation,
            loadMoreCommentMutation,
            queryKey,
            isMutateSucces
        }
}


