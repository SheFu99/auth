"use client";

import { CreatePost } from "@/actions/UserPosts";
import { Suspense, useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Button } from "../../ui/button";
import { IoSendSharp } from "react-icons/io5";
import { MdAddPhotoAlternate } from "react-icons/md";
import { BsEmojiSmile } from "react-icons/bs";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Theme } from "emoji-picker-react";
import dynamic from "next/dynamic";
import { BeatLoader, PulseLoader } from "react-spinners";
import useUploadImages, { UploadImagesProps } from "./functions/uploadImages";
import useOnError from "./functions/onError";
import { postSchema } from "@/schemas";
import BlobImageManager from "./classes/BlobImageManager";
import { PostQueryPromise } from "../post/lib/usePost";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ImageBlobList from "./ui/ImageBlobList";
import InputMentions from "./ui/inputMentions";
import useInViewRelational from "../post/postCard/helpers/useInView(relational)";
import { MentionInputRef } from "@/components/types/globalTs";

const Picker = dynamic(() => import('emoji-picker-react'), {
    loading: () => <BeatLoader color="white" />,
    ssr: false,
});

export interface DataResponse {
    PostId: string;
    image: string[];
    text: string;
    timestamp: Date;
    userId: string;
    error: string;
    success: string;
}

const UserPostForm = () => {
    const { isUploading, setIsUploading, uploadImages } = useUploadImages();
    const { shouldAnimate, onError } = useOnError();
    const [manager] = useState(new BlobImageManager());
    const [images, setImageFiles] = useState<File[]>([]);
    const [imagesBlobUrl, setImagesBlobUrl] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();
    const [textState, setTextState] = useState<string>('');
    const [cursorPosition, setCursorPosition] = useState<number>(0);
    const [popoverState, setPopoverState] = useState(false);
    const [isMentionExist, setIfMentionExist] = useState(true);
    const TextInputRef = useRef<MentionInputRef | null>(null);
    const user = useCurrentUser();
    const userId = user?.id;
    const type = 'post';
    const queryClient = useQueryClient();

    const Submit = async (post) => {
        try {
            const CreatedPost = await CreatePost(post);
            return CreatedPost;
        } catch (error) {
            return error;
        }
    };

    const queryKey = ['posts', userId];
    const CreatePostMutation = useMutation({
        mutationFn: Submit,
        onSuccess: (newPost) => {
            queryClient.setQueryData<InfiniteData<PostQueryPromise>>(queryKey, (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page, index) => {
                        if (index === 0) {
                            return {
                                ...page,
                                data: [newPost.post, ...page.data],
                            };
                        }
                        return page;
                    }),
                };
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    const submitPost = async (event) => {
        setPopoverState(false);
        event.preventDefault();
        setIsUploading(true);

        try {
            postSchema.parse({ text: textState });
            if (!isMentionExist) {
                const error = 'User is not found';
                onError(error);
                setIsUploading(false);
                return null;
            }
        } catch (error) {
            onError(error);
            setIsUploading(false);
            return null;
        }

        let post;
        startTransition(() => {
            const uploadProps: UploadImagesProps = { images, userId, type };
            uploadImages(uploadProps)
                .then((data) => {
                    post = {
                        text: textState,
                        userId: user.id,
                        image: data.success ? data.imageUrls : undefined,
                    };
                })
                .finally(() => {
                    setIsUploading(false);
                    CreatePostMutation.mutateAsync(post);
                    setImageFiles([]);
                    setImagesBlobUrl([]);
                    setTextState('');
                    TextInputRef.current?.clearInput();
                });
        });
    };

    const handleReactionClick = (reaction) => {
        TextInputRef.current?.handleReactionClick(reaction);
        TextInputRef.current?.focusInput();
    };

    const AddImages = (event: React.ChangeEvent<HTMLInputElement>) => {
        manager.addImage(event);
        setImageFiles(manager.getImages());
        setImagesBlobUrl(manager.getImagesBlobUrl());
    };

    const DeleteImage = (image: string, index: number) => {
        manager.deleteImage(image, index);
        setImageFiles(manager.getImages());
        setImagesBlobUrl(manager.getImagesBlobUrl());
    };

    const handleMention = () => {
        TextInputRef.current?.handleMention();
        TextInputRef.current?.focusInput();
    };

    const handlePopoverTrigger = () => {
        setPopoverState((prev) => !prev);
    };

    const [ref, inView] = useInViewRelational({ threshold: [0.5] });

    return (
        <form onSubmit={submitPost} className="p-2 mt-3 border border-white rounded-md relative">
            <section ref={ref}>
                <InputMentions
                    shouldAnimate={shouldAnimate}
                    textState={textState}
                    setTextState={setTextState}
                    isUploading={isPending}
                    cursorPosition={cursorPosition}
                    setCursorPosition={setCursorPosition}
                    ref={TextInputRef}
                    suggestionsClass="right-11"
                    setIfMentionExist={setIfMentionExist}
                />
                <section id="panel" className="mt-3 flex justify-around items-center p-1 mb-2">
                    <label title="Add image">
                        <MdAddPhotoAlternate className="scale-150 cursor-pointer" />
                        <input
                            onChange={AddImages}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            multiple
                            disabled={isUploading}
                        />
                    </label>
                    <Popover open={popoverState}>
                        <PopoverTrigger onClick={handlePopoverTrigger}>
                            <BsEmojiSmile
                                className={`scale-110 cursor-pointer ${
                                    popoverState ? 'text-yellow-500' : ''
                                } hover:text-yellow-500 text-white`}
                                title="Emoji!"
                            />
                        </PopoverTrigger>
                        <PopoverContent className="bg-transparent border-none shadow-none flex justify-center w-full">
                            <Suspense fallback={<PulseLoader color="white" />}>
                                <Picker
                                    lazyLoadEmojis
                                    theme={Theme.DARK}
                                    onEmojiClick={handleReactionClick}
                                    reactionsDefaultOpen
                                    height={350}
                                    open={inView}
                                />
                            </Suspense>
                        </PopoverContent>
                    </Popover>
                    <button type="button" title="Mention" onClick={handleMention}>
                        <p>@</p>
                    </button>
                </section>
                <ImageBlobList
                    className="flex relative p-1 mt-2 flex-wrap gap-5"
                    onImageDelete={DeleteImage}
                    imagesBlobUrl={imagesBlobUrl}
                />
                <Button disabled={isUploading} type="submit" className="w-full mt-2">
                    <IoSendSharp className="scale-150 mr-2" />
                    Send
                </Button>
            </section>
        </form>
    );
};

export default UserPostForm;
