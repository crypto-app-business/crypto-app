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
    <div className="h-screen ">
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
      <div className="flex mt-[40px] mr-auto ml-auto sm:mr-[16px] sm:ml-[16px] md:mr-[40px] md:ml-[40px]">
      {/* <div className="flex mt-[40px]  mr-[112px] ml-[112px]"> */}
        {/* <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg"
          aria-label={isSidebarOpen ? "Закрити меню" : "Відкрити меню"}
        >
          {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
        </button> */}
        <div className={`
          fixed top-0 left-0 w-full sm:w-[384px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-30
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:z-0
        `}>
          <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
        <div className="flex flex-col flex-1">
          <DashboardHeader/>
          <main className="m-4 bg-gray-50 flex-1  overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
