"use client"

import { RiDeleteBin5Line } from "react-icons/ri";
import ImageGrid from "../../Image-grid";
import LikeButton from "../../Like-button";
import RepostModalForm from "../../repostForm";
import RepostHeader from "../../Repost-author-header";
import { BiRepost } from "react-icons/bi";
import { post } from "@/components/types/globalTs";
import { ExtendedUser } from "@/next-auth";
import {  useCallback, useRef, useState, useTransition } from "react";

import { toast } from "sonner";
import { awsBaseUrl } from "../../private/UserPostList";
import { DeleteUserPosts, LikePost, LikePostPromise, postPromise } from "@/actions/UserPosts";
import { changeLikeCount } from "../lib/changeLikeCount";
import { FaCommentDots } from "react-icons/fa";
import CommentForm from "../../../forms/CommentForm";
import Comments from "./Comments";
import OneComment from "../Commnet";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { PostPromise, usePosts } from "../../lib/usePost";

type PostListProps={
    postState:post[],
    currentSession?:ExtendedUser,
    userId:string,
    
}
export interface MutationContext {
    preveousPosts: InfiniteData<PostPromise> | undefined;
}


const PostList:React.FC<PostListProps> = ({postState,currentSession,userId}) => {
    // const [postState,setPost] = useState<post>(post)
    const [isPending,startTransition]=useTransition()
    const [addComent,setComentState]=useState([])
    const commentFormRef = useRef<HTMLTextAreaElement>(null)
    const router = useRouter()
    // const observer = useRef<IntersectionObserver|null>()

    const {data,isError,isLoading}=usePosts(userId)
    const queryClient = useQueryClient()
  
    const queryKey = ['posts', userId]
    const PostLikeMutation = useMutation({
        mutationFn: LikePost,
        onMutate: async (postId:string):Promise<MutationContext>=>{
            await queryClient.cancelQueries({queryKey});
            const preveousPosts = queryClient.getQueryData<InfiniteData<PostPromise>>(queryKey);
            queryClient.setQueryData<InfiniteData<PostPromise>>
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
            queryClient.setQueryData<InfiniteData<PostPromise>>(
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
                    
        const Postlike =  (postId: string) => {
            if (!currentSession) {
                toast.error("You must be authorized");
                return;
            }
                PostLikeMutation.mutateAsync(postId); 
        };
        const deletePost=(post:post)=>{
            const keys = post.image.map(item => {
                const result = item.url.replace(awsBaseUrl,'');
                return result
              });

              deletePostMutation.mutateAsync({postId:post.PostId,keys:keys})
        return 
        };
        const openComentForm = (postId:string)=>{
           
            const isTwice = addComent.filter(item=>item ===postId)
            if(isTwice.length>0){
                const href = `/post/${postId}`
                router.push(href)
            }else{
                setComentState(prev=>[...prev,postId])
            }
        };
        const isPostCommentOpen =(postId:string)=>{
            const isExistInArray = addComent.filter(item=>item ===postId)
            if(isExistInArray.length>0){
                return true
            }else{
                return false
            }
        };
        const handleWhiteSpaceClick = (e, postId)=>{
            if(e.currentTarget === e.target){
                console.log("Parent Clicked")
                router.push(`/post/${postId}`)
            }
        };
        const handleCommentClick = (e,postId)=>{
            if(e.currentTarget === e.target){
                console.log("Parent Clicked")
                router.push(`/post/${postId}`)
            }
        };

    return ( 
<div className="borde px-2">

    
    {postState.map((post,index)=>(
        <div key={index} className="border border-neutral-500 rounded-md mb-4 mt-3">
            <div 
                className=" justify-between  p-3 rounded-md  relative hover:bg-neutral-900 cursor-pointer"
                onClick={(e)=>handleWhiteSpaceClick(e,post.PostId)}
                >
                <RepostHeader 
                    userId={post.userId}
                    userName={post.user.name}
                    userImage={post?.user.image}
                    timestamp={post.timestamp}
                    className="max-w-[250px]"
                />
                {post?.superText&&(
                    <p className="px-10 mt-2">{post.superText}</p>
                )}
                {post?.originPost?.user.name &&post?.originPost?.user.image&&(
                <>
                    <div className="py-2 px-5">
                        <BiRepost color="white" className="scale-150"/>
                    </div>
              
                    <div className=" px-5 ">
                        <RepostHeader  
                            userId={post.originPost.user.id}
                            userName={post.originPost.user.name}
                            userImage={post.originPost?.user.image}
                            timestamp={post.originPost.timestamp}
                            className="max-w-[250px]"
                            />
                    </div>
                </>
                )}
        
                <div className="ml-[3rem] mr-[1rem]">
                    <p className="text-white text-xl col-span-10 col-start-2 mt-5">{post.text}</p>
                        {currentSession?.id === post.userId&&(
                            <button title="delete post"className="text-black" onClick={()=>deletePost(post)}><RiDeleteBin5Line color="white" className="scale-110  absolute top-2 right-2"/> </button>
                        )}
                        <div className="">
                            <ImageGrid images={post.image} className={`${currentSession?.id===post.userId? '-mt-5':''}  mb-3`} />
                    
                        </div>
                   
                </div>
        
                <div className="flex justify-between  px-2 py-3 mt-2">
                        <LikeButton className=" bg-neutral-900 px-3" post={post} onLike={()=>Postlike(post.PostId)} isPending={isPending}/>
                        <button title="comment" onClick={()=>openComentForm(post.PostId)} className="text-white bg-neutral-900 px-3 rounded-md   ">
                        
                            <div className="flex gap-2 item-center justify-center align-middle">
                                <FaCommentDots className="mt-1"/>
                            {post._count.comments>0 &&(<p>{post?._count.comments}</p>)}
                            </div>

                        </button>
                        <RepostModalForm
                            ButtonTitle="Repost"
                            postId={post.PostId}
                            repostCount={post?.repostCount}
                            />
                </div>
                
 
            </div>

        {isPostCommentOpen(post.PostId)&&(
            <div className={`border-t `} >
                <CommentForm 
                currentSession={currentSession} 
                userId={userId}
                postId={post?.PostId} 
                forwardedRef={commentFormRef}
                className=" mb-1 "
                />
            </div>
        )}
              
                {post?.comments?.map((comment,index)=>(
                 <div 
                    className="border-t px-10  cursor-pointer"
                    onClick={(e)=>handleCommentClick(e,comment.postId)}
                    key={index}
                    >
                                    
                    <div className="relative mt-5 ">
                    
                        <OneComment 
                            index={index}
                            currentSession={currentSession} 
                            comment={comment} 
                            commentState={post.comments}  
                            userId={userId}
                        />
                        
                    </div>
                </div>
                ))}
                {post?._count?.comments>post?.comments?.length&&(
                    <div className="w-full flex justify-center p-2 cursor-pointer border-t hover:bg-neutral-900 mb-1">
                        <p className="text-neutral-100 hover:text-white " onClick={(e)=>handleCommentClick(e,post.PostId)}>Read more...</p>
                    </div>
                )}
        </div>
    ))}
                
</div>
       
     );
};
 
export default PostList;