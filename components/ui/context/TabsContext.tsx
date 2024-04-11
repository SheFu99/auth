import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TabsContextType {
    activeTab: string;
    setActiveTab: (id: string) => void;
    direction: string;
    setDirection: (direction: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const useTabs = () => {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error('useTabs must be used within a TabsProvider');
    }
    return context;
};

export const TabsProvider: React.FC<React.PropsWithChildren<{ defaultId: string, children: ReactNode }>> = ({ children, defaultId }) => {
    const [activeTab, setActiveTab] = useState<string>(defaultId);
    const [direction, setDirection] = useState<string>('right');

    const changeTab = (newTab: string) => {
        if (newTab === activeTab) return;

        const currentTab = activeTab;
        setActiveTab(newTab);   // Change tab first to trigger re-render
        
        // Assume tab IDs have inherent order: "tab1", "tab2", "tab3", etc.
        const directionVector = parseInt(newTab.replace(/^\D+/g, '')) > parseInt(currentTab.replace(/^\D+/g, '')) ? 'right' : 'left';
        setDirection(directionVector); // Update direction based on IDs comparison
    };

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab: changeTab, direction, setDirection }}>
            {children}
        </TabsContext.Provider>
    );
};
