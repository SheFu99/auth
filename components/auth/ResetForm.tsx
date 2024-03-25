"use client";

import * as z from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, ResetSchema } from '@/schemas';
import { MdEmail,  } from 'react-icons/md';


import { CardWrapper } from "./card-wraper";
import { Input } from '../ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import { useEffect, useState, useTransition } from 'react';
import { FormError } from '../form-error';
import { FormSucces } from '../form-succes';
import { reset } from '@/actions/reset';


interface LoginResponse {
    success?: string;
    error?: string;
  }
  


const ResetForm = () => {

    const [error , setError] =useState<string|undefined>(undefined)
    const [success , setSuccess] =useState<string| null>("")
    const [isPending, startTransition]= useTransition();
    const [shouldAnimate, setShouldAnimate] = useState(false);
    
    const form = useForm({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: '',
        },
    });
    
    const { handleSubmit, control, formState: { errors } } = form;
    
    // Reset animation state on form change
    useEffect(() => {
        
        if (Object.keys(errors).length>3) {
            setShouldAnimate(false);
            console.log("error!")
        }
    }, [errors]);
    
    const onSubmit = (data: z.infer<typeof ResetSchema>) => {
        // console.log(data);
        setError("");
        setSuccess("");
        
        startTransition(()=>{
            reset(data)
            .then((response: any) => { // Explicitly type the response
                
                if (response?.error) {
                    setError(response.error);
                }
                const successMessage = response?.success;
                if (successMessage) {
                    setSuccess(successMessage);
                }
        })
        .catch((error: any) => {
            if (success) {
                console.log(error)
                // It's a good practice to handle any unexpected errors
                setError(error.message );
            }
           
        });
        });
       
    };

    const onError = (errors:any) => {
        console.error(errors);
        if (Object.keys(errors).length) {
            setShouldAnimate(true);
            // Reset the animation after it plays
            setTimeout(() => setShouldAnimate(false), 1000); // Adjust timing based on animation duration
        }
    };

    
    return (  
       
        <CardWrapper
            headerLable="Forgot your password?" 
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
        >
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
                    <div>
                        <FormField
                            control={control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="john.doe@example.com"
                                            type="email"
                                            className={shouldAnimate && errors.email ? 'animate-shake' : ''}
                                            disabled={isPending}
                                            Icon={MdEmail}
                                        />
                                    </FormControl>
                                   
                                </FormItem>
                            )}
                        />
                        
                     
                    </div>
                     <FormError message={error}></FormError>
                    
                    <FormSucces message={success}></FormSucces>
                    <Button type="submit" className="w-full"  disabled={isPending}>Send resend Email</Button>
                </form>
            </Form>
        </CardWrapper>
       
    );
}
 
export default ResetForm ;