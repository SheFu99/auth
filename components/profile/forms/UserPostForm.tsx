"use client"

import * as z from "zod"
import { CreatePost } from "@/actions/UserPosts"
import { UserPost } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { useEffect, useRef, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../../ui/form"
import { Button } from "../../ui/button"
import { IoSendSharp } from "react-icons/io5";
import { Textarea } from "../../ui/textarea"
import { MdAddPhotoAlternate } from "react-icons/md"
import { BsEmojiSmile } from "react-icons/bs"
import { IoMdClose } from "react-icons/io"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useFormState } from "react-dom"
import { microserviceEndpoint } from "@/lib/utils"


export interface DataResponse{
    PostId: string,
    image: string[],
    text: string,
    timestamp: Date,
    userId: string,
    error: string,
    success:string,
} 

const initialstate = {message:null};
const UserPostForm = () => {

    const [shouldAnimate,setShouldAnimate]=useState<boolean>(false)
    const [isPending,startTransition]=useTransition()
  
    const [error,setError] =useState<string| undefined>()
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [success, setSuccess] = useState<string|undefined>()
    const [textState,setTextState]=useState<string>('')
    const [imagesBlobUrl,setImagesBlobUrl]=useState<string[]>([])
    const [awsImagesUrl,setAwsImagesUrl]=useState<string[]>()
    const [sendPost,setSendPost]=useState<any|undefined>()
    const AddImageRef = useRef(null)
    // const [editProfile, swichEditProfile]=useState<boolean>(false)
    const {update} = useSession()
    const user=useCurrentUser()

    useEffect(()=>{
        if(sendPost){
            Submit()
            console.log(isUploading)
        }
    },[sendPost])

    const Submit = ()=>{
                 startTransition(()=>{
                    console.log("start transition",sendPost);
                    
                    CreatePost(sendPost)
                    .then((data:DataResponse)=>{
                        if(data.error){
                            setError(error);
                            toast.error(data.error)
                        }
            
                        if(!data.error){
                            // swichEditProfile(false)
                            update() 
                            toast.success("Your post has been send")
            setAwsImagesUrl([])
                        }
                    })
                    
                })
    }
    useEffect(()=>{

        if(awsImagesUrl?.length>0){
             setSendPost ( {
                                text: textState,
                                image: awsImagesUrl,
                                userId: user.id
                            })

        }
    },[awsImagesUrl])
 

    const submitPost= async()=>{
        setIsUploading(true)

         startTransition(()=>{
            uploadImages(state)
           .then((data)=>{
                if(data.error){
                    return {error:"Error uploading image transition"}
                }
      
            })
            .finally(()=>{
                setIsUploading(false)
              
            }) 
        }) 
    
    return 
    
    };

    // const uploadImages  = async (croppedImageURL) => {
    //     setIsUploading(true);
    //     let localImageUrls = [];
       
    //     try {
    //       const imageUrls = await Promise.all(croppedImageURL.map(async (blobUrl, index) => {
    //         const now = new Date();
    //         const dateTime = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
          
    //         const response = await fetch(blobUrl);
    //         const blob = await response.blob(); 
    //         const formData = new FormData();
    //         const filename = `post_${user.id}_${dateTime}_${index}.png`; // Unique filename for each image
      
    //         formData.append("cover", blob, filename);
            
      
    //         const uploadResponse = await fetch(`${microserviceEndpoint}/api/s3-array-upload`, {
    //           method: 'POST',
    //           body: formData,
    //         });
    //         const data = await uploadResponse.json();
         
    //         if (data?.error) {
    //           throw new Error('Upload to S3 failed');
    //         };

    //         localImageUrls.push(data.imageUrls); // Collect URLs in a local array
           
          
        
    //       }));
    //       setAwsImagesUrl(localImageUrls.flat());
    //       return { success: true, imageUrls: localImageUrls.flat() };
      
    //     } catch (error) {
    //       toast.error('Failed to upload images.');
    
    //       return { error: "Something went wrong! No imageURL from server" };
    //     }
    // }

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
            
            setAwsImagesUrl(localImageUrls.flat());

            return { success: true, imageUrls: localImageUrls.flat() };
        
        } catch (error) {
            toast.error('Failed to upload images.');
            return { error: "Something went wrong! No imageURL from server" };
        }
    };

    function useFormState(uploadImages, initialState) {
        const [images,setImagestate]= useState()
        console.log(imagesBlobUrl)

        const formAction = (action) => {
            switch (action.type) {
                case 'updateFiles':
                    // Here, we update the state with file data
                    setImagestate( action.payload );
                    break;
                default:
                    console.log(action.type)
                    break;
            }
        };
    
        return [images, formAction];
    };
     const [state,formAction] =useFormState(uploadImages,initialstate);

    const AddImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files); // Convert FileList to Array
        formAction({ type: 'updateFiles', payload: files });
        const imageBlobUrls = [];
      
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

 

    return (
     <form  onSubmit={uploadImages} className="p-2  border border-white rounded-md">
                   <div  className=" md:col-start-11 md:col-span-1 col-span-11 col-start-1  flex justify-around align-middle items-center p-1 mb-2">
                        <label title="Add image"  >
                            <MdAddPhotoAlternate className="scale-150 cursor-pointer "  />
                            <input 
                                onChange={AddImage}
                                type='file'
                                accept="image/*"
                                className="hidden"
                                multiple
                                />
                        </label>
                        <BsEmojiSmile className="scale-110 cursor-pointer" title="Emoji!"/>
                        
                        <p className="cursor-pointer" title="Mention">@</p>

                    </div>
                
                                <Textarea 
                                    onChange={(e)=>setTextState(e.target.value)}
                                    disabled={isPending}
                                    className={`${shouldAnimate ? 'animate-shake' : ''} `}
                                    placeholder="Type your message here." 
                                 />
                                    
                   
                    <div className="flex relative p-1 mt-2 flex-wrap gap-5">
                        {imagesBlobUrl.map((image,index)=>(
                            <div key={index}>
                                <div className="relative" title="remove image">
                                    <button 
                                        onClick={()=>setImagesBlobUrl(prevImagesUrl=>prevImagesUrl.filter(img=>img!==image))} 
                                        title="Delete image" 
                                        type="submit"
                                        className="text-white absolute right-0" >
                                        <IoMdClose className="bg-red-600 bg-opacity-50 rounded-full"/>
                                    </button>
                                </div>
                             <img key={index} src={image} alt=""className="h-[100px] w-auto rounded-sm" />
                            </div>
                            ))}
                    </div>
                 
                    <Button disabled={isPending} type="submit" className="w-full mt-2" onClick={()=>submitPost()}>
                        <IoSendSharp className="scale-150 mr-2"/>
                        Send
                    </Button>
                    
                </form>


           

      );
}
 
export default UserPostForm;