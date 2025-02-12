// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// import { FaPhone } from "react-icons/fa";
// import { MdElderly, MdLocationCity } from "react-icons/md";
// import GenderIcon from "../functions/GenderIcon";
// import { Profile } from "@/actions/UserProfile";
// import { ProfileData } from "@/components/types/globalTs";

// type PublicAccordionProps ={
//     profile:ProfileData,
//     className?:string
// }

// const PublicAccordion:React.FC<PublicAccordionProps> = ({profile,className}) => {
//     return (

//         <div className={`${className}`}>
//                   <Accordion type="single" collapsible className='p-2'>
//                     <AccordionItem value="item-1" >
//                       <AccordionTrigger className='text-black  font-semibold flex justify-between p-1 md:text-xl g-f:text-sm md:ml-0 g-f:ml-2'>{profile?.firstName}</AccordionTrigger>
//                         <AccordionContent>
//                             <div className='grid grid-cols-12 '>

//                                 {profile?.phoneNumber&&(
//                                     <div className='g-f:col-span-12 g-f:mt-2 col-start-1 sm:col-span-6 flex space-x-2 border border-black rounded-md p-3'>
//                                         <FaPhone color='black'/>
//                                         <p className='text-black col-span-12 md:text-md g-f:text-sm'>{`${profile?.phoneNumber}`}</p>
//                                     </div>
//                                 )}

//                                 {profile?.adres&&(
//                                     <div className='g-f:col-span-12 g-f:mt-2 sm:ml-1 sm:col-span-6 sm:col-start-7 flex items-center p-3 space-x-2 border border-black rounded-md'>
//                                         <MdLocationCity color='black'/>
//                                         <p className='text-black col-span-12 md:text-md  g-f:text-sm'>{`${profile?.adres}`}</p>
//                                     </div>
//                                 )}

//                                 {profile?.age&&(
//                                     <div className='g-f:col-span-12  mt-2 sm:col-span-6  col-start-1 flex items-center p-3 space-x-2 col-span-6 border border-black rounded-md'>
//                                         <MdElderly color='black'/>
//                                         <p className='text-black col-span-12 md:text-md  g-f:text-sm'>{`Age: ${profile?.age}`}</p>    
//                                     </div>
//                                 )}
//                                 {profile?.gender&&(
//                                     <div className='g-f:col-span-12 sm:ml-1 mt-2 sm:col-start-7 sm:col-span-6   flex items-center p-3 space-x-2 border border-black rounded-md'>
//                                         <i className='text-black col-span-1 md:text-md'><GenderIcon gender={profile?.gender} color="black"/></i>
//                                         <p className='text-black col-span-12 md:text-md  g-f:text-sm'>{`Gender: ${profile?.gender}`}</p>
//                                     </div>
//                                 )}
//                             </div>
//                         </AccordionContent>
//                     </AccordionItem>
//                   </Accordion>
//               </div>
//       );
// }
// export default PublicAccordion
 
// export default PublicAccordion;

import type React from "react"
import { useState } from "react"
import { FaPhone } from "react-icons/fa"
import { MdElderly, MdLocationCity } from "react-icons/md"
import GenderIcon from "../functions/GenderIcon"
import type { ProfileData } from "@/components/types/globalTs"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"
import { ProfileTabs } from "./profileStatsTabs"
import { useTimeSince } from "./hooks/useTimeSince"


type PublicAccordionProps = {
  profile: ProfileData
  className?: string
}

const PublicAccordion: React.FC<PublicAccordionProps> = ({ profile, className }) => {
  const [showAll, setShowAll] = useState(false)
  const timeSinceCreated = useTimeSince(profile?.createdAt);
  const infoItems = [
    { icon: <MdLocationCity color="gray" />, text: profile?.adres },
    { icon: <MdElderly color="gray" />, text: profile?.age ? `${profile.age} years old` : null },
    { icon: <GenderIcon gender={profile?.gender} color="gray" />, text: profile?.gender },
    { icon: <FaPhone color="gray" className="mr-2" />, text: profile?.phoneNumber },
  ].filter((item) => item.text)

  const visibleItems = infoItems.slice(0, 2)
  const hiddenItems = infoItems.slice(2)



  return (
    <div className={`${className} bg-card`}>
      <header className="flex justify-end ">
    

        {/* <h2>{profile?.shortname}</h2> */}
      
        <h3 className='text-gray-600 text-sm mt-2 ml-5'>
         {timeSinceCreated? timeSinceCreated : ''} 
        </h3>  

      </header>
      
     
    <div className="flex-1 flex-col md:flex-row md:items-start md:justify-between">
      
      {/* Left side - Profile info */}
      <div className="flex-1 space-y-2">
       
        <div className="flex flex-wrap">
          <div className="max-w-[11rem] space-y-2">
            {visibleItems.map((item, index) => (
              <div key={index} className="flex items-center">
                {item.icon}
                <p className="text-gray-600 ml-2 md:text-md g-f:text-sm">{item.text}</p>
              </div>
            ))}
            <AnimatePresence initial={false}>
              {showAll && (
                <motion.div
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { opacity: 1, height: "auto" },
                    collapsed: { opacity: 0, height: 0 },
                  }}
                  transition={{ duration: 0.7, ease: [0.1, 0.62, 0.23, 0.7] }}
                >
                  {hiddenItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.005, delay: index * 0.005 }}
                      className="flex items-center mt-2"
                    >
                      {item.icon}
                      <p className="text-gray-600 ml-2 md:text-md g-f:text-sm">{item.text}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
  
      {/* Right side - Stats container */}
      <div className="flex-1 min-w-full mb-2">
          <ProfileTabs profile={profile} />
        </div>
    </div>
  
    {/* Full-width Button at the bottom */}
    {infoItems.length>2 && (
       <button
       onClick={() => setShowAll(!showAll)}
       className="w-full py-2 mt-4  bg-muted/10 hover:bg-muted-foreground/10 transition-colors flex items-center justify-center"
       aria-label={showAll ? "Show Less" : "Show More"}
     >
       {showAll ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
     </button>
    )}
   
  </div>
  
  )
}

export default PublicAccordion

