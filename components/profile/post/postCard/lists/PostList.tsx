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
import { DeleteUserPosts, LikePost, postPromise } from "@/actions/UserPosts";
import { changeLikeCount } from "../lib/changeLikeCount";
import { FaCommentDots } from "react-icons/fa";
import CommentForm from "../../../forms/CommentForm";
import Comments from "./Comments";
import OneComment from "../Commnet";
import Link from "next/link";
import { useRouter } from "next/navigation";

type PostListProps={
    postState:post[],
    user?:ExtendedUser,
    setPost?:(postState:post[])=>void
    
}


const PostList:React.FC<PostListProps> = ({setPost,postState,user}) => {
    // const [postState,setPost] = useState<post>(post)
    const [isPending,startTransition]=useTransition()
    const [addComent,setComentState]=useState([])
    const commentFormRef = useRef<HTMLTextAreaElement>(null)
    const router = useRouter()
    const observer = useRef<IntersectionObserver|null>()
   

    
    const postLikeAction = (postId:string)=>{
        startTransition(()=>{
            LikePost(postId)
            .then((data)=>{
                if(data.success){
                    const checkedState = postState.map(post=>{
                        if(data.PostId === post.PostId){
                            const likedPost = {
                                ...post,
                                likedByUser:data.hasLike,
                                _count:{
                                    likes:data.likesCount
                                }
                        }
                        return  likedPost 
                    }
                    return post
                    })
                    
                    setPost(checkedState)
                }
                if(data.error){
                    toast.error(data.error)
                }
            }).catch(err=>{
                toast.error(err)
            })
        })
    };
    const Postlike =  (postId: string) => {
        if (!user) {
            toast.error("You must be authorized");
            return;
        }
        const newPosts = postState?.map(post => {
            if(post.PostId===postId){
                const changedCount = changeLikeCount(post)
                return changedCount
            }else{
                return post
            }
        })
            setPost(newPosts);
            postLikeAction(postId);
        
        // }finally{
        //     updatePost(!getPostTrigger)
        // }
    };
        const deletePost=(post:post)=>{
            const keys = post.image.map(item => {
                const result = item.url.replace(awsBaseUrl,'');
                return result
              });

            startTransition(()=>{
                DeleteUserPosts({
                    postId:post.PostId,
                    keys:post?.originPostId ? undefined:keys,
                })
                .then((data)=>{
                    if(data.error){
                        toast.error(data.error)
                    }
                    if(data.success){
                        console.log(data)
                        const optimisticPostState = postState.filter(prev=>{
                                return prev.PostId !==post.PostId
                        })
                        setComentState([])
                        setPost(optimisticPostState)

                        toast.success(data.message)
                    }
                })
                
            });
        return 
        };
        const openComentForm = (postIndex:number,postId)=>{
           
            const isTwice = addComent.filter(item=>item ===postIndex)
            if(isTwice.length>0){
                const href = `/post/${postId}`
                router.push(href)
            }else{
                setComentState(prev=>[...prev,postIndex])
            }
        };
        const isPostCommentOpen =(index:number)=>{
            const isExistInArray = addComent.filter(item=>item ===index)
            if(isExistInArray.length>0){
                return true
            }else{
                return false
            }
        };
        const handleCommentOpen = ()=>{
            console.log(commentFormRef.current)
            if(commentFormRef.current){
                commentFormRef.current.focus()
                console.log('focus')
            }
        };   
        const commentStateWrapper = (postId,newComment)=>{
            console.log(postState)
            console.log(newComment.length)
            const newPostState = postState.map(post=>{
                if(post.PostId === postId) {
                    return {
                        ...post,
                        comments:newComment
                    }
                }else{
                    return post
                }
            })
            setPost(newPostState)
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
                            userId={post.originPost.user.userId}
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
                        {user?.id === post.userId&&(
                            <button title="delete post"className="text-black" onClick={()=>deletePost(post)}><RiDeleteBin5Line color="white" className="scale-110  absolute top-2 right-2"/> </button>
                        )}
                        <div className="">
                            <ImageGrid images={post.image} className={`${user?.id===post.userId? '-mt-5':''}  mb-3`} />
                    
                        </div>
                   
                </div>
        
                <div className="flex justify-between  px-2 py-3 mt-2">
                        <LikeButton className=" bg-neutral-900 px-3" post={post} onLike={()=>Postlike(post.PostId)} isPending={isPending}/>
                        <button title="comment" onClick={()=>openComentForm(index,post.PostId)} className="text-white bg-neutral-900 px-3 rounded-md   ">
                        
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

        {isPostCommentOpen(index)&&(
            <div className={`border-t `} >
                <CommentForm 
                user={user} 
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
                            user={user} 
                            comment={comment} 
                            commentState={post.comments} 
                            setComment={(newComments)=>commentStateWrapper(post.PostId,newComments)} 
                        />
                        
                    </div>
                </div>
                ))}
                {post?._count?.comments>post?.comments.length&&(
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