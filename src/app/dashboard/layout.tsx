'use client';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import DashboardHeader from '@/components/DashboardHeader';
import { useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen">
      <Header/>
      <div className="flex p-4">
        {/* <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg"
          aria-label={isSidebarOpen ? "Закрити меню" : "Відкрити меню"}
        >
          {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
        </button> */}
        <div className={`
          fixed top-30 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-30
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:z-0
        `}>
          <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
        <div className="flex flex-col flex-1">
          <DashboardHeader isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
          <main className="m-4 bg-gray-50 flex-1 shadow-inner overflow-y-auto rounded-tl-xl">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
