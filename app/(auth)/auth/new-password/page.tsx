// import NewPasswordForm from "@/components/auth/New-password-form";
import React,{Suspense} from "react";
import { PulseLoader } from "react-spinners";
const NewPasswordForm = React.lazy(()=> import("@/components/auth/New-password-form"))
const NewPasswordPage = () => {
    return ( 
        <Suspense fallback={<PulseLoader/>}>
        <NewPasswordForm></NewPasswordForm>
        </Suspense>
     );
}
 
export default NewPasswordPage;