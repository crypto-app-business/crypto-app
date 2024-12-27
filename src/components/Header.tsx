// src/components/Header.tsx
'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Image from 'next/image';

export default function Header() {
  // const router = useRouter();
  // const [date, setDate] = useState<string>('');
  // const [time, setTime] = useState<string>('');
  // const [notifications, setNotifications] = useState<number>(3); // Кількість повідомлень
  // const [language, setLanguage] = useState<{ flag: string; code: string }>({
  //   flag: '/flags/ua.png', // Прапор України
  //   code: 'UA',
  // });

  // useEffect(() => {
  //   const updateDateTime = () => {
  //     const now = new Date();
  //     setDate(now.toLocaleDateString());
  //     setTime(now.toLocaleTimeString());
  //   };

  //   updateDateTime();
  //   const interval = setInterval(updateDateTime, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  // const handleLogout = () => {
  //   localStorage.removeItem('jwt'); // Видалення JWT-токену
  //   router.push('/login'); // Перенаправлення на сторінку логіну
  // };

  return (
    <header className="bg-[#1e2832] text-white min-h-[100px] shadow-md p-4 flex justify-between items-center">
      <div className='flex justify-between w-full'>
        <div className='flex gap-[20px]'>
          <h1 className='text-[40px]'>Лого</h1>
          <div className='flex flex-col'>
            {/* <div className='flex gap-[5px] align-middle'>
              <div>icon</div>
              <div>Дата</div>
              <div>date</div>
            </div>
            <div className='flex gap-[5px] align-middle'>
              <div>icon</div>
              <div>Время</div>
              <div>time</div>
            </div> */}
          </div>
        </div>
        <div>
          {/* <div className='flex'>
            <div>Уведомления</div>
            <div>Язик</div>
            <div>Профиль</div>
          </div> */}
          {/* <div className='flex'>
            <div>Кабинет</div>
            <div>Кабинет партнера</div>
          </div> */}
        </div>
      </div>
      {/* <h1 className="text-xl font-bold text-gray-800">Вітаємо у Дашборді!</h1>
      <button
        onClick={() => router.push('/login')}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-all"
      >
        Вийти
      </button> */}
    </header>
  );
}
