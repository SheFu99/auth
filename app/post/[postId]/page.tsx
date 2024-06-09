'use server'

import { getCommentByPost, getPostById } from "@/actions/post";
import { auth } from "@/auth";
import PostCard from "@/components/profile/post/postCard/PostCard";
import InfiniteCommentList from "@/components/profile/post/postCard/lists/InfiniteCommentList";
import { post } from "@/components/types/globalTs";
import queryClientConfig from "@/lib/QueryClient";
import { prefetchCommentList, prefetchPost } from "@/lib/prefetchQuery";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Metadata } from "next";
import Head from "next/head";
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
        title:post.user.name,
        description:post.text,
        openGraph:{
            images:[
                {url:post.image[0].url}
            ]
        }
    }
}

const PostPage = async ({params:{postId}}) => {
  
    await prefetchPost(postId)
    await prefetchCommentList(postId)
    const data = await getPostById(postId)
    const post= data?.post
    const dehydratedState = dehydrate(queryClientConfig)

    const session = await auth()
    const user = session?.user


    return ( 
        <HydrationBoundary state={dehydratedState}>
            <>
            {post&&(
                <Head>
                <title>{post.user.name} - Post</title>
                <meta name="description" content={post.superText} />
                <meta property="og:title" content={post.user.name} />
                <meta property="og:description" content={post.text} />
                <meta property="og:image" content={post?.image[0]?.url||''} />
              </Head>
            )}
            
            <div>
            
                {post&&(
                    <div className="border min-h-[85vh]">
                    <PostCard postId={postId} currentUser={user} />
                    <InfiniteCommentList postId={postId} user={user} commentsCount={post?._count?.comments}/>
                    </div>
                )}
            </div>
            </>
        </HydrationBoundary>
     );
}
 
export default PostPage;