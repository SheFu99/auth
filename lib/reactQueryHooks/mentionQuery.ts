import { getUserListByShortName } from "@/actions/search/users"
import { useQuery } from "@tanstack/react-query"

interface UseDetectMentionInterface { 
query:string,
userId: string
}

export const useMention = ({query, userId}:UseDetectMentionInterface) => {
    // console.log('data','queryInputs',query,userId)
 
    return useQuery({
        queryKey: ['mentions', { userId, query }],
        queryFn: () => getUserListByShortName({ shortName:query, pageParams: 1 }),
        enabled: Boolean(query),
        staleTime: 1000 * 60 * 5,
    });
};
