import { QueryClient } from '@tanstack/react-query';

const queryClientConfig = new QueryClient(
    {
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5, // 5 minutes
                // refetchOnReconnect:false,
                gcTime: 1000 * 60 * 10,
                refetchOnWindowFocus:true,
                refetchOnMount:true,
            },
        },
    }
);

export default queryClientConfig;