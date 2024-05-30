import { repostAction, repostProps } from "@/actions/repost";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {  useRef, useState, useTransition } from "react";
import { BiRepost } from "react-icons/bi";
import { toast } from "sonner";

interface RepostFormProps {
    ButtonTitle?:string,
    postId:string,
    isOpen?:boolean,
    repostCount?:number,
    // onClick:()=>void,
    callBack?:()=>void,
}

const RepostModalForm = ({postId,repostCount,ButtonTitle}:RepostFormProps) => {
    const [superText,setSuperText]=useState<string>('')
    const [isPending,startTransition]=useTransition()
    const [isOpen,setIsOpen]=useState(0)
    const DialogRef = useRef(null)
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
            .catch(error=>{
                toast.error(error)
            }).finally(()=>{
                setIsOpen(0)
            })

        })
        
        console.log(DialogRef.current)
    }
    return (
        <>
        
                <Dialog >
                    <DialogTrigger translate="yes"  onClick={()=>setIsOpen(1)}>
                            <div className="flex gap-2 items-center justify-center align-middle text-white bg-neutral-900 px-3 rounded-md p-2 " 
                            title={`${ButtonTitle?ButtonTitle:'Repost'}`}
                            // onClick={()=>setIsOpen(true)}
                            >

                                <BiRepost className="scale-150"/>
                                {(repostCount || 0) > 0 && (<p>{repostCount}</p>)}
                            </div>
                    </DialogTrigger>
                    {isOpen ===1 && (
                    <DialogContent >
                        <div className="relative p-6 rounded shadow-lg z-[101] " >
                            <div  className="grid grid-cols-1 space-y-5">
                                <label htmlFor="superText" className="justify-center flex absolute -top-1 left-0 right-0">Add your comment, or repost as it is!</label>
                                <input id="superText" className="p-5 rounded-md" placeholder="You can leave this field blank" onChange={(e)=>setSuperText(e.target.value)} />
                                <button 
                                    title="repost" 
                                    type="submit" 
                                    disabled={isPending}
                                    className="p-2 rounded-md hover:bg-neutral-700 bg-neutral-800"  
                                    onClick={()=>repost({postId:postId,superText:superText})}>
                                        Make Repost
                                    </button>
                            </div>
                        </div>
                    </DialogContent>
                       )}
                </Dialog>
         
       
        </>
      );
}
 
export default RepostModalForm;