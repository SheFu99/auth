"use client"

import { RiDeleteBin5Line } from "react-icons/ri";
import ImageGrid from "../Image-grid";
import LikeButton from "../Like-button";
import RepostModalForm from "../repostForm";
import RepostHeader from "../Repost-author-header";
import { BiRepost } from "react-icons/bi";
import { post } from "@/components/types/globalTs";
import { ExtendedUser } from "@/next-auth";
import {  useRef, useState, useTransition } from "react";

import { toast } from "sonner";
import { awsBaseUrl } from "../private/UserPostList";
import { DeleteUserPosts, LikePost, postPromise } from "@/actions/UserPosts";
import { changeLikeCount } from "./lib/changeLikeCount";
import { FaCommentDots } from "react-icons/fa";
import CommentForm from "../../forms/CommentForm";

type PostCardProps={
    post:post,
    user?:ExtendedUser,
}


const PostCard:React.FC<PostCardProps> = ({post,user}) => {
    console.log(post.PostId)
    const [postState,setPost] = useState<post>(post)
    const [isPending,startTransition]=useTransition()
    const commentFormRef = useRef<HTMLTextAreaElement>(null)
    const postLikeAction = (postId:string)=>{
        console.log(postId)
        startTransition(()=>{
            LikePost(postId)
            .then((data)=>{
                setPost(prevState=>{

                const newPost = {...prevState};

                     newPost._count.likes = data.likesCount;
                     newPost.likedByUser = data.hasLike;

                     return newPost
             });
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
            const newPost = changeLikeCount(postState)
            setPost(newPost);
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
                        toast.success(data.message)
                    }
                })
                
            });
            // update()
        return 
        
        };

        const handleCommentOpen = ()=>{
            console.log(commentFormRef.current)
            if(commentFormRef.current){
                commentFormRef.current.focus()
                console.log('focus')
            }
        }

    return ( 
<div>
<div className=" justify-between border-t p-3  relative">
                
                <RepostHeader 
                    userId={post.userId}
                    userName={post.authorName}
                    userImage={post.authorAvatar}
                    timestamp={post.timestamp}
                />
                {post?.superText&&(
                    <p className="px-10 mt-2">{post.superText}</p>
                )}
                {post?.originPost?.authorName &&post?.originPost?.authorAvatar&&(
                <>
                    <div className="py-2 px-5">
                        <BiRepost color="white" className="scale-150"/>
                    </div>
              
                    <div className=" px-5 ">
                        <RepostHeader  
                            userId={post.originPost.userId}
                            userName={post.originPost.authorName}
                            userImage={post.originPost.authorAvatar}
                            timestamp={post.originPost.timestamp}
                            
                            />
                    </div>
                </>
                )}
        
                <div className="ml-[3rem] mr-[1rem]">
                    <p className="text-white col-span-10 col-start-2 py-2">{post.text}</p>
                        {user?.id === post.userId&&(
                            <button title="delete post"className="text-black" onClick={()=>deletePost(post)}><RiDeleteBin5Line color="white" className="scale-110  absolute top-2 right-2"/> </button>
                        )}
                            <ImageGrid images={post.image} className={`${user?.id===post.userId? '-mt-5':''}  mb-3`} />
                    <div className="flex gap-5 justify-between ">
              
                    </div>
                   
                </div>
        
                <div className="flex justify-between border-b border-t px-2 py-3 mt-2">
                        <LikeButton className=" bg-neutral-900 px-3" post={postState} onLike={()=>Postlike(post.PostId)} isPending={isPending}/>
                        <button title="comment" onClick={()=>handleCommentOpen()} className="text-white bg-neutral-900 px-3 rounded-md   ">
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
                <CommentForm 
                    user={user} 
                    postId={post?.PostId} 
                    forwardedRef={commentFormRef}
                    className=" mb-5"
                    />
</div>
       
     );
};
 
export default PostCard;