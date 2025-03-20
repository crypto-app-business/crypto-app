"use client";
import { useEffect, useState } from "react";
import React from "react";

interface User {
  firstName: string;
  lastName: string;
  username: string;
  telegramId?: string;
  email: string;
  id: string;
  balance: Record<string, number>;
  phone: string;
  password2?: string;
}

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeUserId, setActiveUserId] = useState<number | null>(null);
  const [editedBalance, setEditedBalance] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch("/api/auth-token");
        const data = await res.json();
        setToken(data.token);
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
          setError("Не авторизовано");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/admin/get-all-users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setUsers(data.users);
        } else {
          setError(data.error || "Не вдалося отримати користувачів");
        }
      } catch (err) {
        console.error("Помилка при отриманні користувачів:", err);
        setError("Помилка при отриманні користувачів");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const toggleAccordion = (userId: number) => {
    setActiveUserId(userId === activeUserId ? null : userId);
    if (userId !== activeUserId) {
      const user = users[userId];
      setEditedBalance({
        CC: user.balance.CC ?? 0,
        USDT: user.balance.USDT ?? 0,
      });
    } else {
      setEditedBalance(null);
    }
  };

  const handleBalanceChange = (currency: string, value: string) => {
    if (editedBalance) {
      setEditedBalance({
        ...editedBalance,
        [currency]: value === "" ? 0 : parseFloat(value) || 0,
      });
    }
  };

  const saveBalance = async (username: string) => {
    if (!token || !editedBalance) return;

    try {
      const response = await fetch("/api/admin/update-balance", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, balance: editedBalance }),
      });

      const data = await response.json();

      if (data.success) {
        setUsers(users.map((user) =>
          user.username === username ? { ...user, balance: editedBalance } : user
        ));
        alert("Баланс успішно оновлено!");
      } else {
        alert("Помилка при оновленні балансу: " + (data.error || "Невідома помилка"));
      }
    } catch (err) {
      console.error("Помилка при збереженні балансу:", err);
      alert("Помилка при збереженні балансу");
    }
  };

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
      <div className="text-red">{error}</div>
      <h3 className="text-lg font-semibold mb-2">Список користувачів</h3>

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
              <th className="py-2 px-2 font-semibold text-xs md:text-sm">Никнейм</th>
              <th className="py-2 px-2 font-semibold text-xs md:text-sm">Телефон</th>
              <th className="py-2 px-2 font-semibold text-xs md:text-sm">Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <React.Fragment key={`${user.id}-${index}`}>
                  <tr
                    onClick={() => toggleAccordion(index)}
                    className={`border-b hover:bg-gray-50 transition-colors cursor-pointer ${activeUserId === index ? 'bg-[#dbefea]' : ''}`}
                  >
                    <td className="py-1 px-2 text-xs md:text-sm">{user.username}</td>
                    <td className="py-1 px-2 text-xs md:text-sm">{user.phone}</td>
                    <td className="py-1 px-2 text-xs md:text-sm truncate max-w-[100px] md:max-w-[150px]">
                      {user.email}
                    </td>
                  </tr>
                  {activeUserId === index && (
                    <tr
                      key={`${user.id}-${index}-accordion`}
                      className="bg-[#dbefea]"
                    >
                      <td colSpan={3} className="py-2 px-2 text-xs md:text-sm">
                        <div>
                          <p>
                            <strong>Пароль:</strong> {user.password2 || "Немає"}
                          </p>
                          <p>
                            <strong>Баланс:</strong>
                          </p>
                          <div className="flex items-center gap-2 mb-2">
                            <span>CC:</span>
                            <input
                              type="number"
                              step="0.01"
                              value={editedBalance?.CC ?? 0}
                              onChange={(e) => handleBalanceChange("CC", e.target.value)}
                              className="w-24 p-1 border border-gray-300 rounded text-sm"
                            />
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span>USDT:</span>
                            <input
                              type="number"
                              step="0.01"
                              value={editedBalance?.USDT ?? 0}
                              onChange={(e) => handleBalanceChange("USDT", e.target.value)}
                              className="w-24 p-1 border border-gray-300 rounded text-sm"
                            />
                          </div>
                          <button
                            onClick={() => saveBalance(user.username)}
                            className="mt-2 px-4 py-1 bg-blue text-white rounded hover:bg-gray text-sm"
                          >
                            Зберегти
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-2 text-center text-gray-500 text-xs md:text-sm">
                  Користувачі не знайдені
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 md:hidden">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <div
              key={`${user.id}-${index}`}
              className="bg-white p-2 rounded-lg shadow-md mb-2 border border-gray-200"
            >
              <div
                onClick={() => toggleAccordion(index)}
                className="cursor-pointer"
              >
                <p className="text-xs font-medium">
                  <strong>Никнейм:</strong> {user.username}
                </p>
                <p className="text-xs">
                  <strong>Телефон:</strong> {user.phone}
                </p>
                <p className="text-xs truncate">
                  <strong>Email:</strong> {user.email}
                </p>
              </div>
              {activeUserId === index && (
                <div className="mt-2">
                  <p className="text-xs">
                    <strong>Пароль:</strong> {user.password2 || "Немає"}
                  </p>
                  <p className="text-xs">
                    <strong>Баланс:</strong>
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <span>CC:</span>
                    <input
                      type="number"
                      step="0.01"
                      value={editedBalance?.CC ?? 0}
                      onChange={(e) => handleBalanceChange("CC", e.target.value)}
                      className="w-24 p-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span>USDT:</span>
                    <input
                      type="number"
                      step="0.01"
                      value={editedBalance?.USDT ?? 0}
                      onChange={(e) => handleBalanceChange("USDT", e.target.value)}
                      className="w-24 p-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <button
                    onClick={() => saveBalance(user.username)}
                    className="mt-2 px-4 py-1 bg-blue text-white rounded hover:bg-blue text-sm"
                  >
                    Зберегти
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-xs">Користувачі не знайдені</p>
        )}
      </div>
    </div>
  );
}