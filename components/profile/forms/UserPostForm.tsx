"use client"

import * as z from "zod"
import { CreatePost } from "@/actions/UserPosts"
import { useSession } from "next-auth/react"
import {  useEffect, useRef, useState, useTransition } from "react"
import { toast } from "sonner"
import { Button } from "../../ui/button"
import { IoSendSharp } from "react-icons/io5";
import { Textarea } from "../../ui/textarea"
import { MdAddPhotoAlternate } from "react-icons/md"
import { BsEmojiSmile } from "react-icons/bs"
import { IoMdClose } from "react-icons/io"
import { useCurrentUser } from "@/hooks/use-current-user"
import { microserviceEndpoint } from "@/lib/utils"
import dynamic from 'next/dynamic';

const Picker = dynamic(
  () => {
    return import('emoji-picker-react');
  },
  { ssr: false }
);

export interface DataResponse{
    PostId: string,
    image: string[],
    text: string,
    timestamp: Date,
    userId: string,
    error: string,
    success:string,
} 


const UserPostForm = () => {

    const [shouldAnimate,setShouldAnimate]=useState<boolean>(false)
    const [isPending,startTransition]=useTransition()
    const [isEmoji,setEmoji]=useState<boolean>(false)
    const [images,setImageFiles]= useState<File[]|undefined>()
    const [imagesBlobUrl,setImagesBlobUrl]=useState<string[]>([])
    const [textState,setTextState]=useState<string>('')
    const [selectedReaction,setReaction]=useState<string>('')
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [error,setError] =useState<string| undefined>()
    // const [editProfile, swichEditProfile]=useState<boolean>(false)
    const TextInputRef = useRef(null)
    const {update} = useSession()
    const user=useCurrentUser()

const postSchema = z.object({
    text:z.string().min(2,{message:'Error you need to type something to post this!'})
})

    const Submit = (post)=>{
                 startTransition(()=>{
                    CreatePost(post)
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
    }

    const submitPost= async(event)=>{
        setEmoji(!isEmoji)
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
            uploadImages(images)
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
                setImageFiles(undefined)
                setImagesBlobUrl(null)
                setTextState(undefined)
                TextInputRef.current.value = null
                  
            }) 
        }) 
    
    return 
    
    };

    const uploadImages = async (files) => {
       
        setIsUploading(true);
        let localImageUrls = [];
        try {
            const imageUrls = await Promise.all(files.map(async (file, index) => {
                const now = new Date();
                const dateTime = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
            
                const formData = new FormData();
                const filename = `post_${user.id}_${dateTime}_${index}.png`; // Unique filename for each image
                const headers = new Headers()

                headers.append("Content-Type","multipart/form-data")
                formData.append("cover", file, filename);
                
        
                const uploadResponse = await fetch(`${microserviceEndpoint}/api/s3-array-upload`, {
                    method: 'POST',
                    body: formData,
                });
                const data = await uploadResponse.json();
            
                if (data?.error) {
                    throw new Error('Upload to S3 failed');
                };
    
                localImageUrls.push(data.imageUrls); // Collect URLs in a local array
            }));
            

            return { success: true, imageUrls: localImageUrls.flat() };
        
        } catch (error) {
            
            return { error: "Something went wrong! No imageURL from server" };
        }
    };

    const AddImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
      
        const files = Array.from(event.target.files); // Convert FileList to Array

            if(files.length>imagesBlobUrl.length){
                setImageFiles(files)
            }else{
                setImageFiles(prevFiles=>[...prevFiles,...files])
            }

        const imageBlobUrls = [];

    
      console.log(imagesBlobUrl)
        for(let i=0; i<files.length; i++){
            const file = files[i];
            const reader = new FileReader();

            reader.onload = (e)=>{
                const blobUrl = e.target.result;
                imageBlobUrls.push(blobUrl);
            }
            const imgURL = URL.createObjectURL(file);
             imageBlobUrls.push(imgURL); // Push the created Blob URL
             setImagesBlobUrl(prevImagesUrl=>[...prevImagesUrl,imgURL])
             
             reader.readAsDataURL(file)
    }
    };

    const onError =(errors:any)=>{
        if(Object.keys(errors).length){
            setShouldAnimate(true)
            setTimeout(()=>setShouldAnimate(false),1000)
        }
    };

    const deleteImage = (image,index) =>{
        setImagesBlobUrl(prevImagesUrl=>prevImagesUrl.filter(img=>img!==image))
        const newImageState = images.filter((file,id)=>id !== index)
        setImageFiles(newImageState)
    };

    const handleReactionClick = (reaction)=>{
      
        setReaction(reaction);
        TextInputRef.current.value += reaction.emoji
    }

 
    return (
     <form  onSubmit={submitPost}  className="p-2  border border-white rounded-md" >
                
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
                                onChange={AddImage}
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
                        <div className="flex flex-wrap justify-center mt-2 z-50 absolute top-[6rem]">
                            {isEmoji&&(
                                <Picker width={300} className="mt-4 " theme="dark" onEmojiClick={(e)=>handleReactionClick(e)}/>
                            )}
                        </div>
                       
                            <p className="cursor-pointer" title="Mention">@</p>
                           
                    </div>
                    <div className="flex relative p-1 mt-2 flex-wrap gap-5">
                        {imagesBlobUrl?.map((image,index)=>(
                            <div key={index}>
                                <div className="relative" title="remove image">
                                    <button 
                                        onClick={()=>deleteImage(image,index)} 
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