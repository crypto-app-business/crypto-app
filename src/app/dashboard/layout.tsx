'use client';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import DashboardHeader from '@/components/DashboardHeader';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


interface User {
  balance: { [key: string]: number }; // Наприклад, { USDT: number, BTC: number }
  username: string;
  id: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("Главная");
  const router = useRouter();
  const [user, setUser] = useState<User| null>(null);

    useEffect(() => {
      const initializeUser = async () => {
        try {
          const authRes = await fetch('/api/auth/me');
          if (!authRes.ok) {
            router.push('/login');
            return;
          }
          const userData = await authRes.json();
          if (!userData.id) {
            // Якщо id немає, перенаправляємо на логін
            router.push('/login');
            return;
          }
          setUser(userData);
  
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
              id: userData.id,
            }));
          } else {
            console.error('Error fetching user data:', await userRes.json());
          }
        } catch (error) {
          console.error('Error initializing user:', error);
          router.push('/login');
        } finally {
        }
      };
      initializeUser();
    }, [router]);


  const toggleSidebar = () => {
    if (window.innerWidth > 768) return
    setIsSidebarOpen(!isSidebarOpen);
  };

    useEffect(() => {
      if (!user?.id) return;
  
      const updateMiningBalances = async () => {
        try {
          const miningRes = await fetch('/api/mining/complete', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id }),
          });
          if (!miningRes.ok) {
            console.error('Ошибка обновления баланса для майнинга.');
          }
  
          const listingRes = await fetch('/api/listing/complete', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id }),
          });
          if (!listingRes.ok) {
            console.error('Ошибка обновления баланса для листинга.');
          }
          const nftRes = await fetch('/api/nft-session', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id }),
          });
          if (!nftRes.ok) {
            console.error('Ошибка обновления баланса для листинга.');
          }
        } catch (error) {
          console.error('Ошибка сервера при обновлении баланса:', error);
        }
      };
  
      updateMiningBalances();
    }, [user?.id]);

  return (
    <div className="min-h-screen !bg-none"
    style={{
      // background: 'linear-gradient(180.00deg, rgb(255, 255, 255),rgba(113, 156, 228, 0) 100%)',
      // background: 'linear-gradient(to bottom, rgb(255, 255, 255), rgba(113, 156, 228, 0) 100%)'
      background: 'linear-gradient(180.00deg, rgb(255, 255, 255),rgba(113, 156, 228, 0) 100%),rgb(251, 252, 255)'
    }}
    >
      {/* <div className='bg-[#FBFCFF] w-full h-[500px]'>
      <div className='w-full h-[500px]'
          style={{
            // background: 'linear-gradient(180deg, rgb(255, 255, 255),rgba(113, 156, 228, 0) 100%)',
            // background: 'linear-gradient(180deg, rgba(53, 191, 255, 0) 33.1%, rgba(53, 191, 255, 0.74) 100%)',
            // background: 'linear-gradient(180.00deg, rgb(113, 156, 228, ), rgba(255, 255, 255, 0) 100%)'
          }}
      >
      </div>
      </div> */}
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
      <div className="flex mt-[40px] mr-auto ml-auto sm:mr-[16px] sm:ml-[16px] md:mr-[115px] md:ml-[115px]"

                >
        {/* <div className="flex mt-[40px] sm:mr-[16px] sm:ml-[16px] md:mr-[40px] md:ml-[40px]"> */}
        {/* <div className="flex mt-[40px]  mr-[112px] ml-[112px]"> */}
        {/* <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg"
          aria-label={isSidebarOpen ? "Закрити меню" : "Відкрити меню"}
        >
          {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
        </button> */}
        <div className={`
          fixed top-0 left-0 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-30
          ${isSidebarOpen ? 'translate-x-0 w-full h-full sm:w-[384px] sm:h-auto rounded-none' : '-translate-x-full w-[370px] h-max rounded-[15px]'}
          md:translate-x-0 md:static md:z-0
        `}>
          <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} setActiveTab={setActiveTab} activeTab={activeTab} />
        </div>
        <div className="flex flex-col flex-1">
          <DashboardHeader activeTab={activeTab}/>
          <main className="sm:p-[35px] sm:pr-0 pt-[30px] mx-auto sm:mx-0  flex-1  overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
