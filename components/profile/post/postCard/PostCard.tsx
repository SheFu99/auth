"use client"

import { RiDeleteBin5Line } from "react-icons/ri";
import ImageGrid from "../Image-grid";
import LikeButton from "../Like-button";
import RepostModalForm from "../repostForm";
import RepostHeader from "../Repost-author-header";
import { BiRepost } from "react-icons/bi";
import { post } from "@/components/types/globalTs";
import { ExtendedUser } from "@/next-auth";
import {  useRef, useTransition } from "react";

import { toast } from "sonner";

import { DeleteUserPosts, LikePost } from "@/actions/UserPosts";
import { changeLikeCount } from "./lib/changeLikeCount";
import { FaCommentDots } from "react-icons/fa";
import CommentForm from "../../forms/CommentForm";
import { awsBaseUrl } from "./lists/InfinitePostList";
import { usePostCommentMutations } from "./lib/singlePostMutations";
import { usePost } from "../lib/usePost";
import { Query, useMutation, useQueryClient } from "@tanstack/react-query";
import htmlParser from 'html-react-parser';
import convertMentionsToLinks from "./helpers/convertMentionsToLink";


type PostCardWithStateProps={
    postId:string,
    currentUser?:ExtendedUser,
    userId?:string,
    postState?:any,
    
}


const PostCard:React.FC<PostCardWithStateProps> = ({postId,currentUser,userId}) => {
    const {data}=usePost(postId)
    const post:post = data
    const queryClient= useQueryClient()
    const queryKey = ['post',postId]
    const postLikeAction = useMutation({
        mutationFn:LikePost,
        onMutate: async (postId:string)=>{
            await queryClient.cancelQueries({queryKey})
            const preveousPost = queryClient.getQueryData<post>(queryKey)

            const newPostState = changeLikeCount(preveousPost)
            console.log(newPostState)
            queryClient.setQueryData(queryKey,newPostState)
            return preveousPost
        },
        onError(error, variables, context) {
            if(context){
                queryClient.setQueryData(queryKey,context)
            }
        },
        onSettled:()=>{
            queryClient.invalidateQueries({queryKey})
        }
    })
    // const [postState,setPost] = useState<post>(post)
    const [isPending,startTransition]=useTransition()
    const commentFormRef = useRef<HTMLTextAreaElement>(null)
    const {createComment}=usePostCommentMutations(postId)
    const firstImage = post.image[0]
    
  


    const Postlike =  (postId: string) => {
        if (!currentUser) {
            toast.error("You need to be authorized!");
            return;
        }
            postLikeAction.mutateAsync(postId);
        
    };
        const deletePost=(post:post)=>{
            ///TODO: add redirect to back 
        
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
  
        {post&&(
            <>
           
                <article >
                <div className=" justify-between border border-neutral-400 p-3 rounded-md  relative hover:bg-neutral-900 ">
                    
                    <RepostHeader 
                        userId={post.user.id}
                        userName={post.user.name}
                        userImage={post.user.image}
                        timestamp={post.timestamp}
                    />
                    {post?.superText&&(
                        <h1 className="px-10 mt-2">{htmlParser(convertMentionsToLinks(post.superText))}</h1>
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
                                userImage={post.originPost.user.image}
                                timestamp={post.originPost.timestamp}
                                
                                />
                        </div>
                    </>
                    )}
            
                    <div className="ml-[3rem] mr-[1rem]">
                        <h2 className="text-white col-span-10 col-start-2 py-2 text-xl">{htmlParser(post.text)}</h2>
                            {currentUser?.id === post.userId&&(
                                <button title="delete post"className="text-black" onClick={()=>deletePost(post)}><RiDeleteBin5Line color="white" className="scale-110  absolute top-2 right-2"/> </button>
                            )}
                                <ImageGrid images={post.image} className={`${currentUser?.id===post.userId? '-mt-5':''}  mb-3`} />
                        <div className="flex gap-5 justify-between ">
                  
                        </div>
                       
                    </div>
            
                    <div className="flex justify-between  px-2 py-3 mt-2">
                            <LikeButton className=" bg-neutral-900 px-3" post={post} onLike={()=>Postlike(post.PostId)} isPending={isPending}/>
                            <button title="comment" onClick={()=>handleCommentOpen()} className="text-white bg-neutral-900 px-3 rounded-md   ">
                                <div className="flex gap-2 item-center justify-center align-middle">
                                    <FaCommentDots className="mt-1"/>
                                {post?._count?.comments>0 &&(<p>{post?._count?.comments}</p>)}
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
                        currentSession={currentUser} 
                        userId={currentUser?.id}
                        postId={post?.PostId} 
                        forwardedRef={commentFormRef}
                        onCreate={createComment.mutateAsync}
                        className=" mb-5  border-b border-t"
                        />
    
            </article>
            </>
        )}
        
                
</div>
       
     );
};
 
export default PostCard;