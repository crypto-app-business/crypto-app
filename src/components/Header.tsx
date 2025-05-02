'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '@/store/useLanguageStore';

interface Balance {
  USDT?: number;
  BTC?: number;
}

interface User {
  balance: Balance;
  username: string;
  id: string;
}

export default function Header({ isSidebarOpen, toggleSidebar }: { isSidebarOpen: boolean; toggleSidebar: () => void }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bonusRang, setBonusRang] = useState<number | null>(0);
  const [isLoading, setIsLoading] = useState(true);
  const { language, toggleLanguage } = useLanguageStore();

  const fetchUserData = async () => {
    try {
      const userRes = await fetch('/api/user', {
        method: 'GET',
        credentials: 'include',
      });
      if (userRes.ok) {
        const userExtraData = await userRes.json();
        setUser((prev) => ({
          ...prev,
          balance: userExtraData.data.balance,
          username: userExtraData.data.username,
          id: userExtraData.data.id,
        }));
      } else {
        console.error('Error fetching user data:', await userRes.json());
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      setIsLoading(true);
      try {
        const authRes = await fetch('/api/auth/me');
        if (!authRes.ok) {
          router.push('/login');
          return;
        }
        const userData = await authRes.json();
        setUser(userData);

        await fetchUserData();
      } catch (error) {
        console.error('Error initializing user:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    initializeUser();
  }, [router]);

  useEffect(() => {
    const handleUpdateBalance = () => {
      fetchUserData();
    };

    window.addEventListener('updateBalance', handleUpdateBalance);
    return () => {
      window.removeEventListener('updateBalance', handleUpdateBalance);
    };
  }, []);

  useEffect(() => {
    if (user?.id) {
      getBonus(user.id);
    }
  }, [user?.id]);

  const getBonus = async (id: string) => {
    try {
      const bonusRes = await fetch(`/api/bonus?userId=${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!bonusRes.ok) {
        console.error('Ошибка поиска баланса:', await bonusRes.json());
        return;
      }

      const bonusData = await bonusRes.json();
      if (bonusData?.bonus?.rang) {
        setBonusRang(+bonusData.bonus.rang);
      } else {
        console.error('Неправильный формат данных:', bonusData);
      }
    } catch (error) {
      console.error('Ошибка сервера:', error);
    }
  };

  const handleLogout = async (redirect: string) => {
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const translations = {
    accountRank: {
      ru: "Ранг аккаунта",
      en: "Account rank",
    },
  };

  return (
    <header className="bg-cover bg-[#3581FF] text-white max-h-[125px] shadow-md flex justify-between items-center">
      <div className='w-full p-4' style={{ background: 'linear-gradient(180deg, rgba(53, 191, 255, 0) 33.1%, rgba(53, 191, 255, 0.74) 100%)' }}>
        <div className='flex justify-between w-full max-w-[1149px] mr-auto ml-auto items-center'>
          <div className='flex items-center gap-[10px]'>
            <div className='flex gap-[20px] items-center bg-white rounded-full w-[50px] sm:w-[83px]'>
              <Image src="/logo.png" alt="Logo" width={83} height={66} style={{ objectFit: "cover" }} priority={false} />
            </div>
            <div className='sm:text-[25px] text-[12px]'>
              <div>Crypto</div>
              <div>Corporation</div>
            </div>
          </div>
          <div>
            <div className='flex items-center gap-[10px] justify-end'>
              <div className='uppercase text-[24px] bold hidden sm:block'>{language === 'ru' ? 'Баланс' : 'Balance'}</div>
              {user?.balance && <div className='uppercase text-[24px] bold text-white hidden sm:block'>{user?.balance?.USDT?.toFixed(2)} USDT</div>}

              {/* Кнопка перемикання мови */}
              <button onClick={toggleLanguage} className="flex items-center justify-center gap-2 px-[3px] py-[2px] text-black hover:bg-gray-600">
                <Image src="/dashboard/globe.svg" alt="Change language" width={45} height={45} style={{ objectFit: "cover" }} priority={false} />
              </button>

              <div className="relative group">
                <div className="w-[35px] h-[35px] rounded-full border-[4px] border-white flex justify-center items-center font-bold">
                  {bonusRang}
                </div>
                <div className="absolute hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  {language === 'ru' ? translations.accountRank.ru : translations.accountRank.en}
                </div>
              </div>
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
              {user?.balance && <div className='uppercase text-[14px] bold text-white sm:hidden block'>{user?.balance?.USDT?.toFixed(2)} USDT</div>}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}