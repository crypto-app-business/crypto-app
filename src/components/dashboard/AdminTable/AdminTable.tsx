"usee client"
import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  role: string;
  balance: Record<string, number>;
}

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);

  console.log(error)

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch("/api/auth-token");
        const data = await res.json();
        setToken(data.token); // Оновлюємо токен через setToken
      } catch (err) {
        console.error("Помилка при отриманні токена:", err);
      }
    };
  
    fetchToken();
  }, []);
  
  useEffect(() => {

    const fetchUsers = async () => {
      try {
        console.log("start");
        console.log("start1");
        console.log(token);
  
        if (!token) {
          setError('Не авторизовано');
          setLoading(false);
          return;
        }
  
        const response = await fetch('/api/admin/get-all-users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Додаємо токен у заголовок
          },
        });
  
        const data = await response.json();
  
        if (data.success) {
          setUsers(data.users);
        } else {
          setError(data.error || 'Не вдалося отримати користувачів');
        }
      } catch (err) {
        console.error('Помилка при отриманні користувачів:', err);
        setError('Помилка при отриманні користувачів');
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, [token]);
  

  if (loading) {
    return <p className="text-center text-gray-600">Завантаження...</p>;
  }

  return (
    <div className="overflow-x-auto p-4">
      <h3 className="text-lg font-semibold mb-4">Список користувачів</h3>
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="py-2 px-4 text-left">ID</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Роль</th>
            <th className="py-2 px-4 text-left">Баланс</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user,index) => (
            <tr key={`${user.id}-${index}`} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{user.id}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4">{user.role}</td>
              <td className="py-2 px-4">
                {Object.entries(user.balance).map(([currency, amount]) => (
                  <span key={currency} className="block">
                    {currency}: {amount}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
