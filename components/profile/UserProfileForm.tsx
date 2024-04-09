"use client"
import * as z from 'zod'
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { UserProfile } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Profile, updateUserProfile } from '@/actions/UserProfile';
import { startTransition, useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Gender } from '@prisma/client';




const UserProfileForm = (data) => {
    
    const [shouldAnimate,setShouldAnimate]=useState<boolean>(false)
    const [isPending,startTransition]=useTransition()
    const [error,setError] =useState<string| undefined>()
    const [success, setSuccess] = useState<string|undefined>()
   
    const Profileform = useForm<z.infer<typeof UserProfile>>({
        resolver:zodResolver(UserProfile),
        defaultValues:{
            age: data.age ||undefined,
            // phoneNumber:data.phoneNumber ||undefined,
            gender: data?.gender || undefined
            // adres:data.adres||undefined,
            
        }
    })
    const {handleSubmit,control,formState:{errors}} = Profileform
    useEffect(()=>{
        // console.log(error)
        if(Object.keys(errors).length>3){
            setShouldAnimate(false)
        }

    },[errors])
    // const onSubmit=(values:z.infer<typeof UserProfile>)=>{
    //     console.log(data)
    //     startTransition(()=>{
    //         updateUserProfile(values)
    //         .then((data)=>{
    //             if(data.error){
    //                 setError(data.error);
    //                 toast.error(data.error)
    //             }
    
    //             if(data.success){
                  
                    
    //                 toast.success(data.success)
    //             }
    //         })
    //         .catch (()=>setError('Something went wrong!'))
    //     })
    
    // return 
    
    // }
    // const onError =(errors:any)=>{
    //     if(Object.keys(errors).length){
    //         setShouldAnimate(true)
    //         setTimeout(()=>setShouldAnimate(false),1000)
    //     }
    // }

    const onSubmit = (data)=>{
        console.log(data)
    }
    const onError=(error)=>{
        console.log(error)
    }
    return ( 
        <div className="col-span-12">
            <Form {...Profileform}>
                <form className='space-y-1' onSubmit={Profileform.handleSubmit(onSubmit,onError)}>
                    <FormField
                        control={Profileform.control}
                        name='age'
                        render={({field})=>(
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type='number'
                                        placeholder='Enter your age:'
                                        disabled={isPending}
                                        onChange={(e) => {
                                            const numberValue = e.target.value === "" ? undefined : Number(e.target.value);
                                            field.onChange(numberValue);
                                          }}
                                        className={shouldAnimate && errors.age ? 'animate-shake !border-none' : '!border-none'}
                                        />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                    <FormField
                        control={Profileform.control}
                        name='phoneNumber'
                        render={({field})=>(
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type='string'
                                        placeholder='+420'
                                        disabled={isPending}
                                        onChange={onSubmit}
                                        className={shouldAnimate && errors.age ? 'animate-shake !border-none' : '!border-none'}
                                        />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                    <FormField
                        control={Profileform.control}
                        name='gender'
                        render={({field})=>(
                            <FormItem>
                                <FormControl>
                                    <Select 
                                        {...field}
                                        disabled={isPending}
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                          }}
                                        defaultValue={field.value}>
                                    <SelectTrigger className="w-[180px]" >
                                        <SelectValue placeholder='Select your gender' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={Gender.Female}>Female</SelectItem>
                                        <SelectItem value={Gender.Male}>Male</SelectItem>
                                        <SelectItem value={Gender.Undefined}>undefined</SelectItem>
                                    </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                        <Button  type='submit' title='submit form' > submit form</Button>
                </form>
            </Form>
        </div>
     );
}
 
export default UserProfileForm;