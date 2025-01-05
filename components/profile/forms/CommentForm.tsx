
"use client"

import {  useState, useTransition } from "react"
import { Button } from "../../ui/button"
import { IoCreate, IoSendSharp } from "react-icons/io5";
import { Textarea } from "../../ui/textarea"
import { MdAddPhotoAlternate } from "react-icons/md"
import { BsEmojiSmile } from "react-icons/bs"
import { IoMdClose } from "react-icons/io"
import { Theme } from "emoji-picker-react"
import Picker from 'emoji-picker-react'
import useUploadImages, { UploadImagesProps } from "./functions/uploadImages";
import useOnError from "./functions/onError";
import { postSchema } from "@/schemas";
import BlobImageManager from "./classes/BlobImageManager"
import { LoginButton } from "@/components/auth/loginButton"
import { SlLogin } from "react-icons/sl"
import { RegisterButton } from "@/components/auth/RegisterButton"
import { ExtendedUser } from "@/next-auth"
import PostAvatar from "@/components/ui/PostAvatar"
import { Comment, CommentPrev, post } from "@/components/types/globalTs";


export interface DataResponse extends Comment{
    error?: string,
    success?:string,
};

interface CommentFormProps {
    postId:string,
    currentSession?:ExtendedUser,
    className?:string,
    forwardedRef?: React.RefObject<HTMLTextAreaElement>;
    userId:string,
    onCreate:(params:createPostParams)=>void;
}

type createPostParams = {
    comment:Comment,
    postId:string
}

const CommentForm:React.FC<CommentFormProps> = ({postId,currentSession,className,forwardedRef,userId,onCreate}) => {
 
    const { isUploading,
            setIsUploading,
            uploadImages}=useUploadImages()
    const {shouldAnimate,onError}=useOnError()
    // const {update}=useSession()
    const [manager]=useState(new BlobImageManager());
    const [images,setImageFiles]=useState<File[]>([]);
    const [imagesBlobUrl,setImagesBlobUrl]=useState<string[]>([])
    const [isPending,startTransition]=useTransition()
    const [isEmoji,setEmoji]=useState<boolean>(false)
    const [textState,setTextState]=useState<string>('')
    const [focus, setFocus] = useState<boolean>(false) 
  


   
    const type = 'comment'
    const submitPost= async(event)=>{
        setEmoji(false)
        event.preventDefault()
        setIsUploading(true)
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
                        userId: userId
                    })
                };
                if(data.success){
                     post = ({
                        text: textState,
                        image: data.imageUrls,
                        userId: userId
                    }) as CommentPrev

                  
                };
            })
            .finally(()=>{
                setIsUploading(false)
                onCreate({comment:post,postId:postId })
                setImageFiles([])
                setImagesBlobUrl(null)
                setTextState(undefined)
                forwardedRef.current.value = null
                  
            }) 
        }) 
    
    return 
    
    };
    const handleReactionClick = (reaction)=>{
        setTextState(prevValue=>prevValue + reaction.emoji)
        forwardedRef.current.value += reaction.emoji
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
        <div className={`${className} -mb-2 `}
        >
            {currentSession?(
                <>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
                {isEmoji&&(<div className="absolute inset-0 w-[90vh] h-[80vh] left-0 right-0 z-50" onClick={()=>setEmoji(false)} ></div>)}

                       
                <form  onSubmit={submitPost}   className="px-7 grid grid-cols-12 md:space-x-5 "    >
                    
                    <div 
                        className={` ${shouldAnimate ? 'animate-shake' : ''} col-span-12 flex justify-center mb-4 items-center align-middle`}
                    >

                    <PostAvatar
                        src={currentSession.image}
                        alt={currentSession.name}
                        className="col-span-1"
                    />

                    {/* UseMentionComponent  */}

                    
                        <Textarea 
                         ref={forwardedRef}
                         onFocus={()=>setFocus(true)}
                        
                         onChange={(e)=>setTextState(e.target.value)}
                         disabled={isUploading}
                         className={` col-span-10 mt-5`}
                         placeholder="Type your message here."
                         />
                    </div>
                    {focus&&(
                        <>
                         <div className=" col-span-5 col-start-1">
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
                        <Button  disabled={isUploading} type="submit" className="md:col-start-10 md:col-span-3 col-start-9 col-span-4 mt-2 h-10 " >
                                    <IoSendSharp className="mr-2"/>
                            Send
                        </Button>
                        </>
                    )}
                   
                       
                            
                </form>
               
                </>
            ):(
                <div className="flex justify-center p-5 rounded-sm w-full flex-wrap space-y-5">
                    <p>You can log/in or sign up to live comment here...</p>
                    <div className="justify-center w-full flex gap-2 align-middle items-center " role="button" >
                        <LoginButton mode="modal" asChild >
                            <div className="flex items-center gap-2 border-2 p-2 hover:bg-neutral-500">
                                <SlLogin className="scale-100 " title="Log in" role="button"/>
                                <p>Log in</p>
                            </div>
                        </LoginButton>
                        <br></br>
                        <RegisterButton mode="modal" asChild>
                            <div className="flex gap-2 item-center align-middle justify-center p-2 border-2 hover:bg-neutral-500" role="button">
                                <IoCreate className="scale-100 mt-1" title="Sign up" />
                                <p>Sign In</p>
                            </div>
                        </RegisterButton>
                    </div>
                </div>
            )}
        </div>
           

      );
}
 
export default CommentForm;