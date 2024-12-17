// src/components/Header.tsx
'use client';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">Вітаємо у Дашборді!</h1>
      <button
        onClick={() => router.push('/login')}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-all"
      >
        Вийти
      </button>
    </header>
  );
}
