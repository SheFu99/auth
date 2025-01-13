import { getUserListByName, GetUserListParams, UserListPromise } from "@/actions/search/users"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"

interface useInfiniteUserNameSearchInterface {
    query: string;
    userId: string;
}

export const useSearchUserName = ({query, userId}:useInfiniteUserNameSearchInterface) => {
    // console.log('data','queryInputs',query,userId)
 
    return useQuery({
        queryKey: ['searchUser', { userId, query }],
        queryFn: () => getUserListByName({ name:query, pageParams: 1 }),
        enabled: Boolean(query),
        staleTime: 5000 * 60 * 5,
    });
};



export const useInfiniteUserNameSearch = ({ query, userId }: useInfiniteUserNameSearchInterface): ReturnType<typeof useInfiniteQuery> => {
    const queryKey = ['searchUser', userId, query];
    console.log('getNextPageUserSearchParams','query',query,userId)
    const options = {
        queryKey: queryKey,
        queryFn: async ({ pageParam = null }) => {
            const params: GetUserListParams = {
                name: query,
                cursor: pageParam,
                pageSize: 5, // Default page size
            };
            return getUserListByName(params);
        },
        initialPageParam: null,
        getNextPageParam: (lastPage, allPages) => {
            // Determine if there are more pages to fetch
            console.log('getNextPageUserSearchParams', lastPage, allPages);
            return lastPage.nextCursor || undefined;
        },
        enabled:query.length>0 && !!userId
    };

    return useInfiniteQuery<UserListPromise, Error>(options);
};
