'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Balance {
  USDT?: number;
  BTC?: number;
}

interface User {
  balance: Balance;
  username: string;
}


export default function Header({ isSidebarOpen, toggleSidebar }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch('/api/user', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser((prev) => ({ ...prev, balance: data.data.balance, username: data.data.username }));
      } else {
        console.error('Error fetching user data:', await response.json());
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async (redirect) => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Для передачі cookies
      });

      if (res.ok) {
        setUser(null);
        router.push(redirect); // Перенаправлення після виходу
      } else {
        console.error('Error logging out:', await res.json());
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="bg-[url('/header.png')] bg-cover text-white max-h-[125px] shadow-md p-4 flex justify-between items-center">
      <div className='flex justify-between w-full max-w-[1149px] mr-auto ml-auto items-center'>
        <div className='flex gap-[20px] items-center'>
          <Image
            src="/logo.png"
            alt="Your image description"
            width={83}
            height={66}
            style={{ objectFit: "cover" }}
            priority={false}
          />
        </div>
        <div>
          <div className='flex items-center gap-[10px] justify-end'>
            <div className='uppercase text-[24px] bold hidden sm:block'>Баланс</div>
            {user?.balance && <div className='uppercase text-[24px] bold text-[#3581FF] hidden sm:block'>{user?.balance?.USDT?.toFixed(2)} USDT</div>}
            <button className="flex items-center justify-center gap-2 px-[3px] py-[2px] text-black hover:bg-gray-600">
              <Image
                src="/dashboard/globe.svg"
                alt="Your image description"
                width={45}
                height={45}
                style={{ objectFit: "cover" }}
                priority={false}
              />
            </button>
            {/* <div className="relative">
              <button className="flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600">
                <Image
                  src="/dashboard/bell.svg"
                  alt="Your image description"
                  width={45}
                  height={45}
                  style={{ objectFit: "cover" }}
                  priority={false}
                />
              </button>
              <span className="absolute top-0 right-0 flex items-center justify-center w-[25px] h-[25px] bg-white text-[#00163A] text-[16px] font-bold rounded-full">
                2
              </span>
            </div> */}
            <Link href='/dashboard/profile'  className="flex items-center justify-center rounded-full hover:bg-gray-600">
              <Image
                src="/dashboard/contacts.svg"
                alt="Your image description"
                width={45}
                height={45}
                style={{ objectFit: "cover" }}
                priority={false}
              />
            </Link>
            <button onClick={() => handleLogout('/')} className="flex items-center justify-center rounded-full hover:bg-gray-600">
              <Image
                src="/dashboard/exit.svg"
                alt="Your image description"
                width={45}
                height={45}
                style={{ objectFit: "cover" }}
                priority={false}
              />
            </button>
            {!isSidebarOpen && (
              <div onClick={toggleSidebar} className="sm:hidden">
                <Image
                  src="/dashboard/menu.svg"
                  alt="Your image description"
                  width={45}
                  height={45}
                  style={{ objectFit: "cover" }}
                  priority={false}
                />
              </div>
            )}
          </div>
          <div className='flex gap-[5px]'>
          <div className='uppercase text-[14px] bold sm:hidden block'>Баланс</div>
          {user?.balance && <div className='uppercase text-[14px] bold text-[#3581FF] sm:hidden block'>{user?.balance?.USDT?.toFixed(2)} USDT</div>}
          </div>
        </div>
      </div>
    </header>
  );
}
