import { useEffect, useState } from "react";
import { TabsProvider, useTabs } from "./context/TabsContext";
import { HashLoader } from "react-spinners";


 const Tabs:React.FC<React.PropsWithChildren<{ defaultId: string }>> = ({ children, defaultId }) => {
    return <TabsProvider defaultId={defaultId}>{children}</TabsProvider>;
};

 const TabsList: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
    return <div className={`${className} flex border-b`}>{children}</div>;
};

const TabsTrigger: React.FC<React.PropsWithChildren<{ id: string; className?: string }>> = ({ children, id, className }) => {
  const { activeTab,setActiveTab } = useTabs();
  return (
      <button
          className={`${className} py-2 px-4 flex-1 mt-1 text-sm font-medium text-center
          ${id === activeTab ? 'text-white border-white scale-110' : 'text-gray-500 border-transparent'}
          border-b-2 transition duration-300 ease-in-out`}
          onClick={() => setActiveTab(id)}
      >
          {children}
      </button>
  );
};


const TabsContent: React.FC<React.PropsWithChildren<{ id: string; className?: string }>> = ({ children, id, className }) => {
    const { activeTab, direction } = useTabs();
    const isActive = activeTab === id;
    const [loading, setLoading] = useState(false);
    const [contentVisible, setContentVisible] = useState(isActive);
  
    useEffect(() => {
      if (isActive) {
        setLoading(true);
        setContentVisible(true); // Ensure content is visible when tab is active
        setTimeout(() => {
          setLoading(false);
        }, 500); // Adjust the timing to match your content's readiness
      } else {
        setTimeout(() => {
          setContentVisible(false); // Hide content after animation if tab is not active
        }, 300); // Delay hiding the content to avoid blinking
      }
    }, [isActive]);
  
    const motionClass = isActive
      ? (direction === 'right' ? 'animate-slide-in-from-right' : 'animate-slide-in-from-left')
      : (direction === 'right' ? 'animate-slide-out-to-left' : 'animate-slide-out-to-right');
  
    return (
      <>
        {loading && (
          <div className="w-full flex justify-center items-center min-h-[65vh]">
            <HashLoader color="white" />
          </div>
        )}
        <div className={`${!contentVisible ? 'hidden' : ''} ${loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}>
          <div className={`${className} transition-all duration-300 ease-out ${isActive ? '' : 'hidden'} ${motionClass}`}>
            {children}
          </div>
        </div>
      </>
    );
  };

export { Tabs, TabsList, TabsTrigger, TabsContent };
