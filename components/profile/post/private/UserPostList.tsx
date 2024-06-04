
"use clinet"

import { DeleteUserPosts, GetUserPostsById, LikePost } from "@/actions/UserPosts";
import { useCurrentUser } from "@/hooks/use-current-user";
import React, {  Profiler, useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { RiDeleteBin5Line } from "react-icons/ri";
import ImageGrid from "../Image-grid";
import { FaCommentDots } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import LikeButton from "../Like-button";
import PostHeader from "../Post-header";
const InfiniteScroll = React.lazy(()=>import ('../functions/infinite-scroll'))
// import InfiniteScroll from "./post/functions/infinite-scroll";
import PostSkeleton from "../skeleton";
import { useSession } from "next-auth/react";
import CommentForm from "../../forms/CommentForm";
import { DeleteComment, LikeComment } from "@/actions/commentsAction";
import {debounce} from 'lodash'
import {  Comment, post } from "../../../types/globalTs";
import { repostAction, repostProps } from "@/actions/repost";
import RepostHeader from "../Repost-author-header";
import Link from "next/link";
import { changeLikeCount } from "../postCard/lib/changeLikeCount";
import PostList from "../postCard/lists/PostList";
const RepostModalForm = React.lazy(()=>import ('../repostForm'))
// import RepostForm from "./post/repostForm"


export const awsBaseUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/`

type userListProps ={
    profile?:string;
    totalPostCount:number;
    setTotalCount?:(count:number)=>void;
    serverPosts?:post
}

const UserPostList :React.FC<userListProps> = ({profile,totalPostCount,serverPosts,setTotalCount}) => {
    console.log('rednder')
const [posts, setPosts]=useState<post[]>()
const [isOpen,setIsOpen]=useState<boolean>(false)
const [isPending,startTransition]=useTransition()
const [addComent,setComentState]=useState([])

const {update}=useSession()

const [hasMore,setHasMore]= useState<boolean>(true)
const [page,setPage]=useState<number>(1)

const user = useCurrentUser()

// useEffect(()=>{console.log(posts)},[posts])

///load user post from server 
const debouncedGetPost = useCallback(()=>{
    GetUserPostsById(profile,1).then(posts => {setTotalCount(posts?.totalPostCount),setPosts(posts?.posts)})
    console.log('GET_ON_SERVER')
},[profile])

    useEffect(()=>{
        debouncedGetPost()
    },[profile])

  
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
    const Postlike = async (postId: string) => {
        if (!user) {
            toast.error("You must be authorized");
            return;
        }
        // Optimistic UI Update
        const newPosts = posts?.map(post => {
            if (post.PostId === postId) {
                
                const changedCount = changeLikeCount(post)
                return changedCount
                // Toggle like status and adjust like count optimistically
                // if (post?.likedByUser===true) {
                   
                //     return { 
                //         ...post, 
                //         likedByUser: false, 
                //             _count:{
                //                 ...post._count,
                //                 likes: post._count.likes - 1 
                //             } 
                //         };
                //     } else {
                //         return { ...post, likedByUser: true, 
                //             _count:{
                //             ...post._count,
                //             likes: post._count.likes + 1 
                //             }  
                //         };
                //     }
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
    const CommentLike = async (comment:Comment) => {
        const commentId = comment.CommentId
        if (!user) {
            toast.error("You must be authorized");
            return;
        }
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
       
            update()
        return 
        
        };
        const fetchMoreData = async ()=>{
            ///gettFrom server posts.lenght 
            if(posts?.length>=totalPostCount){
                setHasMore(false)
                return
            }

            GetUserPostsById(profile,page)
            .then(posts=>setPosts(prev=>[...prev,...posts?.posts]))
            .catch(err=>{
                toast.error(err)
            })
            .finally(()=>setPage(page+1))
        };
        const openComentForm = (postIndex:number)=>{
            const isTwice = addComent.filter(item=>item ===postIndex)
            if(isTwice.length>0){
                const isNotTwice = addComent.filter(item=>item !==postIndex);
                setComentState(isNotTwice)
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
        const DeleteCommentFunction = (comment:Comment) =>{
            const keys:any = comment.image.map(item => {
                const result = item.url.split(awsBaseUrl)[1];
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

        const repost = ({postId,superText}:repostProps)=>{
            // startTransition(()=>{
            //     repostAction({postId:postId,superText:superText})
            //     .then((response)=>{
            //         if(response.success){
            //             toast.success('Now this post will display on your page')
            //         }else{
            //             toast.error(`Something went wrong: ${response.error}`)
            //         }
            //     })

            // })
            setIsOpen(!isOpen)
         
            
        }
       

    return ( 
        <div className="bg-opacity-0  space-y-5 p-1">
              {!posts&&profile&&(
                    <div className="w-full flex justify-center py-10 items-center align-middle">
                        <p className=" text-neutral-500">The user has no posts...</p>
                    </div>
                )}
            <InfiniteScroll page={page} loadMore={fetchMoreData} hasMore={hasMore} isloaded = {!!posts}>
            {posts&&(
                 <PostList
                 // key={index}
                 setPost={setPosts}
                 postState={posts} 
                 user={user}
                 />
            )}
           
           </InfiniteScroll>

        </div>
     );
}
 
export default UserPostList;

