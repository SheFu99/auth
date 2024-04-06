"use client"

import { useSearchParams } from "next/navigation"
import { CardWrapper } from "./card-wraper"
import {BeatLoader} from "react-spinners"
import { useCallback, useEffect, useState } from "react"
import { newVerification } from "@/actions/new-verification"
import { FormSucces } from "../form-succes"
import { FormError } from "../form-error"

 const NewVerificationForm = ()=>{
    const [error,setError] = useState<string|undefined>()
    const [success,setSuccess] =useState<string|undefined>()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')


    const onSubmit = useCallback (()=>{
        if (!token) {
            setError("Missing token!")
            return
        }
       newVerification(token)
        .then((data)=>{
            setSuccess(data.success)
            setError(data.error)
        })
        .catch(()=>{
            setError("Something went wrong!")
        })

    },[token])

    useEffect(()=>{
        console.log(token)
        onSubmit()
    },[onSubmit, token])
    return(
        <CardWrapper
           headerLable="Confirming you verification"
           backButtonLabel="Back to login"
           backButtonHref="/auth/login"
           >
            <div className="flex items-center w-full justify-center">
                {success && error && <BeatLoader/>}

                <FormSucces message={success}/>
               <FormError message={error}/>
            </div>
        </CardWrapper>
      
    )
}

export default NewVerificationForm