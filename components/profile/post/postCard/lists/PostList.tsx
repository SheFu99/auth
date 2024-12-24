"use client"

import { RiDeleteBin5Line } from "react-icons/ri";
import ImageGrid from "../../Image-grid";
import LikeButton from "../../Like-button";
import RepostModalForm from "../../repostForm";
import RepostHeader from "../../Repost-author-header";
import { BiRepost } from "react-icons/bi";
import { post } from "@/components/types/globalTs";
import React ,{useRef, useState} from "react";
import { toast } from "sonner";
import { FaCommentDots } from "react-icons/fa";
import CommentForm from "../../../forms/CommentForm";
import OneComment from "../OneComment";
import { useRouter } from "next/navigation";
import {  usePostList } from "../../lib/usePost";
import { PostListProps, usePostListMutation }  from '../mutations/postListMutations'
import { awsBaseUrl } from "./InfinitePostList";
import convertMentionsToLinks from "../helpers/convertMentionsToLink";
import htmlParser from 'html-react-parser';
import InViewWrapper from "../helpers/inViewWrapper";



const PostList:React.FC<PostListProps> = ({postState,currentSession,userId}) => {
   
    const [addComent,setComentState]=useState([])
    const commentFormRef = useRef<HTMLTextAreaElement>(null)
    const router = useRouter()
    const {data,isError,isLoading}=usePostList(userId)
    const {
        PostLikeMutation,
        deletePostMutation,
        createCommentMutation,
        comentLikeMutation,
        commentDeleteMutation}=usePostListMutation(userId)

        const Postlike =  (postId: string) => {
            if (!currentSession) {
                toast.error("You need to be authorized");
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
                <div>
                    {postState.map((post)=>(
                           <InViewWrapper key={post.PostId} thresholdPixels={100}>
                           {(inView)=>(
                                <article
                                    className={`
                                        transition-transform duration-300
                                        ${inView? '' : 'scale-95'}
                                        border
                                        border-neutral-500
                                        rounded-md mb-4 mt-3`}
                                    >
                                    <div
                                        className={`
                                            justify-between
                                            p-3 rounded-md
                                            relative
                                            hover:bg-neutral-900 cursor-pointer`}
                                        onClick={(e)=>handleWhiteSpaceClick(e,post.PostId)}
                                        // ref={articleRef}
                                        >
                            
                                        <RepostHeader
                                            userId={post?.user.id}
                                            userName={post?.user.name}
                                            userImage={post?.user.image}
                                            timestamp={post?.timestamp}
                                            className="max-w-[250px]"
                                        />
                                        {post?.superText&&(
                                            <p className="px-10 mt-2">{htmlParser(convertMentionsToLinks(post.superText))}</p>
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
                                            <p className="text-white text-xl col-span-10 col-start-2 mt-5">{htmlParser(convertMentionsToLinks(post?.text))}</p>
                                                {currentSession?.id === post?.userId&&(
                                                    <button title="delete post"className="text-black" onClick={()=>deletePost(post)}><RiDeleteBin5Line color="white" className="scale-110  absolute top-2 right-2"/> </button>
                                                )}
                                                <div className="">
                                                    <ImageGrid images={post?.image} className={`${currentSession?.id===post?.userId? '-mt-5':''}  mb-3`} />
                                                </div>
                            
                                        </div>
                            
                                        <div className="flex justify-between  px-2 py-3 mt-2">
                                                <LikeButton className=" bg-neutral-900 px-3" post={post} onLike={()=>Postlike(post.PostId)} isPending={isLoading}/>
                                                <button title="comment" onClick={()=>openComentForm(post.PostId)} className="text-white bg-neutral-900 px-3 rounded-md   ">
                            
                                                    <div className="flex gap-2 item-center justify-center align-middle">
                                                        <FaCommentDots className="mt-1"/>
                                                    {post?._count?.comments>0 &&(<p>{post?._count.comments}</p>)}
                                                    </div>
                                                </button>
                                                <RepostModalForm
                                                    ButtonTitle="Repost"
                                                    postId={post?.PostId}
                                                    repostCount={post?.repostCount}
                                                    />
                                        </div>
                            
                                    </div>
                                {isPostCommentOpen(post?.PostId)&&(
                                    <div className={`border-t `} >
                                        <CommentForm
                                        currentSession={currentSession}
                                        userId={userId}
                                        postId={post?.PostId}
                                        forwardedRef={commentFormRef}
                                        className=" mb-1 "
                                        onCreate={createCommentMutation.mutateAsync}
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
                                                    userId={userId}
                                                    onDelete={commentDeleteMutation.mutateAsync}
                                                    onLike={comentLikeMutation.mutateAsync}
                                                />
                            
                                            </div>
                                        </div>
                                        ))}
                                        {post?._count?.comments>post?.comments?.length&&(
                                            <div className="w-full flex justify-center p-2 cursor-pointer border-t hover:bg-neutral-900 mb-1">
                                                <p className="text-neutral-100 hover:text-white " onClick={(e)=>handleCommentClick(e,post.PostId)}>Read more...</p>
                                            </div>
                                        )}
                                </article>
                           )}
                       </InViewWrapper>   
                    ))}
                </div>
            
        );
            
             
}
 
export default PostList;