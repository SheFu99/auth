"use clinet"
import * as z from 'zod'
import { settings } from "@/actions/settings";
import { useCurrentUser } from "@/hooks/use-current-user";
import { SettingsSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from 'sonner';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { MdAccountBox, MdEmail } from 'react-icons/md';
import { Button } from '../ui/button';



const AboutUser = () => {
const user = useCurrentUser()
const [error,setError] =useState<string| undefined>()
    const [success, setSuccess] = useState<string|undefined>()
    const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);
    const {update} = useSession()
    const [isPending , startTransition] = useTransition()
   


    const onSubmit = (values: z.infer<typeof SettingsSchema>)=>{
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
            email: user?.email || undefined,
            password:  undefined,
            newPassword : undefined,
            role: user?.role || undefined,
            isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined
        }
    })
    const { handleSubmit, control, formState: { errors } } = form;
    
     // Reset animation state on form change
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

    return ( 

        <div>
          
            <Card className='grid grid-cols-12 bg-gray-800 '>
            <CardContent className='col-span-12 col-start-1 '>
                <Form {...form}>
                    <form className='space-y-6 py-5' onSubmit={form.handleSubmit(onSubmit,onError)}>
                        <CardHeader className='font-semibold flex items-center mb-[-3rem] mt-[-1rem]'>Contact inforamtion:</CardHeader>
                        <div className='grid grid-cols-12'>
                            <div className='row-start-1 col-span-12'>
                                <FormField
                                    control={form.control}
                                    name='name'
                                    render ={({field})=>(
                                    <FormItem>
                                        <FormLabel className='text-xs font-semibold'>Name</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                placeholder= "John Doe"
                                                type='name'
                                                disabled ={isPending }
                                                className={shouldAnimate && errors.name ? 'animate-shake bg-gray-400  text-black font-semibold'  : 'bg-gray-400 text-black font-semibold'}
                                                Icon={MdAccountBox}
                                                editButton={true}
                                                
                                                />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>

                                    )}
                                />
                            </div>
                            <div className='row-start-2 col-span-12'>
                             <FormField
                                control={form.control}
                                name='email'
                                render ={({field})=>(
                                <FormItem>
                                    <FormLabel className='text-xs font-semibold'>Email</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            placeholder= "JohnDoe@email.com"
                                            type='email'
                                            disabled ={isPending }
                                            className={shouldAnimate && errors.name ? 'animate-shake bg-gray-400  text-black font-semibold' : 'bg-gray-400  text-black font-semibold'}
                                            Icon={MdEmail}
                                            editButton={true}
                                            
                                            />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>

                                )}
                            />
                            </div>
                        </div>
                        
                    </form>
                </Form>
            </CardContent>
        </Card>
        </div>
     );
}
 
export default AboutUser;