"use client"

import * as z from "zod"


import {  CreatePost } from "@/actions/UserPosts"
import {   useRef, useState, useTransition } from "react"
import { Button } from "../../ui/button"
import { IoSendSharp } from "react-icons/io5";
import { Textarea } from "../../ui/textarea"
import { MdAddPhotoAlternate } from "react-icons/md"
import { BsEmojiSmile } from "react-icons/bs"
import { IoMdClose } from "react-icons/io"
import { useCurrentUser } from "@/hooks/use-current-user"

import { Theme } from "emoji-picker-react"
import Picker from 'emoji-picker-react'

import useUploadImages, { UploadImagesProps } from "./functions/uploadImages"
import useOnError from "./functions/onError"
import { postSchema } from "@/schemas"
import BlobImageManager from "./classes/BlobImageManager"
import { PostQueryPromise, usePostList } from "../post/lib/usePost"
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query"



export interface DataResponse{
    PostId: string,
    image: string[],
    text: string,
    timestamp: Date,
    userId: string,
    error: string,
    success:string,
} 
;
const UserPostForm = () => {
  
    const {isUploading,
        setIsUploading,
        uploadImages}=useUploadImages()
    // const {
    //     images,
    //     imagesBlobUrl,
    //     setImageFiles,
    //     setImagesBlobUrl,
    //     AddImage,
    //     deleteImage}=useBlobImage()

    const [manager] = useState(new BlobImageManager)
    const [images, setImageFiles]=useState<File[]>([]);
    const [imagesBlobUrl,setImagesBlobUrl]=useState<string[]>([]);

    const {shouldAnimate,onError}=useOnError()
    const [isPending,startTransition]=useTransition()

    const [isEmoji,setEmoji]=useState<boolean>(false)
    const [textState,setTextState]=useState<string>('')

    const TextInputRef = useRef(null)

    const user=useCurrentUser()
    const userId = user?.id
    const type = 'post'
    
    const queryClient = useQueryClient()
    const {isLoading,isError}=usePostList(userId)
    

    const Submit = async (post)=>{
        try {
        const CreatedPost = await CreatePost(post)
            return CreatedPost
        } catch (error) {
            return error
        }
    }
    const queryKey = ['posts',userId]
     const CreatePostMutation = useMutation({
        mutationFn: Submit,
        onSuccess: (newPost)=>{
            queryClient.setQueryData<InfiniteData<PostQueryPromise>>(queryKey,oldData=>{
                if(!oldData) return oldData
                const newData = {
                    ...oldData,
                    pages: oldData.pages.map((page,index)=>{
                        if(index === 0) {
                            return {
                                ...page,
                                data:[newPost.post, ...page.data]
                            };
                        }
                        return page
                        })
                    }
                    return newData
            }
        )},
        onSettled:()=>{
            queryClient.invalidateQueries({queryKey})
        }
        
    });
    const submitPost= async(event)=>{
        console.log('SUBMIT!')
        setEmoji(false)
        event.preventDefault()
        setIsUploading(true)
        try {
            postSchema.parse({ text: textState }); // Validate the text field
        } catch (error) {
            onError(error)
            setIsUploading(false);
            return null
        }

        let post
         startTransition(()=>{
            const uploadProps:UploadImagesProps = {images,userId,type}
            uploadImages(uploadProps)
           .then((data)=>{

                if(data.error){
                    post = ({
                        text: textState,
                        userId: user.id
                    })
                };
                if(data.success){
                     post = ({
                        text: textState,
                        image: data.imageUrls,
                        userId: user.id
                    })
                };
            })
            .finally(()=>{
                setIsUploading(false)
                CreatePostMutation.mutateAsync(post)
                setImageFiles([])
                setImagesBlobUrl([])
                setTextState(undefined)
                TextInputRef.current.value = null
                  
            }) 
        }) 
    
    return 
    
    };
    

    const handleReactionClick = (reaction)=>{
        setTextState(prevValue=>prevValue + reaction.emoji)
        TextInputRef.current.value += reaction.emoji
    };
    const AddImages = (event:React.ChangeEvent<HTMLInputElement>)=>{
        manager.addImage(event);
        setImageFiles(manager.getImages());        
        setImagesBlobUrl(manager.getImagesBlobUrl());
    };
    const DeleteImage = (image:string,inedx:number)=>{
        manager.deleteImage(image,inedx);
        setImageFiles(manager.getImages());
        setImagesBlobUrl(manager.getImagesBlobUrl());
    }

    return (
        
     <form  onSubmit={submitPost}  className="p-2 mt-3 border border-white rounded-md" >

                {isEmoji&&(<div className="absolute inset-0 w-[90vh] h-[90vh] left-0 right-0 z-50" onClick={()=>setEmoji(false)} ></div>)}
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
 
                                <Textarea 
                                    ref={TextInputRef}
                                    onChange={(e)=>setTextState(e.target.value)}
                                    disabled={isUploading}
                                    className={`${shouldAnimate ? 'animate-shake' : ''} `}
                                    placeholder="Type your message here." 
                                 />
                     <div  className="mt-3 md:col-start-11 md:col-span-1 col-span-11 col-start-1  flex justify-around align-middle items-center p-1 mb-2">
                        <label title="Add image"  >
                            <MdAddPhotoAlternate className="scale-150 cursor-pointer "  />
                            <input 
                                onChange={AddImages}
                                type='file'
                                accept="image/*"
                                className="hidden"
                                multiple
                                disabled={isUploading}
                                />
                        </label>
                        
                            <BsEmojiSmile 
                            className={`scale-110 cursor-pointer  ${isEmoji ? 'text-yellow-500':'text-white'}`}
                            title="Emoji!" onClick={()=>setEmoji(!isEmoji)}/>
                        <div className="flex flex-wrap justify-center mt-2 z-50 absolute top-[6rem]" >
                                <Picker open={isEmoji}  width={300} className="mt-4 " theme={Theme.DARK} onEmojiClick={(e)=>handleReactionClick(e)}/>
                           
                        </div>
                       
                            <p className="cursor-pointer" title="Mention">@</p>
                           
                    </div>
                    <div className="flex relative p-1 mt-2 flex-wrap gap-5">
                        {imagesBlobUrl?.map((image,index)=>(
                            <div key={index}>
                                <div className="relative" title="remove image">
                                    <button 
                                        onClick={()=>DeleteImage(image,index)} 
                                        title="Delete image" 
                                        type="button"
                                        className="text-white absolute right-0" >
                                        <IoMdClose className="bg-red-600 bg-opacity-50 rounded-full"/>
                                    </button>
                                </div>
                             <img key={index} src={image} alt=""className="h-[100px] w-auto rounded-sm" />
                            </div>
                        ))}
                    </div>
                 
                    <Button disabled={isUploading} type="submit" className="w-full mt-2" >
                        <IoSendSharp className="scale-150 mr-2"/>
                        Send
                    </Button>
                    
    </form>


           

      );
}
 
export default UserPostForm;