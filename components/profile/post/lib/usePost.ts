
import { GetUserPostsById } from "@/actions/UserPosts";
import { getPostById } from "@/actions/post";
import { post } from "@/components/types/globalTs";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export type PostQueryPromise = {
    data: post[],
    nextPage?:number,
    totalPostCount?:number,
}

export const fetchPostList = async ({ pageParam = 1,userId }): Promise<PostQueryPromise> => {
   console.log('POSTS_GET')
    const data = await GetUserPostsById(userId, pageParam);
    if (data?.error) {
        throw new Error('Network error');
    }
    return {
        data: data.posts, 
        nextPage: pageParam + 1 ,
        totalPostCount: data.totalPostCount
    };
};
  export const usePostList = (userId:string) =>{
        return useInfiniteQuery({
            queryKey:['posts',userId],
            queryFn: ({pageParam=1})=>fetchPostList({pageParam,userId}),
            initialPageParam:1,
            getNextPageParam:(lastPage,allPages)=>{
                const totalFetchedPosts = allPages.flatMap(page=>page.data).length;
                const hasMore = totalFetchedPosts < lastPage.totalPostCount ? lastPage.nextPage : undefined
                return hasMore
            },
        });
    }

    export const fetchPost = async (postId:string) =>{
        const data = await getPostById(postId)
        if(data.error){
            throw new Error('Network Error!')
        }
        console.log(data.post)
        return data.post
    };

    export const usePost = (postId:string)=>{
   
        return useQuery({
            queryKey:['post',postId],
            queryFn:()=>fetchPost(postId),

        })
    }