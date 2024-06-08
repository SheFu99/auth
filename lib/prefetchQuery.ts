import queryClientConfig from "./QueryClient";
import { fetchPostList } from "@/components/profile/post/lib/usePost";

const prefetchPost = async (userId:string)=>{
    const queryKey: [string, string] = ['posts',userId] 
    const options = {
      queryKey,
      queryFn: ({pageParam=1}) => fetchPostList({pageParam,userId}),
      initialPageParam:1,
      getNextPageParam:(lastPage,allPages)=>{
        const totalFetchedPosts = allPages.flatMap(page=>page.data).length;
        const hasMore = totalFetchedPosts < lastPage.totalPostCount ? lastPage.nextPage : undefined
        return hasMore
    },
  };
   const prefetchPostedPost =  await queryClientConfig.prefetchInfiniteQuery(options)

   return queryClientConfig
}
export default prefetchPost