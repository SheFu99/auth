import { gender } from "@/components/types/globalTs";
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";
import { FaGenderless } from "react-icons/fa";

interface GenderIconProps {
    gender:gender
}

const GenderIcon: React.FC<GenderIconProps>= ({gender})=>{
    switch(gender){
        case 'Male':
            return <BsGenderMale color='black'/>
        case 'Female':
            return <BsGenderFemale color='black'/>
        default:
            return <FaGenderless color='black'/>
    }
    
};

export default GenderIcon