'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TeamComponent from '@/components/dashboard/TeamComponent/TeamComponent';

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

  const handleLogout = async (redirect) => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Для передачі cookies
      });

      if (res.ok) {
        setUser(null);
        router.push(redirect); // Перенаправлення після виходу
      } else {
        console.error('Error logging out:', await res.json());
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  return (
    <div className="">
      <div className="">
        {loading ? (
          <p>Loading...</p>
        ) : user ? (
          <div className='flex flex-wrap gap-[15px]'>  
            {/* Вийти */}
            <button
              onClick={() => handleLogout('/')}
              className="px-4 py-2 bg-blue text-white rounded"
            >
              Выйти
            </button>

            {/* Перейти на сторінку логіну */}
            <button
              onClick={() => handleLogout('/login')}
              className="px-4 py-2 bg-blue text-white rounded"
            >
              Логин пейдж
            </button>

            {/* Перейти на сторінку реєстрації */}
            <button
              onClick={() => handleLogout('/register')}
              className="px-4 py-2 bg-blue text-white rounded"
            >
              Регистр пейдж
            </button>
          </div>
        ) : (
          <p>No user data available</p>
        )}
      </div>
    </div>
  );
}
