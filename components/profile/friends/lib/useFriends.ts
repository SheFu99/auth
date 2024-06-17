
import { filterFirendsWithCursor, getProfileFriends } from "@/actions/friends";
import { FriendsOffer } from "@/components/types/globalTs";
import { useInfiniteQuery ,QueryFunctionContext} from "@tanstack/react-query";

interface fetchFrinendListParams {
    userId:string,
    pageParam:number,
}

export type FriendsQueryPromise = {
    data?:FriendsOffer[],
    totalFriendsCount?:number,
    nextPage?:number,
}

export const fetchFriendList = async ({pageParam = 1, userId}:fetchFrinendListParams):Promise<FriendsQueryPromise>=>{
    console.log("fetchFrinendListParams",userId)
    const {success,profileFirendsList,totalFriendsCount,error}= await getProfileFriends({userId , pageParam})
    console.log("totalFriendsCount:",totalFriendsCount),
    console.log("profileFirendsList",profileFirendsList)
    
    if(error) {
        throw new Error(error)
    }
    return {
        data:profileFirendsList, 
        nextPage: pageParam + 1,
        totalFriendsCount:totalFriendsCount,
    }
};
type fetchSearchParams = {
    cursor?:string|null,
    profileId:string,
    name:string
}

export const useFriendList = (userId:string)=>{
    console.log('useFriendListParams',userId)
    return useInfiniteQuery({
        queryKey:['friendList' ,userId],
        queryFn:({pageParam=1})=>fetchFriendList({pageParam,userId}),
        initialPageParam:1,
        getNextPageParam:(lastPage,allPages)=>{
            const totalFetchedFriends = allPages.flatMap(page=>page.totalFriendsCount).length
            const hasMore = totalFetchedFriends < lastPage.totalFriendsCount ? lastPage.nextPage : undefined
            return hasMore
        }

    })

};
type fetchSearchPromise ={
    data:FriendsOffer[],
    cursor?:string,
    totalFound?:number
}
export const fetchSearchWithCursor= async ({cursor,profileId,name}:fetchSearchParams)=>{
    if(!name) {
        return {data:null,cursor:null,totalFound:0}
    }
    const {friendships,count} = await filterFirendsWithCursor({cursor,profileId,name})
     if(!friendships){
        return null
     }
    console.log('FETCHFRIENDS',friendships)

     return {
        data:friendships,
        cursor:cursor,
        totalFound:count
     }

};



export const useFriendsSearch =  ({ cursor, profileId, name }:fetchSearchParams) => {
    console.log('friendSearch:', cursor, profileId, name);
    
    if(!profileId){
        throw new Error ('id is requered!')
    }

  return useInfiniteQuery({
    queryKey: ['friendSearch', name, profileId],
    queryFn: async ({ pageParam = '' }: QueryFunctionContext) => {
        const response = await fetchSearchWithCursor({ cursor: pageParam as string | null, profileId, name });
        console.log('HOOKRESPONSE',response)
        return response;
      },
      initialPageParam:null,
    getNextPageParam: (lastPage) => {
      if (lastPage?.data?.length === 0) {
        return undefined; 
      }
      console.log('LastPage:',lastPage?.data)
      const index = lastPage?.data?.length-1 
      const cursor = index ? lastPage?.data[index]?.transactionId : null
      return cursor;
    },
  })
}
