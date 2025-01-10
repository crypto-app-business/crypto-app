'use client';
import { useState } from 'react';
// import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  // const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // const [notifications, setNotifications] = useState<number>(3); // Кількість повідомлень
  // const [language, setLanguage] = useState<{ flag: string; code: string }>({
  //   flag: '/flags/ua.png', // Прапор України
  //   code: 'UA',
  // });

  // const handleLogout = () => {
  //   localStorage.removeItem('jwt'); // Видалення JWT-токену
  //   router.push('/login'); // Перенаправлення на сторінку логіну
  // };

  return (
    <header className="bg-[#1e2832] text-white min-h-[100px] shadow-md p-4 flex justify-between items-center">
      <div className='flex justify-between w-full'>
        <div className='flex gap-[20px] items-center'>
          <Image
            src="/logo.png"
            alt="Your image description" 
            width={100} 
            height={100} 
            objectFit="cover"
            priority={false}
          />
          <h1 className='text-[40px] hidden sm:block'>Crypto Corporation</h1>
          <div className='flex flex-col'>
          </div>
        </div>
        <div className='flex flex-col gap-[5px] justify-center'>
          <div className='flex items-center gap-[5px] justify-end'>
            <button
              onClick={toggleDarkMode}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600"
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? '🌙' : '☀️'}
            </button>
            <div className="relative">
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600">
                🔔
              </button>
              <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-sm text-white bg-red-500 rounded-full">
                3
              </span>
            </div>
            <button className="flex items-center justify-center gap-2 px-[3px] py-[2px] bg-white text-black hover:bg-gray-600 rounded-full">
              <span className="fi fi-ru flex items-center justify-center rounded-full w-[20px] h-[20px]" style={{ fontSize: '20px' }}></span>
              RU
            </button>
            <button className="flex items-center justify-center w-7 h-7 rounded-full bg-white hover:bg-gray-600">
              👤
            </button>
          </div>
          <div className='flex gap-[10px] flex-wrap'>
            <button className="px-2 py-1 sm:py-2 sm:px-4 text-white bg-black rounded hover:bg-gray-800">
              Пополнить
            </button>
            <button className="px-2 py-1 sm:py-2 sm:px-4 text-white bg-blue rounded hover:bg-blue-600">
              Мои инвестиции
            </button>
          </div>
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
