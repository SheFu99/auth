import { Skeleton } from "@/components/ui/skeleton";

const ListSkeleton = () => {
    return ( 
        <div className="grid grid-cols-12 p-5 space-y-5">
        <div className="flex items-center space-x-4 flex-wrap w-full col-span-12 border border-gray-400 rounded-md p-2">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
            <Skeleton className="h-4 md:w-[450px] w-[150px]" />
            <Skeleton className="h-4 md:w-[400px] w-[100px]" />
            </div>
        </div>
        <div className="flex items-center space-x-4 flex-wrap w-full col-span-12 border border-gray-400 rounded-md p-2">
            <Skeleton className="h-12 w-12 rounded-full"  />
            <div className="space-y-2">
            <Skeleton className="h-4 md:w-[450px] w-[150px]" />
            <Skeleton className="h-4 md:w-[400px] w-[100px]" />
            </div>
        </div>
        <div className="flex items-center space-x-4 flex-wrap w-full col-span-12 border border-gray-400 rounded-md p-2">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
            <Skeleton className="h-4 md:w-[450px] w-[150px]" />
            <Skeleton className="h-4 md:w-[400px] w-[100px]" />
        </div>
    

</div>
        </div>
     );
}
 
export default ListSkeleton;