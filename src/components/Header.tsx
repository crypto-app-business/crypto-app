'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguageStore } from '@/store/useLanguageStore';

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
  const { language, toggleLanguage } = useLanguageStore();

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
  }, [router, setUser]);

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
        credentials: 'include',
      });

      if (res.ok) {
        setUser(null);
        router.push(redirect);
      } else {
        console.error('Error logging out:', await res.json());
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="bg-cover bg-[#3581FF] text-white max-h-[125px] shadow-md flex justify-between items-center">
      <div className='w-full p-4' style={{ background: 'linear-gradient(180deg, rgba(53, 191, 255, 0) 33.1%, rgba(53, 191, 255, 0.74) 100%)' }}>
        <div className='flex justify-between w-full max-w-[1149px] mr-auto ml-auto items-center'>
          <div className='flex items-center gap-[10px]'>
            <div className='flex gap-[20px] items-center bg-white rounded-full'>
              <Image src="/logo.png" alt="Logo" width={83} height={66} style={{ objectFit: "cover" }} priority={false} />
            </div>
            <div className='text-[25px]'>
              <div>Crypto</div>
              <div>Corporation</div>
            </div>
          </div>
          <div>
            <div className='flex items-center gap-[10px] justify-end'>
              <div className='uppercase text-[24px] bold hidden sm:block'>{language === 'ru' ? 'Баланс' : 'Balance'}</div>
              {user?.balance && <div className='uppercase text-[24px] bold text-[#3581FF] hidden sm:block'>{user?.balance?.USDT?.toFixed(2)} USDT</div>}
              
              {/* Кнопка перемикання мови */}
              <button onClick={toggleLanguage} className="flex items-center justify-center gap-2 px-[3px] py-[2px] text-black hover:bg-gray-600">
                <Image src="/dashboard/globe.svg" alt="Change language" width={45} height={45} style={{ objectFit: "cover" }} priority={false} />
              </button>

              <Link href='/dashboard/profile' className="flex items-center justify-center rounded-full hover:bg-gray-600">
                <Image src="/dashboard/contacts.svg" alt="Profile" width={45} height={45} style={{ objectFit: "cover" }} priority={false} />
              </Link>
              <button onClick={() => handleLogout('/')} className="flex items-center justify-center rounded-full hover:bg-gray-600">
                <Image src="/dashboard/exit.svg" alt="Logout" width={45} height={45} style={{ objectFit: "cover" }} priority={false} />
              </button>
              
              {!isSidebarOpen && (
                <div onClick={toggleSidebar} className="sm:hidden">
                  <Image src="/dashboard/menu.svg" alt="Menu" width={45} height={45} style={{ objectFit: "cover" }} priority={false} />
                </div>
              )}
            </div>
            <div className='flex gap-[5px]'>
              {user?.balance && <div className='uppercase text-[14px] bold sm:hidden block'>{language === 'ru' ? 'Баланс' : 'Balance'}</div>}
              {user?.balance && <div className='uppercase text-[14px] bold text-[#3581FF] sm:hidden block'>{user?.balance?.USDT?.toFixed(2)} USDT</div>}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
