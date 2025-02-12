import React, { Suspense } from "react";

  
const RegisterForm = React.lazy(() => import ("@/components/auth/registerform"))

const RegisterPage = () => {
    return ( 
        <div>
         <Suspense fallback={<div>Loading...</div>}>
           <RegisterForm></RegisterForm>
           </Suspense>
        </div> 
     );
   
}
 
export default RegisterPage ;