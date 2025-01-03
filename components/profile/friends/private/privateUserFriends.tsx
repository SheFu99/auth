"use client"

import {  changeFriendOfferStatus, changeStatusParams, deleteFriend, deleteFriendParams, getUserFreinds } from "@/actions/friends"
import { useCurrentUser } from "@/hooks/use-current-user"
import { toast } from "sonner"

import queryClientConfig from "@/lib/QueryClient"
import IncomeOfferList from "./incomeOfferList"
import InfiniteScroll from "../../post/functions/infinite-scroll"
import { useFriendList } from "../../../../lib/reactQueryHooks/userFriends"
import PrivateFriendList from "./privateFriendsList"

const PrivateUserFriends = () => {
    const user = useCurrentUser()
    const queryKey = ['friendList',user?.id]
    const {data,isError,isLoading,hasNextPage,fetchNextPage,isFetched}=useFriendList(user?.id)
    const flatData = data?.pages?.flatMap(pages=>pages.data)
    // console.log('flatUserFriens',data?.pages)
    const changeFriendStatus = ({status,transactionId}:changeStatusParams)=>{
            changeFriendOfferStatus({status:status,transactionId:transactionId})
            .then(response => {
                if(response.success){
                    toast.success(response.message)
                    queryClientConfig.invalidateQueries({queryKey})
                    ///TODO: create mutation for big list of friends case handle
                }
            })
            .catch(err =>{
                toast.error(err)
            })
        
    };
    const deleteFriendButton = (userId:string)=>{
            deleteFriend(userId)
            .then(response=>{
                console.log(response)
                if(response.succes){
                    toast.success(`Your successfully delete friends from list`)
                    queryClientConfig.invalidateQueries({queryKey})
                }
                if(response.error){
                    toast.error(response.error)
                }
            })
    };


    return ( 
        <div className=" w-full ">
        {/* INCOME */}
        <IncomeOfferList/>
        <InfiniteScroll hasMore={hasNextPage} isloaded={isFetched} loadMore={fetchNextPage} className="space-y-2" >
            <PrivateFriendList onBan={changeFriendStatus} onDelete={deleteFriendButton} friendList={flatData}/>

        </InfiniteScroll>

        </div>
     )
}
 
export default PrivateUserFriends;