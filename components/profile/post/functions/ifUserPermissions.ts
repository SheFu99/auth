import { toast } from "sonner";

const IsUserAuth = (user:any)=>{
    if (!user) {
        toast.error("You must be authorized");
        return;
    }
}

export default IsUserAuth