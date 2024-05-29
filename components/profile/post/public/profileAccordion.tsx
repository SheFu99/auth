import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FaPhone } from "react-icons/fa";
import { MdElderly, MdLocationCity } from "react-icons/md";
import GenderIcon from "../functions/GenderIcon";
import { Profile } from "@/actions/UserProfile";

type PublicAccordionProps ={
    profile:Profile,
    className?:string
}

const PublicAccordion:React.FC<PublicAccordionProps> = ({profile,className}) => {
    return (

        <div className={`${className}`}>
                  <Accordion type="single" collapsible className='p-2'>
                    <AccordionItem value="item-1" >
                      <AccordionTrigger className='text-black  font-semibold flex justify-between p-1 md:text-xl g-f:text-sm md:ml-0 g-f:ml-2'>{profile?.firstName}</AccordionTrigger>
                        <AccordionContent>
                            <div className='grid grid-cols-12 '>

                                {profile.phoneNumber&&(
                                    <div className='g-f:col-span-12 g-f:mt-2 col-start-1 sm:col-span-6 flex space-x-2 border border-black rounded-md p-3'>
                                        <FaPhone color='black'/>
                                        <p className='text-black col-span-12 md:text-md g-f:text-sm'>{`${profile?.phoneNumber}`}</p>
                                    </div>
                                )}

                                {profile.adres&&(
                                    <div className='g-f:col-span-12 g-f:mt-2 sm:ml-1 sm:col-span-6 sm:col-start-7 flex items-center p-3 space-x-2 border border-black rounded-md'>
                                        <MdLocationCity color='black'/>
                                        <p className='text-black col-span-12 md:text-md  g-f:text-sm'>{`${profile?.adres}`}</p>
                                    </div>
                                )}

                                {profile.age&&(
                                    <div className='g-f:col-span-12  mt-2 sm:col-span-6  col-start-1 flex items-center p-3 space-x-2 col-span-6 border border-black rounded-md'>
                                        <MdElderly color='black'/>
                                        <p className='text-black col-span-12 md:text-md  g-f:text-sm'>{`Age: ${profile?.age}`}</p>    
                                    </div>
                                )}
                                {profile.gender&&(
                                    <div className='g-f:col-span-12 sm:ml-1 mt-2 sm:col-start-7 sm:col-span-6   flex items-center p-3 space-x-2 border border-black rounded-md'>
                                        <i className='text-black col-span-1 md:text-md'><GenderIcon gender={profile?.gender}/></i>
                                        <p className='text-black col-span-12 md:text-md  g-f:text-sm'>{`Gender: ${profile?.gender}`}</p>
                                    </div>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                  </Accordion>
              </div>
      );
}
 
export default PublicAccordion;