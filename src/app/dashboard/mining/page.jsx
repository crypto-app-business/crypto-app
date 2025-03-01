'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import DepositComponent from '@/components/dashboard/DepositComponent/DepositComponent';
import MiningActivation from '@/components/dashboard/MiningActivation/MiningActivation';
// import PendingDeposits from '@/components/dashboard/PendingDeposits/PendingDeposits';
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
        setUser((prev) => ({ ...prev, balance: data.data.balance }));
      } else {
        console.error('Error fetching user data:', await response.json());
      }
    };
    fetchUserData();
  }, [])

    return (
      <div className="">
        <div className="">
          {user?.role === 'admin'&&<AdminDeposits user={user}/>}
          <MiningActivation user={user}></MiningActivation>
          {/* <PendingDeposits id={user?.id} /> */}
        </div>
      </div>
    );
}
