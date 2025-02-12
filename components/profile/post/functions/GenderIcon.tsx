import { gender } from "@/components/types/globalTs";
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";
import { FaGenderless } from "react-icons/fa";

interface GenderIconProps {
    gender:gender,
    color: string
}

const GenderIcon: React.FC<GenderIconProps>= ({gender,color})=>{
    switch(gender){
        case 'Male':
            return <BsGenderMale color={color}/>
        case 'Female':
            return <BsGenderFemale color={color}/>
        default:
            return <FaGenderless color={color}/>
    }
    
};

export default GenderIcon