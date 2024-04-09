'use client'
import * as z from 'zod'

import {useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { SettingsSchema } from '@/schemas';
import { settings } from "@/actions/settings";

import { 
    Form,
    FormField,
    FormControl,
    FormItem,
    FormLabel,
    FormDescription,
    FormMessage,
} from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardContent, 
} 
from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { useCurrentUser } from '@/hooks/use-current-user';
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { FormSucces } from '@/components/form-succes';
import { FormError } from '@/components/form-error';
import { UserRole } from '@prisma/client';
import { Switch } from '@/components/ui/switch';
import { MdAccountBox, MdElderly, MdFiberNew } from 'react-icons/md';
import { toast } from 'sonner';
import ContactInformation from '@/components/profile/Contact-information';
import StoreProvider from '@/app/StoreProvider';
const SettingPage =  () => {
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
 
//   useEffect(()=>{
//     const timer = setTimeout(()=>{
//         setError(undefined)
//         setSuccess(undefined)
//     },1000)

//     return()=>clearTimeout(timer)
//     console.log(success)
//   },[success,error])


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
       
        
        <Card className='grid grid-cols-12 '>
            <CardHeader className='col-span-12'>
                <p className="text-2xl font-semibold text-center ">⚙️ Settings </p>
            </CardHeader>
            <CardContent className='col-span-12 col-start-1 '>
            <ContactInformation></ContactInformation>
            {user?.isOAuth === false &&(
                <Form {...form}>
                    <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit,onError)}>
                        <div>
                            
                           
                            <>
                                
                                  
                                <div className='grid'>
                                <div className='col-start-1 col-span-4 row-start-1 px-1'>
                                    <FormField
                                        control={form.control}
                                        name='password'
                                        render ={({field})=>(
                                        <FormItem>
                                            <FormLabel className='text-xs font-semibold'>Old password</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field}
                                                    type="password"
                                                    placeholder= "******"
                                                    disabled ={isPending}
                                                    Icon={MdElderly}
                                                    className={shouldAnimate && errors.password ? 'animate-shake' : ''}
                                                    />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>

                                        )}
                                    />
                                    </div>
                                <div className='col-span-4 col-start-6 row-start-1 px-1'>
                                    <FormField
                                        control={form.control}
                                        name='newPassword'
                                        render ={({field})=>(
                                        <FormItem>
                                            <FormLabel className='text-xs font-semibold'>New password</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field}
                                                    type='password'
                                                    placeholder= "******"
                                                    disabled ={isPending}
                                                    Icon={MdFiberNew}
                                                    className={shouldAnimate && errors.newPassword ? 'animate-shake' : ''}
                                                    />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>

                                        )}
                                    />
                                </div>
                                </div>
                            </>
                          
                             
               
                            <>
                         <FormField
                                control={form.control}
                                name='isTwoFactorEnabled'
                                render ={({field})=>(
                                <FormItem className=''>
                                 <div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-gray-900 mt-5'>
                                    <div className='space-y-0.5 '>
                                        <FormLabel className='text-xs font-semibold'>Two Factor Authentication</FormLabel>
                                        <FormDescription className='text-xs font-semibold'>
                                            Enable two factor Authentication for youtr account ?
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            disabled={isPending}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            />
                                    </FormControl>
                                 </div>
                                </FormItem>

                                )}
                            />
                         </>
                        </div>
                        
                        <Button disabled={isPending} type='submit' className='w-full'>Save</Button>
                    </form>
                </Form>
                  )}
            </CardContent>
        </Card>

     
     );
}
 
export default SettingPage;