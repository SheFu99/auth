// components/Tabs.js
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TabsProvider, useTabs } from "./context/TabsContext";
import { HashLoader } from 'react-spinners';

const Tabs = ({ children, defaultId }) => {
  const searchParams = useSearchParams();
  const tabIdFromUrl = searchParams.get('tab') || defaultId;

  return <TabsProvider defaultId={tabIdFromUrl}>{children}</TabsProvider>;
};

const TabsList = ({ children, className }) => {
  return <div className={`${className} flex border-b`}>{children}</div>;
};

const TabsTrigger = ({ children, id, className }) => {
  const { activeTab, setActiveTab } = useTabs();
  const router = useRouter();

  const handleClick = () => {
    setActiveTab(id);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', id);
    router.push(`${window.location.pathname}?${params.toString()}`);
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

const TabsContent = ({ children, id, className }) => {
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
