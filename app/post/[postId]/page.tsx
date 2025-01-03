'use server'

import { getPostById } from "@/actions/post";
import { auth } from "@/auth";
import PostCard from "@/components/profile/post/postCard/PostCard";
import InfiniteCommentList from "@/components/profile/post/postCard/lists/InfiniteCommentList";
import queryClientConfig from "@/lib/QueryClient";
import { prefetchCommentList, prefetchPost } from "@/lib/reactQueryHooks/prefetchPost";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Metadata } from "next";
import { cache } from "react";

const getPost = cache(async(postId:string)=>{
    const {post,error} = await getPostById(postId)
    if(error){
        return
    }
    return post
})

export const generateMetadata = async ({params:{postId}}):Promise<Metadata> =>{
   const post  = await getPost(postId)
    return {
        title:post?.superText || post.text,
        description:`Author ${post.user.name}`,
        openGraph:{
            images: post?.image && post.image.length > 0 ? [{ url: post.image[0].url }] : []
        }
    }
}

const PostPage = async ({params:{postId}}) => {
  
    await prefetchPost(postId)
    await prefetchCommentList(postId)

    const dehydratedState = dehydrate(queryClientConfig)

    const session = await auth()
    const user = session?.user


    return ( 
        <HydrationBoundary state={dehydratedState}>
            <>
            <div>
                    <div className="border rounded-md min-h-[85vh]">
                    <PostCard postId={postId} currentUser={user} />
                    <InfiniteCommentList postId={postId} user={user}/>
                    </div>
                
            </div>
            </>
        </HydrationBoundary>
     );
}
 
export default PostPage;