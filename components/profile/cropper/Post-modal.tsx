'use clientx'
import { InputProvider } from "../forms/Context";
import UserPostForm from "../forms/UserPostForm";

const PostModal = () => {
    return ( 
        <InputProvider>
         <UserPostForm/>
        </InputProvider>
     );
}
 
export default PostModal;