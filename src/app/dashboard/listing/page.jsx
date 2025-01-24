'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ListingActivation from '@/components/dashboard/ListingActivation/ListingActivation';
// import StakingWithdrawal from '@/components/dashboard/StakingWithdrawal/StakingWithdrawal';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

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
      } finally {
        setLoading(false); // Завантаження завершено
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
        {loading ? (
        <p>Loading...</p>
      ) : user ? (
        // <TeamComponent userId={user.id} />
        <>
         <ListingActivation user={user}></ListingActivation>
         {/* <StakingWithdrawal user={user}></StakingWithdrawal> */}
        </>
      ) : (
        <p>No user data available</p>
      )}
        </div>
      </div>
    );
}
