"use client"

import * as z from "zod"
import { CreatePost } from "@/actions/UserPosts"
import { UserPost } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { Button } from "../ui/button"
import { IoSendSharp } from "react-icons/io5";
import { Textarea } from "../ui/textarea"
import { MdAddPhotoAlternate } from "react-icons/md"

export interface DataResponse{
    PostId: string,
    image: string,
    text: string,
    timestamp: Date,
    userId: string,
    error: string,
    success:string,
} 
const UserPostForm = () => {

    const [shouldAnimate,setShouldAnimate]=useState<boolean>(false)
    const [isPending,startTransition]=useTransition()
    const [error,setError] =useState<string| undefined>()
    const [success, setSuccess] = useState<string|undefined>()
    // const [editProfile, swichEditProfile]=useState<boolean>(false)
    const {update} = useSession()


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
    const onSubmit=(values:z.infer<typeof UserPost>)=>{
        startTransition(()=>{
            CreatePost(values)
            .then((data:DataResponse)=>{
                if(data.error){
                    setError(error);
                    toast.error(data.error)
                }
    
                if(!data.error){
                    // swichEditProfile(false)
                    update() 
                    toast.success("Your post has been send")
                }
            })
            
        })
    
    return 
    
    }

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
        <div className="p-2  border border-white rounded-md">
           <Form {...PostForm}>
            <form className='grid space-y-2' onSubmit={PostForm.handleSubmit(onSubmit,onError)}>
            <div className='col-start-1 col-span-12 row-span-4 '>

                <div className=''>
                <FormField
                    control={PostForm.control}
                    name='text'
                    render={({field})=>(
                        <FormItem>
                            <FormControl>
                                <Textarea 
                                    {...field}
                                    disabled={isPending}
                                    className={`${shouldAnimate ? 'animate-shake' : ''}`}
                                    placeholder="Type your message here."  />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                </div>


            </div>

                    <div title="addPhoto" className="cursor-pointer max-w-[20px] col-start-11"><MdAddPhotoAlternate className="mt-2 scale-150"/></div>
                    <Button type='submit' title='submit form' className=' col-start-12 p-1' > Send <IoSendSharp className='scale-150 ml-2'/></Button>
            </form>
        </Form>  
        </div>
      );
}
 
export default UserPostForm;