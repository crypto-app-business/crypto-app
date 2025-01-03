'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DepositComponent from '@/components/dashboard/DepositComponent/DepositComponent';
import MiningActivation from '@/components/dashboard/MiningActivation/MiningActivation';
import PendingDeposits from '@/components/dashboard/PendingDeposits/PendingDeposits';
import AdminDeposits from '@/components/dashboard/AdminDeposits/AdminDeposits';

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
          console.log(userData)
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
  console.log(user)

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch('/api/user', {
        method: 'GET',
        credentials: 'include', // Включає cookies у запит
      });
    
      if (response.ok) {
        const data = await response.json();
        setUser((prev) => ({ ...prev, balance: data.data.balance }));
        console.log('User data:', data.data);
      } else {
        console.error('Error fetching user data:', await response.json());
      }
    };
    fetchUserData();
  }, [])

    return (
      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
          <p className="text-gray-500 mt-2">Баланс</p>       
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
          )}
          {/* <DepositComponent id={user?.id} />
          <PendingDeposits id={user?.id} />
          <AdminDeposits/> */}
          {/* <MiningActivation user={user}></MiningActivation> */}
        </div>
      </div>
    );
}
