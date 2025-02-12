// import { NewVerificationForm } from "@/components/auth/new-verification-form";
import React, { Suspense } from "react";
import { PulseLoader } from "react-spinners";
const NewVerificationForm = React.lazy(()=>import("@/components/auth/new-verification-form"))
const NewVerificationPage = () => {
    return ( 
        <Suspense fallback={<PulseLoader/>}>

            <NewVerificationForm></NewVerificationForm>
        </Suspense>
        );
}
 
export default NewVerificationPage;