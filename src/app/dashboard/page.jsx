'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          router.push('/login'); // Перенаправлення на вхід
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  // return (
  //   <div className="flex h-screen">
  //     {/* Sidebar */}
  //     <aside className="w-64 bg-gray-800 text-white flex flex-col">
  //       <div className="p-4 text-lg font-bold">Мій Дашборд</div>
  //       <nav className="flex-grow">
  //         <ul>
  //           <li className="p-4 text-black hover:bg-gray-700 cursor-pointer">Головна</li>
  //           <li className="p-4 text-black hover:bg-gray-700 cursor-pointer">Профіль</li>
  //           <li className="p-4 text-black hover:bg-gray-700 cursor-pointer">Налаштування</li>
  //         </ul>
  //       </nav>
  //       <div className="p-4 text-sm text-gray-400">© 2024 Мій Проект</div>
  //     </aside>

  //     {/* Main Content */}
  //     <div className="flex-grow bg-gray-100">
  //       {/* Header */}
  //       <header className="bg-white shadow p-4 flex justify-between items-center">
  //         <h1 className="text-xl font-bold">Вітаємо в Дашборді!</h1>
  //         <div className="flex items-center">
  //           {user ? (
  //             <>
  //               <span className="mr-4 text-gray-700">Привіт, {user.name}!</span>
  //               <button
  //                 onClick={() => {
  //                   // Логіка виходу
  //                   setUser(null);
  //                   router.push('/login');
  //                 }}
  //                 className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
  //               >
  //                 Вийти
  //               </button>
  //             </>
  //           ) : (
  //             <span className="text-gray-500">Завантаження...</span>
  //           )}
  //         </div>
  //       </header>

  //       {/* Main Section */}
  //       <main className="p-6">
  //         <p>Це ваш основний контент.</p>
  //       </main>
  //     </div>
  //   </div>
  // );

    return (
      <div className="grid grid-cols-3 gap-6">
        {/* <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
          <h2 className="text-xl font-semibold text-gray-700">Загальна Статистика</h2>
          <p className="text-gray-500 mt-2">Тут буде статистика користувача.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
          <h2 className="text-xl font-semibold text-gray-700">Останні Оновлення</h2>
          <p className="text-gray-500 mt-2">Тут буде список оновлень.</p>
        </div> */}
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
          <h2 className="text-xl font-semibold text-gray-700">Пейджа</h2>
          <p className="text-gray-500 mt-2">Поточна активність користувача.</p>
        </div>
      </div>
    );
}
