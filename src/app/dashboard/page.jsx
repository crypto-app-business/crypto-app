'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DepositComponent from '@/components/dashboard/DepositComponent/DepositComponent';
import PendingDeposits from '@/components/dashboard/PendingDeposits/PendingDeposits';
import AdminDeposits from '@/components/dashboard/AdminDeposits/AdminDeposits';
import AdminWithdrawal from '@/components/dashboard/AdminWithdrawal/AdminWithdrawal';
import AdminTable from '@/components/dashboard/AdminTable/AdminTable';
import MiningActivation from '@/components/dashboard/MiningActivation/MiningActivation';
import DashboardPanel from '@/components/dashboard/DashboardPanel/DashboardPanel';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // register?referrer=ABCD1234

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

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch('/api/user', {
        method: 'GET',
        credentials: 'include', // Включає cookies у запит
      });
    
      if (response.ok) {
        const data = await response.json();
        setUser((prev) => ({ ...prev, balance: data.data.balance, username: data.data.username }));
      } else {
        console.error('Error fetching user data:', await response.json());
      }
    };
    fetchUserData();
  }, [])

    useEffect(() => {
      const updateMiningBalances = async () => {
        try {
          const response = await fetch('/api/mining/complete', { method: 'PATCH', body: JSON.stringify({ userId: user?.id }), });
          if (!response.ok) {
            console.error('Ошибка обновления баланса для майнинга.');
          }
        } catch (error) {
          console.error('Ошибка сервера при обновлении баланса:', error);
          }
        };
    
        updateMiningBalances(); // Додаємо виклик для оновлення балансу
      }, [user?.id]);

      useEffect(() => {
        const updateMiningBalances = async () => {
          try {
            const response = await fetch('/api/listing/complete', { method: 'PATCH', body: JSON.stringify({ userId: user?.id }), });
            if (!response.ok) {
              console.error('Ошибка обновления баланса для майнинга.');
            }
          } catch (error) {
            console.error('Ошибка сервера при обновлении баланса:', error);
            }
          };
      
          updateMiningBalances(); // Додаємо виклик для оновлення балансу
        }, [user?.id]);

    return (
      <div className="">
        <div className="">
          {user?.role ==="admin"&& <AdminDeposits user={user}/>}
          {user?.role ==="admin"&& <AdminWithdrawal user={user}/>}
          {user?.role ==="admin"&& <AdminTable user={user}/>}
          <DashboardPanel user={user}></DashboardPanel>
          {/* <p className="text-gray-500 mt-2">Баланс</p>       
          {user?.balance && Object.keys(user.balance).length > 0 ? (
            <ul>
              {Object.entries(user.balance).map(([currency, amount]) => (
                <li key={currency}>
                  <strong>{currency}:</strong> {amount}
                </li>
              ))}
            </ul>
          ) : (
            <p>Баланс отсутсвует</p>
          )} */}
          {/* <DepositComponent id={user?.id} /> */}
          

        </div>
      </div>
    );
}
