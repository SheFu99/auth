// import LoginForm from "@/components/auth/loginForm";
import React ,{Suspense} from "react";
const LoginForm = React.lazy(()=> import ('@/components/auth/loginForm'))

const LoginPage = () => {
    return ( 
        <div>
          <Suspense fallback={<div>Loading...</div>}>
           <LoginForm/>
          </Suspense>
        
        </div> 
     );
   
}
 
export default LoginPage ;