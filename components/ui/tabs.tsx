// components/Tabs.js
// import {  useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TabsProvider, useTabs } from "./context/TabsContext";
import { HashLoader } from 'react-spinners';

const Tabs = ({ children, defaultId }) => {
  // const searchParams = useSearchParams();
  // const tabIdFromUrl = searchParams.get('tab') || defaultId;

  return <TabsProvider defaultId={defaultId}>{children}</TabsProvider>;
};

const TabsList = ({ children, className }) => {
  return <div className={`${className} flex border-b`}>{children}</div>;
};

const TabsTrigger = ({ children, id, className }) => {
  const { activeTab, setActiveTab } = useTabs();
  // const router = useRouter();

  const handleClick = () => {
    setActiveTab(id);
    // const params = new URLSearchParams(window.location.search);
    // params.set('tab', id);
    // router.push(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <button
      className={`${className} py-2 px-4 flex-1 mt-1 text-sm font-medium text-center
        ${id === activeTab ? 'text-white border-white scale-110' : 'text-gray-500 border-transparent'}
        transition duration-300 ease-in-out`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ children, id, className, type }) => {
  const { activeTab, direction } = useTabs();
  const isActive = activeTab === id;
  const [loading, setLoading] = useState(false);
  const [contentVisible, setContentVisible] = useState(isActive);

  useEffect(() => {
    if (isActive) {
      setLoading(true);
      setContentVisible(true);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } else {
      setTimeout(() => {
        setContentVisible(false);
      }, 300);
    }
    console.log('minHeightClass',type,minHeightClass)
  }, [isActive]);

  let minHeightClass = ''
  let minHeightLoader = ''
  switch (type) {
    case 'stats':
      minHeightClass = 'max-h-[65px]';
      minHeightLoader = 'max-h-[75px]';
      break;
    case 'posts':
      minHeightClass = 'min-h-[40vh]';
      minHeightLoader = 'min-h-[40vh]'; // or whatever loader style you want
      break;
    default:
      minHeightClass = '';
      minHeightLoader = '';
      break;
  }
  

  return (
    <div className={`${minHeightLoader}`}>
      {loading && (
        <div className={`w-full   flex justify-center items-center ${minHeightClass}`}>
          <HashLoader color="white" className='mt-5'/>
        </div>
      )}
      <div className={`${!contentVisible ? 'hidden' : ''} ${loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}>
        <div className={`${className} transition-all duration-300 ease-out ${isActive ? '' : 'hidden'} `}>
          {children}
        </div>
      </div>
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
