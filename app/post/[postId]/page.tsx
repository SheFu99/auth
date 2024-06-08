'use server'

import { getCommentByPost, getPostById } from "@/actions/post";
import { auth } from "@/auth";
import PostCard from "@/components/profile/post/postCard/PostCard";
import InfiniteCommentList from "@/components/profile/post/postCard/lists/InfiniteCommentList";
import queryClientConfig from "@/lib/QueryClient";
import { prefetchCommentList, prefetchPost } from "@/lib/prefetchQuery";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import Head from "next/head";

const PostPage = async ({params}) => {
    const postId = params?.postId
    await prefetchPost(postId)
    await prefetchCommentList(postId)
    const data = await getPostById(postId)
    const post= data?.post
    const dehydratedState = dehydrate(queryClientConfig)
    const comments = await getCommentByPost({PostId:postId,page:1})

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
                    <InfiniteCommentList postId={postId} user={user} commentsCount={post.post?._count?.comments}/>
                    </div>
                )}
            </div>
            </>
        </HydrationBoundary>
     );
}
 
export default PostPage;