
"use clinet"
import * as z from "zod"
import { DeleteUserPosts, GetUserPostsById, LikePost } from "@/actions/UserPosts";
import { useCurrentUser } from "@/hooks/use-current-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UserPost } from "@/schemas";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import ImageGrid from "./post/Image-grid";
import { microserviceEndpoint } from "@/lib/utils";


type post ={
    PostId: string,
    image?: image[],
    text: string,
    timestamp?: Date,
    userId: string,
    likeCount: number,
    likes?:any[]
    likedByUser?:boolean
}
type image ={
    url:string
    inedx:number
}


const UserPostList  = (profile:any) => {
const [shouldAnimate,setShouldAnimate]=useState<boolean>(false)
const {update} = useSession()
const [posts, setPosts]=useState<post[]>()
const [isPending,startTransition]=useTransition()



const user = useCurrentUser()

///load user post from server 
    useEffect(()=>{
        console.log(profile)
        async function GetPost() {
            try{
                if(profile.profile){
                    const posts = await GetUserPostsById(profile.profile)
                    return posts

                }else{
                   
                    const posts = await GetUserPostsById(user.id)
                    
                    setPosts(posts.posts)
                    return posts
                }
            }catch(error){
                console.log(error)
         
           
        }}
        GetPost().then(posts => setPosts(posts?.posts))
       
    },[update])
///

    
  
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
                if (post?.likedByUser) {
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
    
            // Revert Optimistic UI Update on Error
            const revertedPosts = newPosts?.map(post => {
                if (post.PostId === postId) {
                    // Toggle like status and adjust like count to revert changes
                    if (post.likedByUser) {
                        return { ...post, likedByUser: false, likeCount: post.likeCount - 1 };
                    } else {
                        return { ...post, likedByUser: true, likeCount: post.likeCount + 1 };
                    }
                }
                return post;
            });
    
            setPosts(revertedPosts);
            console.log(revertedPosts);
    
            toast.error("Error updating post like. Please try again.");
        }
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
            const fetchDelete = async (keys:string)=>{
                console.log('Start delete from S3', keys)
                const endpoint = (`${microserviceEndpoint}/api/s3-delete`);
                try {
                    const response = await fetch (endpoint,{
                        method:'DELETE',
                        headers:{
                                'Content-Type': 'application/json',
                                ///authToken
                        },
                        body:
                            keys ,
                        
                    });

                    if(!response.ok){
                        return {error:`HTTP error! Status: ${response.status}`}
                    }

                        const data= await response.json()
                        console.log('Succes',data)

                    return data
                } catch (error) {
                    return {error:'Failed to delete S3 data'}
                }
            };
  

    const PostForm = useForm<z.infer<typeof UserPost>>({
        resolver:zodResolver(UserPost),
        defaultValues:{
            text: undefined,
            image: undefined,
        }
    })
    const {handleSubmit,control,formState:{errors}} = PostForm
    
    
    useEffect(()=>{
      
        if(Object.keys(errors).length>3){
            setShouldAnimate(false)
        }

    },[])
  
    const onError =(errors:any)=>{
        if(Object.keys(errors).length){
            setShouldAnimate(true)
            setTimeout(()=>setShouldAnimate(false),1000)
        }
    }



    return ( 
        <div className="bg-white rounded-md space-y-1 p-2">
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
            {posts?.map((post,index)=>(
                <div key={index} className=" justify-between border border-gray-500 rounded-md p-3 space-x-1 relative">
                    <p className="text-black col-span-11" >{post.text}</p>
                    {user?.id === post.userId&&(
                        <button title="delete post"className="text-black" onClick={(e)=>deletePost(post)}><RiDeleteBin5Line color="black" className="scale-110  absolute top-2 right-2"/> </button>
                    )}
                        <div>
                            <ImageGrid images={post.image} />
                        </div>
                    {/* <small>{post.timestamp.tolocalString()}</small> */}
                    <div className="flex">
                        <button title="like" className="text-black" onClick={() => like(post.PostId)} disabled={isPending}>
                           {post.likedByUser?
                            <div   className="flex align-middle justify-center items-center gap-2">
                                <FcLike/>
                                {post.likeCount}
                            </div>
                           :
                           <div   className="flex align-middle justify-center items-center gap-2">
                           <FcLikePlaceholder/>
                           {post.likeCount}
                       </div>
                            }
                        </button>
                    </div>
                </div>
            ))}
           
        </div>
        ///Modal to confirm delete 
        // <div>
        //     <p>UserPostList</p></div>
     );
}
 
export default UserPostList;