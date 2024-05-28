import { relation } from "@/actions/UserProfile";
import { changeFriendOfferStatus, changeStatusParams, deleteFriend, deletePendingOffer, sendFriendShipOffer } from "@/actions/friends";
import { friendshipStatus } from "@/components/types/globalTs";
import { startTransition, useEffect, useState } from "react";
import { FaHandshake } from "react-icons/fa";
import { IoAddCircle } from "react-icons/io5";
import { MdOutlinePendingActions } from "react-icons/md";
import { toast } from "sonner";

type FriendStatusButtonProps = {
    friendStatus: relation;
    userId: string;
}

export default function FriendStatusButton({ friendStatus, userId }: FriendStatusButtonProps) {
    const [friendStatusValue, setFriendStatus] = useState<friendshipStatus>(
        friendStatus?.relationFrom?.status || friendStatus?.relationTo?.status || undefined
    );
    useEffect(()=>{
        setFriendStatus(friendStatus?.relationFrom?.status || friendStatus?.relationTo?.status)
    },[friendStatus])

    const sendFriendRequest = (userId: string) => {
        startTransition(() => {
            sendFriendShipOffer(userId)
                .then(response => {
                    if (response.success) {
                        toast.success(response.message);
                    }
                })
                .catch(err => {
                    toast.error(err);
                })
                .finally(() => setFriendStatus('PENDING'));
        });
    };
    const applyOffer = (userId:string)=>{
        startTransition(()=>{
            sendFriendShipOffer(userId)
            .then(response => {
                if(response.success){
                    toast.success(response.success)
                }
            })
            .catch(err =>{
                toast.error(err)
            })
            .finally(
                ()=>setFriendStatus('ACCEPTED')
            )
        })
    };
    const deleteFrindTransaction = (userId:string)=>{
        deleteFriend(userId)
        .then(response =>{
            if(response.succes){
                toast.success(response.succes)
            }
        }).catch(err=>{
            toast.error(err)
        }).finally(()=>{
            setFriendStatus(undefined)
        })
    };
    const cancelOffer = (userId: string) => {
        startTransition(() => {
            deletePendingOffer(userId)
                .then(response => {
                    if (response.success) {
                        toast.success('Your offer has been cancelled');
                    }
                })
                .catch(err => {
                    toast.error(err);
                })
                .finally(() => setFriendStatus(undefined));
        });
    };

    const changeStatus = ({ status, transactionId }: changeStatusParams) => {
        changeFriendOfferStatus({ status, transactionId })
            .then(response => {
                if (response.success) {
                    toast.success(response.message);
                }
                if (response.error) {
                    toast.error(response.error);
                }
            });
    };

    console.log(friendStatus);

    const renderButton = () => {
    if(friendStatus?.relationFrom){
        // setFriendStatus(friendStatus?.relationFrom?.status)
        switch (friendStatusValue) {
            case "PENDING":
                return (
                    <div
                        title="Cancel friendship offer"
                        className="bg-white rounded-full border-black border-4 cursor-pointer"
                        onClick={() => cancelOffer(userId)}
                    >
                        <MdOutlinePendingActions className="md:w-[45px] md:h-[45px] w-[30px] h-[30px] p-1" color="black" />
                    </div>
                );
            case "ACCEPTED":
                return (
                    <div
                        title="Delete this profile from your friends"
                        className="bg-white rounded-full border-black border-4 cursor-pointer"
                        onClick={() => deleteFrindTransaction(userId)}
                    >
                        <FaHandshake className="md:w-[45px] md:h-[45px] w-[30px] h-[30px] p-1" color="black" />
                    </div>
                );
            default:
                return (
                    <div
                        title="Send friendship request"
                        className="cursor-pointer"
                        onClick={() => sendFriendRequest(userId)}
                    >
                        <IoAddCircle color="white" className="md:w-[50px] md:h-[50px] w-[35px] h-[35px]" />
                    </div>
                );
        }
    }
    else if(friendStatus?.relationTo){
        // setFriendStatus(friendStatus?.relationTo?.status)
        switch (friendStatusValue) {
            case "PENDING":
                return (
                    <div
                        title="Accept friendShip offer!"
                        className="bg-white rounded-full border-black border-4 cursor-pointer"
                        onClick={() => applyOffer(userId)}
                    >
                        
                        <MdOutlinePendingActions className="md:w-[45px] md:h-[45px] w-[30px] h-[30px] p-1" color="black" />
                    </div>
                );
            case "ACCEPTED":
                return (
                    <div
                        title="Delete from friedns list "
                        className="bg-white rounded-full border-black border-4 cursor-pointer"
                        onClick={() => deleteFrindTransaction(userId)}
                    >
                        <FaHandshake className="md:w-[45px] md:h-[45px] w-[30px] h-[30px] p-1" color="black" />
                    </div>
                );
            default:
                return (
                    <div
                        title="Send friendship request"
                        className="cursor-pointer"
                        onClick={() => sendFriendRequest(userId)}
                    >
                        <IoAddCircle color="white" className="md:w-[50px] md:h-[50px] w-[35px] h-[35px]" />
                    </div>
                );
        }
    }else{
        switch(friendStatusValue){
            case "PENDING":
                return (
                    <div
                    title="Cancel friendship offer"
                    className="bg-white rounded-full border-black border-4 cursor-pointer"
                    onClick={() => cancelOffer(userId)}
                >
                    <MdOutlinePendingActions className="md:w-[45px] md:h-[45px] w-[30px] h-[30px] p-1" color="black" />
                </div>
                );
            default:
                return (
                    <div
                        title="Send friendship request"
                        className="cursor-pointer"
                        onClick={() => sendFriendRequest(userId)}
                    >
                        <IoAddCircle color="white" className="md:w-[50px] md:h-[50px] w-[35px] h-[35px]" />
                    </div>
                )
        }
       
    }
        
    };

    return renderButton();
}
