'use client'

import queryClientConfig from "@/lib/QueryClient";
import {  QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

const QueryProvider = ({children}:{children: ReactNode}) => {
    const [queryClient]=useState((queryClientConfig))

    return ( 
        <QueryClientProvider client={queryClient}>
            {/* <ReactQueryDevtools initialIsOPen = {false}/> */}
            {children}
        </QueryClientProvider>
     );
}
 
export default QueryProvider;