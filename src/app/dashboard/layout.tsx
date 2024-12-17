// src/app/dashboard/layout.tsx
'use client';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />

        {/* Content */}
        <main className="p-6 bg-gray-50 flex-1 shadow-inner overflow-y-auto rounded-tl-xl">
          {children}
        </main>
      </div>
    </div>
  );
}
