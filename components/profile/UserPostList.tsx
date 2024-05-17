
"use clinet"
import { DeleteUserPosts, LikePost } from "@/actions/UserPosts";
import { useCurrentUser } from "@/hooks/use-current-user";
import React, { Profiler, useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { RiDeleteBin5Line } from "react-icons/ri";
import ImageGrid from "./post/Image-grid";
import { FaCommentDots } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import LikeButton from "./post/Like-button";
import PostHeader from "./post/Post-header";
import GetPost from "./post/functions/get-post";
const InfiniteScroll = React.lazy(()=>import ('./post/functions/infinite-scroll'))
// import InfiniteScroll from "./post/functions/infinite-scroll";
import PostSkeleton from "./post/skeleton";
import { useSession } from "next-auth/react";
import CommentForm from "./forms/CommentForm";
import { DeleteComment, LikeComment } from "@/actions/commentsAction";
import IsUserAuthToast from "./post/functions/ifUserPermissions";
import {debounce} from 'lodash'
import { comments, post } from "../types/globalTs";



const UserPostList  = (profile:any) => {

const [posts, setPosts]=useState<post[]>()
const [comment,setComment]=useState<comments>()

const [isPending,startTransition]=useTransition()
const [addComent,setComentState]=useState([])
const {update}=useSession()

const [hasMore,setHasMore]= useState<boolean>(true)
const [page,setPage]=useState<number>(1)
const [totalPostCount,setTotalCount]=useState<number>(0)

const user = useCurrentUser()
const splitUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/`

///load user post from server 
const debouncedGetPost = useCallback(debounce(()=>{
    GetPost(profile, user?.id,1).then(posts => {setTotalCount(posts?.totalPostCount),setPosts(posts?.posts)})
},1000),[])
    useEffect(()=>{
        debouncedGetPost()
    },[update])
///
  
    const postLikeAction = (postId:string)=>{
        startTransition(()=>{
            LikePost(postId)
            .then((data)=>{
                setPosts(currentPosts=>
                    currentPosts.map(post=>
                        post.PostId === postId?{ ...post,likeCount:data.likesCount}:post
                    )
                )
                if(data.error){
                    toast.error(data.error)
                }
            })
        })
    };
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
    }

    const CommentLike = async (comment) => {
        const commentId = comment.CommentId
        IsUserAuthToast(user);
    
        // Find the post containing the comment
        const updatedPosts = posts.map((post) => {
            if (post.PostId !== comment.postId) {
                return post; // No changes for posts that don't contain the comment
            }
    
            // Find the comment within the post
            const updatedComments = post.comments.map((com) => {
                if (com.CommentId !== commentId) {
                    return com; // No changes for other comments
                }
    
                // Update the comment here
                return {
                    ...com,
                    likedByUser: !com.likedByUser,
                    _count: {
                        ...com._count,
                        likes: com.likedByUser ? com._count.likes - 1 : com._count.likes + 1
                    }
                };
            });
    
            // Return the updated post with the updated comments
            return {
                ...post,
                comments: updatedComments
            };
        });

        setPosts(updatedPosts);
        try {
            commentLikeAction(commentId);
        } catch (error) {
            console.error("Failed to update like status on the server:", error);
            update()
            toast.error("Error updating post like. Please try again.");
        }
    };

    const Postlike = async (postId: string) => {
        IsUserAuthToast(user)
        // Optimistic UI Update
        const newPosts = posts?.map(post => {
            if (post.PostId === postId) {
                

                // Toggle like status and adjust like count optimistically
                if (post?.likedByUser===true) {
                   
                    return { 
                        ...post, 
                        likedByUser: false, 
                            _count:{
                                ...post._count,
                                likes: post._count.likes - 1 
                            } 
                        };
                    } else {
                        return { ...post, likedByUser: true, 
                            _count:{
                            ...post._count,
                            likes: post._count.likes + 1 
                            }  
                        };
                    }
            }
            return post;
        });
    
        setPosts(newPosts);
       
        try {
            postLikeAction(postId);
        } catch (error) {
            console.error("Failed to update like status on the server:", error);
            update()
            toast.error("Error updating post like. Please try again.");
        }
        // }finally{
        //     updatePost(!getPostTrigger)
        // }
    };

        const deletePost=(post:any)=>{
      
            const keys = post.image.map(item => {
                console.log(item.url)
                const result = item.url.split(splitUrl)[1];
                return result
              });
            startTransition(()=>{
    
                DeleteUserPosts(post.PostId,keys)
                .then((data)=>{
                    if(data.error){
                        toast.error(data.error)
                    }
        
                    if(data.success){
                        
                        toast.success(data.message)
                    }
                })
                
            });
       
            update()
        return 
        
        };
        const fetchMoreData = async ()=>{
            ///gettFrom server posts.lenght 
            if(posts.length>=totalPostCount){
                setHasMore(false)
                return
            }
                try {
                    await GetPost(profile,user?.id,page+1).then(posts=>setPosts(prev=>[...prev,...posts.posts])).finally(()=>setPage(page+1))
                    
                } catch (error) {
                    console.log(error)
                    return
                }
           
            
        };

        const openComentForm = (postIndex)=>{
            const isTwice = addComent.filter(item=>item ===postIndex)
            if(isTwice.length>0){
                const isNotTwice = addComent.filter(item=>item !==postIndex);
                setComentState(isNotTwice)
            }else{
                setComentState(prev=>[...prev,postIndex])
            }
        };
        const isPostCommentOpen =(index)=>{
            const isExistInArray = addComent.filter(item=>item ===index)
            if(isExistInArray.length>0){
                return true
            }else{
                return false
            }
        };
        const DeleteCommentFunction = (comment) =>{
            const keys = comment.image.map(item => {
                const result = item.url.split(splitUrl)[1];
                return result
              });


            startTransition(()=>{
                DeleteComment(comment.CommentId,keys)
                .then((data)=>{
                    if(data.success){
                        toast.success(data.success)
                        update()
                    }
                    if(data.error){
                        toast.success(data.error)
                    }
                })
            })

        };

    return ( 
        <div className="bg-opacity-0  space-y-5 p-1">
            <PostSkeleton isLoading={!posts?.length}/>
            <InfiniteScroll loadMore={fetchMoreData} hasMore={hasMore} isloaded = {!!posts}>
            {posts?.map((post,index)=>(
                <>
                {/* TODO: Need to pass key to parent component  */}
                <div key={index} className=" justify-between border border-white rounded-md p-3  relative">
                
                    <PostHeader author={post.author} timestamp={post.timestamp}/>
                    <div className="ml-[3rem] mr-[1rem]">
                        <p className="text-white col-span-10 col-start-2 ">{post.text}</p>
                            {user?.id === post.userId&&(
                                <button title="delete post"className="text-black" onClick={()=>deletePost(post)}><RiDeleteBin5Line color="white" className="scale-110  absolute top-2 right-2"/> </button>
                            )}
                                <ImageGrid images={post.image} />
                        <div className="flex gap-5 justify-between ">
                            <LikeButton className=" bg-neutral-900 px-3" post={post} onLike={()=>Postlike(post.PostId)} isPending={isPending}/>

                            <button title="coment" onClick={()=>openComentForm(index)} className="text-white  bg-neutral-900 px-3 rounded-md p-2 mt-5 ">
                                <div className="flex gap-2 item-center justify-center align-middle">
                                    <FaCommentDots className="mt-1"/>
                                {post._count.comments>0&&(<p>{post?._count.comments}</p>)}
                                </div>
                            </button>

                            <button title= 'repost' className="text-white bg-neutral-900 px-3 rounded-md p-2 mt-5  ">
                                <BiRepost className="scale-150"/>
                            </button>
                        </div>
                    </div>


                    {post?.comments.map((comment,index)=>(
                        <div key={index} className="md:px-20 px-10 mt-5">
                            {user?.id === comment.userId&&(
                                <button title="delete commetn" 
                                className="text-black absolute md:right-20 right-10"
                                onClick={()=>DeleteCommentFunction(comment)}
                                >
                                    <RiDeleteBin5Line color="white"/>
                                </button>
                            )}
                            <PostHeader author={comment?.user} timestamp={comment?.timestamp}/>
                                
                            <p className="text-white ml-[3rem]">{comment?.text}</p>
                            
                            <ImageGrid images={comment?.image} className={'max-w-[300px] ml-[3rem]'}/>
                            <LikeButton className="bg-neutral-900 px-3" post={comment} onLike={()=>CommentLike(comment)} isPending={isPending}/>
                        </div>
                    ))}
                    {isPostCommentOpen(index)&&(
                            <CommentForm postId={post?.PostId}/>
                    )}
                   
                </div>
               
                </>
            ))}
           </InfiniteScroll>

        </div>
     );
}
 
export default UserPostList;

