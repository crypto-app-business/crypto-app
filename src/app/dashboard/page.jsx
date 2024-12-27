'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DepositComponent from '@/components/dashboard/DepositComponent/DepositComponent';
import PendingDeposits from '@/components/dashboard/PendingDeposits/PendingDeposits';
import AdminDeposits from '@/components/dashboard/AdminDeposits/AdminDeposits';
import MiningActivation from '@/components/dashboard/MiningActivation/MiningActivation';

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
        setUser((prev) => ({ ...prev, balance: data.data.balance, username: data.data.username }));
        console.log('User data:', data.data);
      } else {
        console.error('Error fetching user data:', await response.json());
      }
    };
    fetchUserData();
  }, [])

    return (
      <div className="p-2">
        <div className="hover:shadow-lg transition-all">
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
          <DepositComponent id={user?.id} />
          {user?.username && (
          <div className="mt-4 p-4 bg-gray-100 rounded shadow-md">
            <p className="text-gray-700 font-semibold">Ваша рефералка:</p>
            <a
              href={`/register?referrer=${user.username}`}
              className="text-blue-500 hover:underline break-all"
            >
              {`${window.location.origin}/register?referrer=${user.username}`}
            </a>
          </div>
          )}
          <PendingDeposits id={user?.id} />
          <AdminDeposits/>
          <MiningActivation user={user}></MiningActivation>
        </div>
      </div>
    );
}
