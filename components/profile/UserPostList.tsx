
"use clinet"
import { DeleteUserPosts, LikePost } from "@/actions/UserPosts";
import { useCurrentUser } from "@/hooks/use-current-user";
import React, { Profiler, useEffect, useState, useTransition } from "react";
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
import UserPostForm from "./forms/UserPostForm";
import { useUpdatePosts } from "@/hooks/use-current-profile";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import CommentForm from "./forms/CommentForm";

type post ={
    PostId: string,
    image?: image[],
    text: string,
    timestamp: Date,
    userId: string,
    likeCount: number,
    likes?:any[]
    likedByUser?:boolean,
    author:{
        Name:string,
        Image:string,
    },
    comments:any[]
    
}
type image ={
    url:string
    inedx:number
}

const UserPostList  = (profile:any) => {

const [posts, setPosts]=useState<post[]>()
const [isPending,startTransition]=useTransition()
const [addComent,setComentState]=useState([])
const {update}=useSession()

const [hasMore,setHasMore]= useState<boolean>(true)
const [page,setPage]=useState<number>(1)
const [totalPostCount,setTotalCount]=useState<number>(0)

const user = useCurrentUser()


///load user post from server 
    useEffect(()=>{
        console.log('TRIGGERED')
        GetPost(profile, user?.id,1).then(posts => {setTotalCount(posts?.totalPostCount),setPosts(posts?.posts)})
        console.log(posts)
        // GetPost(profile,user.id,1).then(posts => console.log(posts))

    },[update])
    ///
  
   
    // useEffect(()=>{console.log(posts)},[posts])
  
    const serverLikeaction = (postId:string)=>{
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
    }
    const like = async (postId: string) => {
        if (!user) {
            toast.error("You must be authorized");
            return;
        }
    
        // Optimistic UI Update
        const newPosts = posts?.map(post => {
            if (post.PostId === postId) {
                // Toggle like status and adjust like count optimistically
                if (post?.likedByUser===true) {
                    return { ...post, likedByUser: false, likeCount: post.likeCount - 1 };
                } else {
                    return { ...post, likedByUser: true, likeCount: post.likeCount + 1 };
                }
            }
            return post;
        });
    
        setPosts(newPosts);
       
        try {
            await serverLikeaction(postId);
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
                const splitUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/`
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
           
            
        }

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

    return ( 
        <div className="bg-opacity-0  space-y-5 p-1">
            <PostSkeleton isLoading={!posts?.length}/>
            <InfiniteScroll loadMore={fetchMoreData} hasMore={hasMore} isloaded = {!!posts}>
            {posts?.map((post,index)=>(
                <>
                <div key={index} className=" justify-between border border-white rounded-md p-3  relative">
                    <PostHeader author={post.author} timestamp={post.timestamp}/>
                    <div className="ml-[3rem] mr-[1rem]">
                        <p className="text-white col-span-10 col-start-2 ">{post.text}</p>
                            {user?.id === post.userId&&(
                                <button title="delete post"className="text-black" onClick={()=>deletePost(post)}><RiDeleteBin5Line color="white" className="scale-110  absolute top-2 right-2"/> </button>
                            )}
                                <ImageGrid images={post.image} />
                        <div className="flex gap-5 justify-between ">
                            <LikeButton className=" bg-neutral-900" post={post} onLike={()=>like(post.PostId)} isPending={isPending}/>

                            <button title="coment" onClick={()=>openComentForm(index)} className="text-white  bg-neutral-900 rounded-md p-2 mt-5 ">
                                <FaCommentDots/>
                            </button>

                            <button title= 'repost' className="text-white bg-neutral-900 rounded-md p-2 mt-5  ">
                                <BiRepost className="scale-150"/>
                            </button>
                        </div>
                    </div>
                    {post?.comments.map((comment,index)=>(
                        <div key={index} className="px-20 mt-5">
                            
                            <PostHeader author={comment.user} timestamp={comment.timestamp}/>
                            <p className="text-white">{comment.text}</p>

                            <ImageGrid images={comment?.image} className={'max-w-[150px]'}/>
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

