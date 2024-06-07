import { GetUserPostsById } from "@/actions/UserPosts";
import { post } from "@/components/types/globalTs";
import { useInfiniteQuery } from "@tanstack/react-query";

export type PostPromise = {
    data: post[],
    nextPage?:number,
    totalPostCount?:number,
}

export const fetchPosts = async ({ pageParam = 1,userId }): Promise<PostPromise> => {
   console.log('FETCH_CALL')
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
  export const usePosts = (userId:string) =>{
    console.log(userId)
        return useInfiniteQuery({
            queryKey:['posts',userId],
            queryFn: ({pageParam=1})=>fetchPosts({pageParam,userId}),
            initialPageParam:1,
            getNextPageParam:(lastPage,allPages)=>{
                const totalFetchedPosts = allPages.flatMap(page=>page.data).length;
                const hasMore = totalFetchedPosts < lastPage.totalPostCount ? lastPage.nextPage : undefined
                return hasMore
            },
        });
    }