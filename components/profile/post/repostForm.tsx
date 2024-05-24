import { repostAction, repostProps } from "@/actions/repost";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { BiRepost } from "react-icons/bi";
import { toast } from "sonner";

interface RepostFormProps {
    postId:string,
    isOpen:boolean,
    repostCount:number,
    onClick:()=>void,
    title?:string,
}

const RepostForm = ({postId,isOpen,repostCount}:RepostFormProps) => {
    const [superText,setSuperText]=useState<string>('')

    const repost = ({postId,superText}:repostProps)=>{
        startTransition(()=>{

            repostAction({postId:postId,superText:superText})
            .then((response)=>{
                if(response.success){
                    toast.success('Now this post will display on your page')
                }else{
                    toast.error(`Something went wrong: ${response.error}`)
                }
            })

        })
            
        
    }
    return (
        <>
        {!isOpen && (
                <Dialog>
                    <DialogTrigger >
                            <div className="flex gap-2 items-center justify-center align-middle text-white bg-neutral-900 px-3 rounded-md p-2 " title="Repost">
                                <BiRepost className="scale-150"/>
                                {repostCount>0&&(<p>{repostCount}</p>)}
                            </div>
                    </DialogTrigger>
                    <DialogContent>
                        <div className="relative p-6 rounded shadow-lg z-[101] " >
                            <div  className="grid grid-cols-1 space-y-5">
                                <label htmlFor="superText" className="justify-center flex absolute -top-1 left-0 right-0">Add your comment, or repost as it is!</label>
                                <input id="superText" className="p-5 rounded-md" placeholder="You can leave this field blank" onChange={(e)=>setSuperText(e.target.value)} />
                                <button title="repost" type="submit" className="p-2 rounded-md hover:bg-neutral-700 bg-neutral-800"  onClick={()=>repost({postId:postId,superText:superText})}>Make Repost</button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
       
        </>
      );
}
 
export default RepostForm;