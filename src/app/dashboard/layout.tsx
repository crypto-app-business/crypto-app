'use client';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import DashboardHeader from '@/components/DashboardHeader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen">
      <Header />
      <div className="flex p-4">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <DashboardHeader />
          <main className="p-6 bg-gray-50 flex-1 shadow-inner overflow-y-auto rounded-tl-xl">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
