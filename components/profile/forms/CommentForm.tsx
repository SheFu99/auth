
"use client"

import { useSession } from "next-auth/react"
import {  useRef, useState, useTransition } from "react"
import { toast } from "sonner"
import { Button } from "../../ui/button"
import { IoSendSharp } from "react-icons/io5";
import { Textarea } from "../../ui/textarea"
import { MdAddPhotoAlternate } from "react-icons/md"
import { BsEmojiSmile } from "react-icons/bs"
import { IoMdClose } from "react-icons/io"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Theme } from "emoji-picker-react"
import Picker from 'emoji-picker-react'
import useBlobImage from "./functions/useBlobImage";
import useUploadImages, { UploadImagesProps } from "./functions/uploadImages";
import useOnError from "./functions/onError";
import { postSchema } from "@/schemas";
import { CreateComment } from "@/actions/commentsAction"
import BlobImageManager from "./classes/BlobImageManager"



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
const CommentForm = ({postId}) => {
  
    const { isUploading,
            setIsUploading,
            uploadImages}=useUploadImages()
    const {shouldAnimate,onError}=useOnError()
    const {update}=useSession()
    const [manager]=useState(new BlobImageManager());
    const [images,setImageFiles]=useState<File[]>([]);
    const [imagesBlobUrl,setImagesBlobUrl]=useState<string[]>([])

    const [isPending,startTransition]=useTransition()
    const [isEmoji,setEmoji]=useState<boolean>(false)
    const [textState,setTextState]=useState<string>('')
    const [error,setError] =useState<string| undefined>()
 
    const TextInputRef = useRef(null)
   
   
    const user=useCurrentUser()
    const userId = user.id
    const type = 'comment'

 


    const submitPost= async(event)=>{
        setEmoji(false)
        event.preventDefault()
        setIsUploading(true)
        // Validate form data against Zod schema
        try {
            postSchema.parse({ text: textState }); // Validate the text field
        } catch (error) {
            // Handle validation errors (for example, display an error message)
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
                Submit(post)
                setImageFiles([])
                setImagesBlobUrl(null)
                setTextState(undefined)
                TextInputRef.current.value = null
                  
            }) 
        }) 
    
    return 
    
    };

    const Submit = (post)=>{
        startTransition(()=>{
         console.log("COMMENTFORM")
            CreateComment(post,postId)
            .then((data:DataResponse)=>{
                if(data.error){
                    setError(error);
                    toast.error(data.error)
                }
                if(!data.error){
                    update() ///update session
                    toast.success("Your post has been send")
                }
            })
            
        })
    
              
    };
    const handleReactionClick = (reaction)=>{
        setTextState(prevValue=>prevValue + reaction.emoji)
        TextInputRef.current.value += reaction.emoji
    };

    const AddImages = (event:React.ChangeEvent<HTMLInputElement>) => {
        manager.addImage(event)
        setImageFiles(manager.getImages())
        setImagesBlobUrl(manager.getImagesBlobUrl())
    };
    const DeleteImage = (image:string,index:number)=>{
        manager.deleteImage(image,index)
        setImageFiles(manager.getImages());
        setImagesBlobUrl(manager.getImagesBlobUrl());
    };

    return (
        <div className="md:p-5 mt-5">
            <form  onSubmit={submitPost}  className="px-4 border border-gray-500 rounded-md grid grid-cols-12 md:space-x-5 " >

                        {isEmoji&&(<div className="absolute inset-0 w-[90vh] h-[90vh] left-0 right-0 z-50" onClick={()=>setEmoji(false)} ></div>)}
                    
                                        <Textarea 
                                            ref={TextInputRef}
                                            onChange={(e)=>setTextState(e.target.value)}
                                            disabled={isUploading}
                                            className={` ${shouldAnimate ? 'animate-shake' : ''} col-span-12 mt-5`}
                                            placeholder="Type your message here." 
                                        />
                    <div className=" col-span-10">
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
                                <div className="flex relative p-1 mt-2 flex-wrap gap-5 mb-2 ">
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
                    </div>
                    <Button disabled={isUploading} type="submit" className="col-start-11 col-span-2 mt-2 h-10 " >
                                <IoSendSharp className="mr-2"/>
                        Send
                    </Button>
                        
            </form>
        </div>
           

      );
}
 
export default CommentForm;