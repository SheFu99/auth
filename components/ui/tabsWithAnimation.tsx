// import { ReactNode, useEffect, useState } from 'react';

// export interface TabProps {
//     id: string;
//     title: string;
//     content: string;
//     icon?: ReactNode;
// }
// interface TabData {
//     tabsData: TabProps[];
// }


// const Tabs: React.FC<TabData> = ({tabsData}) => {
//     const [activeTab, setActiveTab] = useState<string|undefined>(tabsData[0]?.id||undefined);
//     const [prevTab, setPrevTab] = useState<string>("");
//     const [direction , setDirection]=useState<string>("right")

//     useEffect(() => {
//         setActiveTab(tabsData[0].id);  // Ensure the first tab is selected initially
//     }, [tabsData]); 

//     const changeTab = (newTab: string) => {
//         if (newTab === activeTab) return;  // No change if the new tab is already active
    
//         const newTabIndex = tabsData.findIndex(tab => tab.id === newTab);
//         const currentTabIndex = tabsData.findIndex(tab => tab.id === activeTab);
    
//         setPrevTab(activeTab);  // Set the currently active tab as the previous tab
//         setActiveTab(newTab);   // Update the active tab to the new tab
    
//         // Determine the direction based on tab index
//         const directionVector = newTabIndex > currentTabIndex ? 'right' : 'left';
//         setDirection(directionVector);  // This will set the state to control the animation direction
//     };
    
//     const getMotionClass = (isActive: boolean) => {
//         if (isActive) {
//             return direction === 'right' ? 'animate-slide-in-from-right' : 'animate-slide-in-from-left';
//         } else {
//             return direction === 'right' ? 'animate-slide-out-to-left' : 'animate-slide-out-to-right';
//         }
//     };
    

//     return (
//         <div className="w-full  px-2 py-4">
//             <div className="flex border-b border-gray-300">
//                 {tabsData?.map(tab => (
//                     <button
//                         key={tab.id}
//                         className={`flex-1 py-2 text-sm font-medium text-center
//                                     ${tab.id === activeTab ? 'text-white border-white' : 'text-gray-500 border-transparent'}
//                                     border-b-2 transition duration-300 ease-in-out`}
//                         onClick={() => changeTab(tab.id)}
//                     >
//                         <div className='flex align-middle items-center gap-3'>
//                             {tab.icon}
//                             {tab.title}
//                         </div>
                        
//                     </button>
//                 ))}
//             </div>
//             <div className="relative w-full ">
//                 {tabsData.map(tab => (
//                     <div
//                         key={tab.id}
//                         className={`bg-white rounded-md text-black absolute w-full p-4 transition-all duration-300 ease-out ${getMotionClass(tab.id === activeTab)} ${tab.id === activeTab ? '' : 'hidden'}`}
//                     >
//                         {tab.content}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default Tabs;
