'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NFTActivation from '@/components/dashboard/NFTActivation/NFTActivation';
import AdminNFTForm from '@/components/dashboard/AdminNFTForm/AdminNFTForm';

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
          router.push('/login');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/login');
      } finally {
        setLoading(false);
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
        setUser((prev) => ({ ...prev, balance: data.data.balance }));
      } else {
        console.error('Error fetching user data:', await response.json());
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="px-[15px] sm:px-0">
      <div className="">
        {loading ? (
          <p>Loading...</p>
        ) : user ? (
          <>
            <AdminNFTForm user={user} />
            <NFTActivation user={user} />
          </>
        ) : (
          <p>No user data available</p>
        )}
      </div>
    </div>
  );
}