"usee client"
import { useEffect, useState } from 'react';

interface User {
  firstName: string;
  lastName: string;
  username: string;
  telegramId?: string;
  email: string;
  id: string;
  balance: Record<string, number>;
  phone: string;
}

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // Стан для пошуку

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
    return <p className="text-center text-gray-600">Загрузка...</p>;
  }

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-2 max-w-full mx-auto">
      <h3 className="text-lg font-semibold mb-2">Список користувачів</h3>

      {/* Поле пошуку */}
      <div className="mb-2">
        <input
          type="text"
          placeholder="Пошук по користувачах..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[300px] bg-white border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-gray-100 border-b text-left">
            <tr>
              {/* <th className="py-2 px-2 font-semibold text-xs md:text-sm">Имя</th>
              <th className="py-2 px-2 font-semibold text-xs md:text-sm">Фамилия</th> */}
              <th className="py-2 px-2 font-semibold text-xs md:text-sm">Никнейм</th>
              {/* <th className="py-2 px-2 font-semibold text-xs md:text-sm">Телеграм</th> */}
              <th className="py-2 px-2 font-semibold text-xs md:text-sm">Телефон</th>
              {/* <th className="py-2 px-2 font-semibold text-xs md:text-sm">Email</th> */}
              <th className="py-2 px-2 font-semibold text-xs md:text-sm">Баланс</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr
                  key={`${user.id}-${index}`}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  {/* <td className="py-1 px-2 text-xs md:text-sm">{user.firstName}</td>
                  <td className="py-1 px-2 text-xs md:text-sm">{user.lastName}</td> */}
                  <td className="py-1 px-2 text-xs md:text-sm">{user.username}</td>
                  {/* <td className="py-1 px-2 text-xs md:text-sm">
                    {user.telegramId || "-"}
                  </td> */}
                  <td className="py-1 px-2 text-xs md:text-sm">{user.phone}</td>
                  {/* <td className="py-1 px-2 text-xs md:text-sm truncate max-w-[100px] md:max-w-[150px]">
                    {user.email}
                  </td> */}
                  <td className="py-1 px-2 text-xs md:text-sm">
                    {Object.entries(user.balance).map(([currency, amount]) => (
                      <span key={currency} className="block text-xs md:text-sm">
                        {currency}: {amount.toFixed(2)}
                      </span>
                    ))}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-2 text-center text-gray-500 text-xs md:text-sm">
                  Користувачі не знайдені
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Мобільний вигляд як картки для екранів < 375px */}
      <div className="mt-4 md:hidden">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <div
              key={`${user.id}-${index}`}
              className="bg-white p-2 rounded-lg shadow-md mb-2 border border-gray-200"
            >
              <p className="text-xs font-medium"><strong>Имя:</strong> {user.firstName}</p>
              <p className="text-xs"><strong>Фамилия:</strong> {user.lastName}</p>
              <p className="text-xs"><strong>Никнейм:</strong> {user.username}</p>
              <p className="text-xs"><strong>Телеграм:</strong> {user.telegramId || "-"}</p>
              <p className="text-xs"><strong>Телефон:</strong> {user.phone}</p>
              <p className="text-xs truncate"><strong>Email:</strong> {user.email}</p>
              <p className="text-xs"><strong>Баланс:</strong></p>
              {Object.entries(user.balance).map(([currency, amount]) => (
                <span key={currency} className="block text-xs">
                  {currency}: {amount}
                </span>
              ))}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-xs">Користувачі не знайдені</p>
        )}
      </div>
    </div>
  );
}
