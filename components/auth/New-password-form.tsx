"use client";

import * as z from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordSchema, ResetSchema } from '@/schemas';
import { RiLockPasswordFill } from "react-icons/ri";
import { useSearchParams } from 'next/navigation';

import { CardWrapper } from "./card-wraper";
import { Input } from '../ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import { useEffect, useState, useTransition } from 'react';
import { FormError } from '../form-error';
import { FormSucces } from '../form-succes';
import { NewPassword } from '@/actions/new-password';


interface LoginResponse {
    success?: string;
    error?: string;
  }
  


const NewPasswordForm = () => {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [error , setError] =useState<string|undefined>(undefined)
    const [success , setSuccess] =useState<string| null>("")
    const [isPending, startTransition]= useTransition();
    const [shouldAnimate, setShouldAnimate] = useState(false);
    
    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: '',
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
    
    const onSubmit = (data: z.infer<typeof NewPasswordSchema>) => {
        // console.log(data);
        setError("");
        setSuccess("");
        
        startTransition(()=>{
            NewPassword(data, token)
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
            headerLable="Enter a new password" 
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
        >
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
                    <div>
                        <FormField
                            control={control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="******"
                                            type="password"
                                            className={shouldAnimate && errors.password ? 'animate-shake' : ''}
                                            disabled={isPending}
                                            Icon={RiLockPasswordFill}
                                        />
                                    </FormControl>
                                   
                                </FormItem>
                            )}
                        />
                        
                     
                    </div>
                     <FormError message={error}></FormError>
                    
                    <FormSucces message={success}></FormSucces>
                    <Button type="submit" className="w-full"  disabled={isPending}>Reset password</Button>
                </form>
            </Form>
        </CardWrapper>
       
    );
}
 
export default NewPasswordForm ;