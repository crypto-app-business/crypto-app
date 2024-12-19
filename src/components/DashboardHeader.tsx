// src/components/Header.tsx
'use client';
// import { useRouter } from 'next/navigation';

export default function DashboardHeader() {
  // const router = useRouter();

  return (
    <div className="bg-[#324458] text-white shadow-md p-4 ml-4 flex justify-center items-center rounded">
      <h1 className="text-xl font-bold text-gray-800">Главная</h1>
    </div>
  );
}
