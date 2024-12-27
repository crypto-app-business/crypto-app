// src/components/Header.tsx
'use client';
// import { useRouter } from 'next/navigation';

const MenuIcon = () => (
  <svg 
    className="w-6 h-6" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

export default function DashboardHeader({isSidebarOpen, toggleSidebar}) {
  // const router = useRouter();

  return (
    <div className={`bg-[#324458] text-white shadow-md p-4 ml-4 flex  justify-between items-center rounded`}>
     { !isSidebarOpen && <div onClick={toggleSidebar} className={"sm:hidden"}><MenuIcon/></div>}
     <div className="w-full flex justify-center">
      <h1 className="text-xl font-bold text-gray-800">Главная</h1>
     </div>
      {/* <div className={"sm:w-[50%] hidden sm:block"}></div> */}
    </div>
  );
}
