"use client";

import * as z from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CardWrapper } from "./card-wraper";
import { Input } from '../ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import { useEffect, useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { FormError } from '../form-error';
import { FormSucces } from '../form-succes';
import { RegisterSchema } from '@/schemas';
import { register } from '@/actions/register';

interface RegisterResponse {
    success?: string;
    error?: string;
  }
  
const RegisterForm = () => {
    const [error , setError] =useState<string| undefined>(undefined)
    const [success , setSuccess] =useState<string| undefined>("")
    const [isPending, startTransition]= useTransition();
    const [shouldAnimate, setShouldAnimate] = useState(false);

    const form = useForm({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword:'',
            name:''
        },
    });

    const { handleSubmit, control, formState: { errors } } = form;

    // Reset animation state on form change
    useEffect(() => {
        if (Object.keys(errors).length>4) {
            setShouldAnimate(false);
            console.log("error register")
        }
    }, [errors]);

    const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
        // console.log(data);
        setError("");
        setSuccess("");

        startTransition(()=>{
         register(data)
         .then((response: RegisterResponse) => { // Explicitly type the response
            if (response.error) {
                setError(response.error);
            }
            if (response.success) {
                setSuccess(response.success);
            }
        })
        .catch((error: any) => {
            // It's a good practice to handle any unexpected errors
            setError(error.message);
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
            headerLable="Create an account" 
            backButtonLabel="Already have an account"
            backButtonHref="/auth/login"
            showSocial
        >
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
                    <div>
                    <FormField
                            control={control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="John Doe"
                                            className={shouldAnimate && errors.name ? 'animate-shake' : ''}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                   
                                </FormItem>
                            )}
                        />
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
                                        />
                                    </FormControl>
                                   
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="*******"
                                            type="password"
                                            className={shouldAnimate && errors.password ? 'animate-shake' : ''}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                   
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="*******"
                                            type="password"
                                            className={shouldAnimate && errors.confirmPassword?.message ? 'animate-shake' : ''}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    {/* {errors.confirmPassword && <p className='text-xs text-bold text-red-100'>{errors.confirmPassword.message}</p>} */}
                                </FormItem>
                            )}
                        />
                    </div>
                    {error&& <FormError message={error}></FormError>}
                    
                    <FormSucces message={success}></FormSucces>
                    <Button type="submit" className="w-full"  disabled={isPending}>Create an Account</Button>
                </form>
            </Form>
        </CardWrapper>
       
    );
}
 
export default RegisterForm ;