import { getUserListByShortName } from "@/actions/search/users"
import { useQuery } from "@tanstack/react-query"

export const useDetectMention = (textState: string, cursorPosition: number, userId: string) => {
    const mentionIndex = textState?.lastIndexOf('@');
    console.log('UseDetectMention_1',cursorPosition)

    const shouldFetch = mentionIndex !== -1 && cursorPosition > mentionIndex;
    console.log('UseDetectMention',mentionIndex,shouldFetch)
    const query = shouldFetch ? textState?.substring(mentionIndex + 1, cursorPosition) : '';

    return useQuery({
        queryKey: ['mentions', { userId, query }],
        queryFn: () => getUserListByShortName({ shortName:query, pageParams: 1 }),
        enabled: !!query,
        staleTime: 1000 * 60 * 5,
    });
};
