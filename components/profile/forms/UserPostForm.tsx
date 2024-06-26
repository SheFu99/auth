"use client"


import {  CreatePost } from "@/actions/UserPosts"
import {    Suspense, useCallback, useEffect, useRef, useState, useTransition } from "react"
import { Button } from "../../ui/button"
import { IoSendSharp } from "react-icons/io5";
import DOMPurify from 'dompurify';
import { MdAddPhotoAlternate } from "react-icons/md"
import { BsEmojiSmile } from "react-icons/bs"
import { useCurrentUser } from "@/hooks/use-current-user"

import { Theme } from "emoji-picker-react"
const Picker = dynamic(
    () => {
      return import('emoji-picker-react');
    },
    {
        loading:()=><BeatLoader color="white"/>,
        ssr: false,
     },
  );
// import Picker from 'emoji-picker-react'

import useUploadImages, { UploadImagesProps } from "./functions/uploadImages"
import useOnError from "./functions/onError"
import { postSchema } from "@/schemas"
import BlobImageManager from "./classes/BlobImageManager"
import { PostQueryPromise } from "../post/lib/usePost"
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { BeatLoader, PulseLoader } from "react-spinners"
import dynamic from "next/dynamic"
import ImageBlobList from "./ui/ImageBlobList"
import debounce from 'lodash/debounce';
import { getUserListByName } from "@/actions/search/users";
import { ExtendedUser } from "@/next-auth";
import Link from "next/link";
import ContentEditableInput, { ContentEditableInputHandle } from "./ui/ContentEditableInput";
import { useText } from "./Context";



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


    const [isUserChoose,setUserChoose]=useState(false)
    const [isEmoji,setEmoji]=useState<boolean>(false)
    // const [textState,setTextState]=useState<string>('')
    const {textState,setTextState}=useText()
    const [users,setUsers]=useState<ExtendedUser[]>()
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [cursorPosition, setCursorPosition] = useState<number>(0);

    const [popoverState, setPopoverState]=useState(false)
    const TextInputRef = useRef<ContentEditableInputHandle>(null)

    const user=useCurrentUser()
    const userId = user?.id
    const type = 'post'
    
    const queryClient = useQueryClient()
    // TODO: make pending animation for submit button
    // const {isLoading,isError}=usePostList(userId)
    

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
                TextInputRef.current.clearInput() 
            }) 
        }) 
    return 
    
    };

    const handleReactionClick = (reaction: { emoji: string }) => {
        if (TextInputRef.current) {
            TextInputRef.current.insertEmoji(reaction.emoji);
        }
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
    };
    const handleMention = () =>{
        if (TextInputRef.current) {
            TextInputRef.current.insertMention();
        }

    };
   
    useEffect(()=>{
        console.log(textState)
    },[textState])


    const debouncedTogglePopover = useCallback(
        debounce(() => {
            console.log('handlePoppoverTrigger',popoverState)
            setPopoverState(prev => !prev);
        }, 5000),
        []
    );

    useEffect(()=>{
        console.log('textState',textState)
        return ()=>setPopoverState(false)
    },[popoverState])

    const handlePoppoverTrigger = ()=>{
        debouncedTogglePopover()
    };
  

    return (
        
        <form  onSubmit={submitPost}  className="p-2 mt-3 border border-white rounded-md relative" >
         <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>


         <ContentEditableInput 
            ref={TextInputRef} 
            isEditable={!isPending} 
            textState={textState} 
            onContentChange={setTextState}
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

                        <Popover open={popoverState} >
                            <PopoverTrigger onClick={handlePoppoverTrigger}>
                            <BsEmojiSmile 
                                className={`scale-110 cursor-pointer  hover:text-yellow-500 text-white`}
                                title="Emoji!" />
                            </PopoverTrigger>
                            <PopoverContent className="bg-transparent border-none shadow-none flex justify-center w-full" >
                                <Suspense fallback={
                                    <div className="w-[300px] flex justify-center item-center align-middle">
                                        <PulseLoader color="white" className="w-full"/>
                                    </div>
                                    }>
                                    <Picker  
                                        lazyLoadEmojis={true} 
                                        theme={Theme.DARK} 
                                        onEmojiClick={(e)=>handleReactionClick(e)}
                                        reactionsDefaultOpen={true}
                                        height={350}
                                        />
                                </Suspense>
                            </PopoverContent>
                        </Popover>

                        <button type="button" title="Mention" onClick={handleMention} className="z-50">
                            <p >@</p>
                        </button>
                    </div>

                    <ImageBlobList 
                        className="flex relative p-1 mt-2 flex-wrap gap-5"
                        onImageDelete={DeleteImage} 
                        imagesBlobUrl={imagesBlobUrl}
                    />
                    <Button disabled={isUploading} type="submit" className="w-full mt-2" >
                        <IoSendSharp className="scale-150 mr-2"/>
                        Send
                    </Button>
                    
    </form>


           

      );
}
 
export default UserPostForm;