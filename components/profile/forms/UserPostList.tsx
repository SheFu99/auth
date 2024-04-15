
"use clinet"
import * as z from "zod"
import { GetUserPostsById, userPost, DeleteUserPosts, EditUserPosts, LikePost } from "@/actions/UserPosts";
import { useCurrentUser } from "@/hooks/use-current-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UserPost } from "@/schemas";
import { TiDelete } from "react-icons/ti";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { Skeleton } from "@/components/ui/skeleton";

type post ={
    PostId: string,
    image?: string,
    text: string,
    timestamp?: Date,
    userId: string,
    likeCount: number,
}


const UserPostList  = (profile:any) => {
const [shouldAnimate,setShouldAnimate]=useState<boolean>(false)
const [error,setError] =useState<string| undefined>()
const {update} = useSession()
const [isFirstToggle,setFirstToggle] = useState(true)
const [posts, setPosts]=useState<post[]>()
const [isPending,startTransition]=useTransition()
const [isEditMode,setEditIsMode]=useState<boolean>(false)

const user = useCurrentUser()

    useEffect(()=>{
        async function GetPost() {
            try{
                if(profile.profile){
                    console.log("GEt by profile")
                    const posts = await GetUserPostsById(profile.profile)
                    console.log(posts)
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

    const deletePost=(id:string)=>{
        startTransition(()=>{
            DeleteUserPosts(id)
            .then((data)=>{
                if(data.error){
                  
                    toast.error(data.error)
                }
    
                if(data.success){
                    
                    update() 
                    toast.success(data.message)
                }
            })
            
        })
    
    return 
    
    }

    const like = (postId:string)=>{

        ///optimistic UI
        if(user){
        const newPost = posts?.map((post)=>{
            if(post.PostId === postId){
                if(isFirstToggle){
                    post.likeCount++
                }
                    post.likeCount--
            }
            return post
        })
       

            setPosts(newPost)
        }else {
            toast.error("You must be authorize") 
            return 
        }
        ///optimistic UI

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

                if(data.success){
                    // swichEditProfile(false)
                    // update()
                    toast.success(data.message)
                }
            })
        })
    }
  
    // useEffect(()=>{ 
    //     console.log(posts)
        
    //     },[posts])

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
    // const editPost=(values:z.infer<typeof UserPost>)=>{
    //     startTransition(()=>{
    //         EditUserPosts(values)
    //         .then((data)=>{
    //             if(data.error){
    //                 setError(error);
    //                 toast.error(data.error)
    //             }
    
    //             if(!data.error){
    //                 // swichEditProfile(false)
    //                 update() 
    //                 toast.success("Your post has been send")
    //             }
    //         })
            
    //     })
    
    // return 
    
    // }

    // const onSubmit=(values)=>{
    //     console.log(PostForm.getValues())
    // }
    const onError =(errors:any)=>{
        if(Object.keys(errors).length){
            setShouldAnimate(true)
            setTimeout(()=>setShouldAnimate(false),1000)
        }
    }


    return ( 
        <div className="bg-white rounded-md space-y-1 p-2">
            {posts?.length<1&&(
                <div className="grid grid-cols-12 p-5 space-y-5">
                    <div className="flex items-center space-x-4 flex-wrap w-full col-span-12 border border-gray-400 rounded-md p-2">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                        <Skeleton className="h-4 xl:w-[600px] w-[250px]" />
                        <Skeleton className="h-4 md:w-[400px] w-[200px]" />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 flex-wrap w-full col-span-12 border border-gray-400 rounded-md p-2">
                        <Skeleton className="h-12 w-12 rounded-full"  />
                        <div className="space-y-2">
                        <Skeleton className="h-4 xl:w-[600px] w-[250px]" />
                        <Skeleton className="h-4 md:w-[400px] w-[200px]" />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 flex-wrap w-full col-span-12 border border-gray-400 rounded-md p-2">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                        <Skeleton className="h-4 xl:w-[600px] w-[250px]" />
                        <Skeleton className="h-4 md:w-[400px] w-[200px]" />
                    </div>
                
            
               </div>
               </div>

            )}
            {posts?.map((post)=>(
                <div key={post.PostId} className="grid justify-between border border-gray-500 rounded-md p-2 space-x-1">
                    <p className="text-black col-span-11">{post.text}</p>
                    {/* <small>{post.timestamp.tolocalString()}</small> */}

                    {user?.id === post.userId&&(
                        <button title="delete post" className="text-black col-start-12 row-span-2 px-2" onClick={(e)=>deletePost(post.PostId)}><RiDeleteBin5Line color="black" className="scale-110 "/> </button>
                    )}
                    <div className="flex">
                        <button title="like" className="text-black" onClick={(e)=>like(post.PostId)}>
                           {post.likeCount !==0?
                            <div className="flex align-middle justify-center items-center gap-2">
                                <FcLike/>
                                {post.likeCount}
                            </div>
                           :
                           <FcLikePlaceholder/> }
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