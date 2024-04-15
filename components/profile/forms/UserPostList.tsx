
"use clinet"
import * as z from "zod"
import { GetUserPosts, userPost, DeleteUserPosts, EditUserPosts } from "@/actions/UserPosts";
import { useCurrentUser } from "@/hooks/use-current-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UserPost } from "@/schemas";



const UserPostList  = () => {

const [shouldAnimate,setShouldAnimate]=useState<boolean>(false)
const [error,setError] =useState<string| undefined>()
const {update} = useSession()
const [posts, setPosts]=useState<userPost[]>()
const [isPending,startTransition]=useTransition()
const [isEditMode,setEditIsMode]=useState<boolean>(false)

const user = useCurrentUser()

    useEffect(()=>{
        async function GetPost() {
            try{
                const posts = await GetUserPosts(user.id)
                return posts
            }catch(err){
                console.log(err)
            }
           
        }
        GetPost().then(posts => setPosts(posts?.posts))
       
    },[update])

    const deletePost=(id:string)=>{
        startTransition(()=>{
            DeleteUserPosts(id)
            .then((data)=>{
                if(data.error){
                  
                    toast.error(data.error)
                }
    
                if(!data.error){
                    // swichEditProfile(false)
                    update() 
                    toast.success("Your post has been deleted")
                }
            })
            
        })
    
    return 
    
    }
  
    useEffect(()=>{ console.log(posts)},[posts])

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
        <div className="bg-white h-8">
            {/* {isEditMode&&(

            )} */}
            {posts?.map((post)=>(
                <div key={post.PostId} className="bg-white">
                    <p className="text-black">{post.text}</p>
                    {/* <small>{post.timestamp.tolocalString()}</small> */}
                    <button title="delete post" className="text-black" onClick={(e)=>deletePost(post.PostId)}>Delete</button>
                </div>
            ))}
           
        </div>

        // <div>
        //     <p>UserPostList</p></div>
     );
}
 
export default UserPostList;