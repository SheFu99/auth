import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import UserProfileForm from "../forms/UserProfileForm";
import { ProfileData } from "@/components/types/globalTs";
import { ExtendedUser } from "@/next-auth";

type ProfileAboutProps ={
    profile?:ProfileData,
    user?:ExtendedUser,
}

const ProfileAbout = ({profile,user}:ProfileAboutProps) => {

    return ( 
        <div className=" col-start-1 col-span-12 mt-1  bg-white  rounded-md shadow-md relative z-20 p-2">
        <div className=''>
            <Accordion type="single" collapsible className='p-1'>
              <AccordionItem value="item-1" >
                <AccordionTrigger className='text-black  font-semibold flex justify-between mb-1 p-1 md:text-xl g-f:text-sm md:ml-0 g-f:ml-2'>{user?.name}</AccordionTrigger>
                  <AccordionContent>
                      {/* {!addInfo && profile?.phoneNumber===undefined ?(
                        <div className='w-full'>
                              <div className=" bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 mt-1 rounded-md flex w-full flex-wrap justify-center">
                                <p className="text-black font-semibold text-center w-full g-f:text-sm">Add information about your-self </p>
                                  <button onClick={()=>swichAddInfo(true)} title='add info about yourself' >
                                    <IoMdAddCircleOutline color='black' className=" scale-150 block w-full"/>
                                  </button>
                              </div>
                        </div>
                      ):( */}
                      <UserProfileForm profile={profile} editProfileProps={true}  />
                    {/* )} */}
                  </AccordionContent>
              </AccordionItem>
            </Accordion>
        </div>
            
      </div>
     );
}
 
export default ProfileAbout;