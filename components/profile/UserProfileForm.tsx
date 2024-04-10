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
import { BiSave } from 'react-icons/bi';
import { FaEdit, FaGenderless, FaPhone } from 'react-icons/fa';
import { MdElderly, MdLocationCity } from 'react-icons/md';
import { Phone } from 'lucide-react';
import { BsGenderFemale, BsGenderMale } from 'react-icons/bs';
import { useSession } from 'next-auth/react';




const UserProfileForm = (profile:any) => {
    
    const [shouldAnimate,setShouldAnimate]=useState<boolean>(false)
    const [isPending,startTransition]=useTransition()
    const [error,setError] =useState<string| undefined>()
    const [success, setSuccess] = useState<string|undefined>()
    const [editProfile, swichEditProfile]=useState<boolean>(false)
    const {update} = useSession()
    const Profileform = useForm<z.infer<typeof UserProfile>>({
        resolver:zodResolver(UserProfile),
        defaultValues:{
            age: profile.data.age ||undefined,
            phoneNumber:profile.data.phoneNumber ||undefined,
            gender: profile?.data.gender || undefined,
            adres:profile.data.adres||undefined,
            
        }
    })
    const {handleSubmit,control,formState:{errors}} = Profileform
    useEffect(()=>{
        console.log(profile.data)
        if(Object.keys(errors).length>3){
            setShouldAnimate(false)
        }

    },[])
    const onSubmit=(values:z.infer<typeof UserProfile>)=>{
        startTransition(()=>{
            updateUserProfile(values)
            .then((data)=>{
                if(data.error){
                    setError(data.error);
                    toast.error(data.error)
                }
    
                if(data.success){
                    swichEditProfile(false)
                    update()
                    toast.success(data.success)
                }
            })
            .catch (()=>setError('Something went wrong!'))
        })
    
    return 
    
    }
    const onError =(errors:any)=>{
        if(Object.keys(errors).length){
            setShouldAnimate(true)
            setTimeout(()=>setShouldAnimate(false),1000)
        }
    }

    // const onSubmit = (data)=>{
    //     console.log(data)
    // }
    // const onError=(error)=>{
    //     console.log(error)
    // }
    const gender = profile.data.gender
    const getGenderIcon = (gender:any)=>{
        switch(gender){
            case 'Male':
                return <BsGenderMale/>
            case 'Female':
                return <BsGenderFemale/>
            default:
                return <FaGenderless/>
        }
        
    }
    

    return ( 
        <div className="col-span-12">
        {!editProfile?(
            <div className='grid grid-cols-12 p-3 '>

            <div className='g-f:col-span-12 g-f:mt-2 col-start-1 sm:col-span-6 flex space-x-2 border border-white rounded-md p-3'>
                <Phone/>
                <p className='text-white col-span-12 text-xl'>{`${profile.data.phoneNumber}`}</p>
            </div>

            <div className='g-f:col-span-12 g-f:mt-2 sm:ml-1 sm:col-span-6 sm:col-start-7 flex items-center p-3 space-x-2 border border-white rounded-md'>
                <MdLocationCity/>
                <p className='text-white col-span-12 text-xl'>{`${profile.data.adres}`}</p>
            </div>

            <div className='g-f:col-span-12  mt-2 sm:col-span-6  col-start-1 flex items-center p-3 space-x-2 col-span-6 border border-white rounded-md'>
                <MdElderly/>
                <p className='text-white col-span-12 text-xl'>{`Age: ${profile.data.age}`}</p>    
            </div>

            <div className='g-f:col-span-12 sm:ml-1 mt-2 sm:col-start-7 sm:col-span-6   flex items-center p-3 space-x-2 border border-white rounded-md'>
                <i className='text-white col-span-1 text-xl'>{getGenderIcon(gender)}</i>
                <p className='text-white col-span-12 text-xl'>{`Gender: ${profile.data.gender}`}</p>
            </div>

            <Button onClick={()=>swichEditProfile(true)} title='Edit profile information' className='w-full col-span-12 mt-5' >Edit information<FaEdit className='ml-2 scale-150'/></Button>
        </div>
        ):(
            <Form {...Profileform}>
            <form className='space-y-5 p-5' onSubmit={Profileform.handleSubmit(onSubmit,onError)}>
            <div className='grid grid-cols-12 '>

                <div className='sm:"col-start-1 sm:col-span-6 g-f:col-span-12 p-1'>
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
                                    Icon={Phone}
                                    className={shouldAnimate && errors.age ? 'animate-shake ' : ''}
                                    />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                </div>

                <div className='sm:col-start-7 sm:col-span-6 g-f:col-span-12 p-1'>
                <FormField
                    control={Profileform.control}
                    name='adres'
                    render={({field})=>(
                        <FormItem>
                            <FormControl>
                               <Input 
                                    {...field}
                                    type='string'
                                    placeholder='Where you from:'
                                    disabled={isPending}
                                    className={shouldAnimate && errors.age ? 'animate-shake ' : ''}
                                    Icon={MdLocationCity}
                                    />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                     )}/>
                </div>

                <div className='sm:col-start-1 sm:col-span-6 g-f:col-span-12 p-1'>
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
                                      Icon={MdElderly}
                                    className={shouldAnimate && errors.age ? 'animate-shake ' : ''}
                                    />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                )}/>
                </div>

                <div className='sm:col-start-7 sm:col-span-6 ml-1 mt-1 g-f:col-span-12'>
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
                                <SelectTrigger className="h-[50px]" >
                                    <SelectValue placeholder='Select your gender' />
                                </SelectTrigger>
                                <SelectContent >
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Undefined">Undefined</SelectItem>
                                </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                </div>
            </div>

               
                    <Button type='submit' title='submit form' className='w-full' > Save information<BiSave className='scale-150 ml-2'/></Button>
            </form>
        </Form>  
        )}
            

           
        </div>
     );
}
 
export default UserProfileForm;