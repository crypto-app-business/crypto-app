'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DepositComponent from '@/components/dashboard/DepositComponent/DepositComponent';
import PendingDeposits from '@/components/dashboard/PendingDeposits/PendingDeposits';
import AdminDeposits from '@/components/dashboard/AdminDeposits/AdminDeposits';
import AdminTransfer from '@/components/dashboard/AdminTransfer/AdminTransfer';
import AdminWithdrawal from '@/components/dashboard/AdminWithdrawal/AdminWithdrawal';
import AdminTable from '@/components/dashboard/AdminTable/AdminTable';
import MiningActivation from '@/components/dashboard/MiningActivation/MiningActivation';
import DashboardPanel from '@/components/dashboard/DashboardPanel/DashboardPanel';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // register?referrer=ABCD1234З
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
            registrationDate: userExtraData.data.registrationDate,
            referrer: userExtraData.data.referrer
          }));
        } else {
          console.error('Error fetching user data:', await userRes.json());
        }
      } catch (error) {
        console.error('Error initializing user:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    initializeUser();
  }, [router]);

  // useEffect(() => {
  //   if (!user?.id) return;

  //   const updateMiningBalances = async () => {
  //     try {
  //       const miningRes = await fetch('/api/mining/complete', {
  //         method: 'PATCH',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ userId: user.id }),
  //       });
  //       if (!miningRes.ok) {
  //         console.error('Ошибка обновления баланса для майнинга.');
  //       }

  //       const listingRes = await fetch('/api/listing/complete', {
  //         method: 'PATCH',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ userId: user.id }),
  //       });
  //       if (!listingRes.ok) {
  //         console.error('Ошибка обновления баланса для листинга.');
  //       }
  //       const nftRes = await fetch('/api/nft-session', {
  //         method: 'PATCH',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ userId: user.id }),
  //       });
  //       if (!nftRes.ok) {
  //         console.error('Ошибка обновления баланса для листинга.');
  //       }
  //     } catch (error) {
  //       console.error('Ошибка сервера при обновлении баланса:', error);
  //     }
  //   };

  //   updateMiningBalances();
  // }, [user?.id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <div className="">
        {user?.role === 'admin' && <AdminDeposits user={user} />}
        {user?.role === 'admin' && <AdminWithdrawal user={user} />}
        {user?.role === 'admin' && <AdminTransfer user={user} />}
        {user?.role === 'admin' && <AdminTable user={user} />}
        <DashboardPanel user={user} />
      </div>
    </div>
  );
}