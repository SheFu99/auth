
"use clinet"
import * as z from "zod"
import { DeleteUserPosts, GetUserPostsById, LikePost } from "@/actions/UserPosts";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Skeleton } from "@/components/ui/skeleton";
import ImageGrid from "./post/Image-grid";
import { FaCommentDots } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import LikeButton from "./post/Like-button";
import PostHeader from "./post/Post-header";
import GetPost from "./post/functions/get-post";
import InfiniteScroll from "./post/functions/infinite-scroll";


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
    
}
type image ={
    url:string
    inedx:number
}

type PostPromise = Promise<post[]>;
const UserPostList  = (profile:any) => {

const {update} = useSession()
const [posts, setPosts]=useState<post[]>()
const [isPending,startTransition]=useTransition()
const [addComent,setComentState]=useState<boolean>(false)
const [getPostTrigger,updatePost]=useState<boolean>(false)
const [hasMore,setHasMore]= useState<boolean>(true)
const [page,setPage]=useState<number>(1)
const [totalPostCount,setTotalCount]=useState<number>(0)
const user = useCurrentUser()

///load user post from server 
    useEffect(()=>{
      console.log('INIT_GETPOST_TRIGGER')
        GetPost(profile,user.id,1).then(posts => {setTotalCount(posts.totalPostCount),setPosts(posts?.posts)})
        // GetPost(profile,user.id,1).then(posts => console.log(posts))

    },[getPostTrigger])
    ///
  
   
    // useEffect(()=>{console.log(posts)},[posts])
  
    const serverLikeaction = (postId:string)=>{
        startTransition(()=>{
            LikePost(postId)
            .then((data)=>{
                // setHasLike({hasLike:data.hasLike,postId:postId})
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
            updatePost(!getPostTrigger)
            
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
                        
                        update() 
                        toast.success(data.message)
                    }
                })
                
            });
            // startTransition(()=>{
            //     fetchDelete(keys)
            //         .then((data)=>{
            //             if(!data.error){
            //                 toast.success('Transition is OK')
            //             }
            //         })
            //         .catch((error)=>{
            //             toast.error('Error delete Image from storage',error)
            //         })
            // })
        
        return 
        
        };
           
        const fetchMoreData = async ()=>{
            console.log("INFINITE_TRIGGERED")
            ///gettFrom server posts.lenght 
            if(posts.length>=totalPostCount){
                setHasMore(false)
                return
            }

                try {
                    await GetPost(profile,user.id,page+1).then(posts=>setPosts(prev=>[...prev,...posts.posts])).finally(()=>setPage(page+1))
                    
                } catch (error) {
                    console.log(error)
                    return
                }
           
            
        }


    return ( 
        <div className="bg-opacity-0  space-y-5 p-1">
            {!posts?.length&&(
                <div className="grid grid-cols-12 p-5 space-y-5">
                    <div className="flex items-center space-x-4 flex-wrap w-full col-span-12 border border-gray-400 rounded-md p-2">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                        <Skeleton className="h-4 md:w-[450px] w-[150px]" />
                        <Skeleton className="h-4 md:w-[400px] w-[100px]" />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 flex-wrap w-full col-span-12 border border-gray-400 rounded-md p-2">
                        <Skeleton className="h-12 w-12 rounded-full"  />
                        <div className="space-y-2">
                        <Skeleton className="h-4 md:w-[450px] w-[150px]" />
                        <Skeleton className="h-4 md:w-[400px] w-[100px]" />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 flex-wrap w-full col-span-12 border border-gray-400 rounded-md p-2">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                        <Skeleton className="h-4 md:w-[450px] w-[150px]" />
                        <Skeleton className="h-4 md:w-[400px] w-[100px]" />
                    </div>
                
            
               </div>
               </div>

            )}
            <InfiniteScroll loadMore={fetchMoreData} hasMore={hasMore}>
            {posts?.map((post,index)=>(
                <div key={index} className=" justify-between border border-white rounded-md p-3  relative">
                    
                    <PostHeader author={post.author} timestamp={post.timestamp}/>

                <div className="ml-[3rem] mr-[1rem]">
                    <p className="text-white col-span-10 col-start-2 ">{post.text}</p>
                        {user?.id === post.userId&&(
                            <button title="delete post"className="text-black" onClick={()=>deletePost(post)}><RiDeleteBin5Line color="white" className="scale-110  absolute top-2 right-2"/> </button>
                        )}
                        <div className="">
                            <ImageGrid images={post.image} />
                        </div>

                    {/* <small className="text-black">{post.timestamp.getDay()}</small> */}
                    <div className="flex gap-5 justify-between ">
                       
                        <LikeButton className=" bg-neutral-900" post={post} onLike={()=>like(post.PostId)} isPending={isPending}/>

                        <button title="coment" onClick={()=>setComentState(!addComent)} className="text-white  bg-neutral-900 rounded-md p-2 mt-5 ">
                            <FaCommentDots/>
                        </button>
                        <button title= 'repost' className="text-white bg-neutral-900 rounded-md p-2 mt-5  ">
                            <BiRepost className="scale-150"/>
                        </button>
                        </div>
                </div>
                </div>
            ))}
           </InfiniteScroll>
        </div>
     );
}
 
export default UserPostList;