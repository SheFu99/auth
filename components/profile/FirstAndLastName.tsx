"use client"
import * as z from 'zod'
import { useSession } from "next-auth/react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useEffect, useState, useTransition } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsSchema } from '@/schemas';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import { settings } from '@/actions/settings';
import { MdEditNote } from 'react-icons/md';
import { IoIosSave } from 'react-icons/io';
import { LuTextCursor } from "react-icons/lu";

type FirstAndLastNameProps={
    editState:boolean;
    userName:string;
   
}

const FirstAndLastNameForm = ({userName}:FirstAndLastNameProps) => {
    const user = useCurrentUser()
    const [editState, setEdit] = useState<boolean>(false)
    const [error,setError] =useState<string| undefined>()
    const [success, setSuccess] = useState<string|undefined>()
    const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);
    const {update} = useSession()
    const [isPending , startTransition] = useTransition()

    const onSubmit = (values: z.infer<typeof SettingsSchema>)=>{
        setEdit(false)
        startTransition(()=>{
        settings(values)
        .then((data)=>{
            if(data.error){
                setError(data.error);
                toast.error(data.error)
            }

            if(data.success){
                update()
                setSuccess(data.success);
                toast.success(data.success)
            }
        })
        .catch (()=>setError('Something went wrong!'))
    })
    return 
    }


    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues:{
            name: user?.name || undefined,
            // gender : profile.gender||undefined,
            // age: profile.age || undefined,
            // phoneNumber: profile.phoneNumber|| undefined,
            // adres: undefined,
            
        }
    })
    const { handleSubmit, control, formState: { errors } } = form;

    ///shake animation
     useEffect(() => {
            
            if (Object.keys(errors).length>3) {
                setShouldAnimate(false);
                console.log("error!")
            }
    }, [errors]);
    const onError = (errors:any) => {
            console.error(errors);
            if (Object.keys(errors).length) {
                setShouldAnimate(true);
                // Reset the animation after it plays
                setTimeout(() => setShouldAnimate(false), 1000); // Adjust timing based on animation duration
            }
     };
    ///shake animation 


    return ( 
        <div className='ml-10'>
            {editState?(
                  <div className='col-span-12'>
                  <Form {...form}>
                    <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit,onError)}>
                        <div>
                            <>
                              <div className='grid grid-cols-12 gap-2 '>
        
                                <div className='sm:col-span-9 sm:col-start-2 ml-5 g-f:col-span-10 g-f:col-start-2 '>
                                    <FormField
                                        control={form.control}
                                        name='name'
                                        render ={({field})=>(
                                        <FormItem>
                                            <FormControl>
                                                <Input 
                                                    {...field}
                                                    type="profile"
                                                    placeholder= "First Name"
                                                    disabled ={isPending}
                                                    Icon={LuTextCursor}
                                                    className={shouldAnimate && errors.name ? 'animate-shake !border-none' : '!border-none'}
                                                    
                                                    />
                                                    
                                            </FormControl>
                                            
                                            <FormMessage/>
                                            
                                        </FormItem>

                                        )}
                                    />
                                    </div>

                                    <button onClick={()=>onSubmit} type='submit' title='edit name' className='col-start-12'>
                                        <IoIosSave color='black' className="scale-150 "/>
                                    </button>

                                </div>
                            </>
                          
                        </div>
                        
                  </form>
                </Form>

                  </div>
                ):(
                <div className="grid grid-cols-12 lg:ml-5 ml-10 w-full m-auto mt-1 col-start-3 col-span-4 row-start-1 py-2">
                  <h1 className="col-start-2 text-black font-semibold lg:text-2xl md:px-10 md:text-xl sm:-ml-10 -ml-20 text-md g-f:text-nowrap g-f:ml-0 g-f:text-xs">{userName}</h1>
                    <button onClick={()=>setEdit(!editState)} title='edit name' className=' sm:col-start-12 sm:-ml-5 g-f:col-start-11 g-f:-ml-5'>
                        <MdEditNote color='black' className="scale-150 "/>
                    </button>
                </div>
                )}
                
                
        </div>
     );
}
 
export default FirstAndLastNameForm;