import { TabsProvider, useTabs } from "./context/TabsContext";


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
          className={`${className} py-2 px-4 flex-1  text-sm font-medium text-center
          ${id === activeTab ? 'text-white border-white' : 'text-gray-500 border-transparent'}
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
  const motionClass = isActive ? (direction === 'right' ? 'animate-slide-in-from-right' : 'animate-slide-in-from-left') :
                                 (direction === 'right' ? 'animate-slide-out-to-left' : 'animate-slide-out-to-right');

  return (
      <div className={`${className} transition-all duration-300 ease-out ${isActive ? '' : 'hidden'} ${motionClass}`}>
          {children}
      </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
