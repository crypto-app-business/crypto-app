'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  balance: Record<string, number>;
}

interface MiningSession {
  id: string;
  currency: string;
  amount: number;
  startDate: string;
  endDate: string;
  percentage: number[];
}

interface MiningActivationProps {
  user: User;
}

export default function MiningActivation({ user }: MiningActivationProps) {
  const [week, setWeek] = useState<string>('');
  const [currency, setCurrency] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [miningSessions, setMiningSessions] = useState<MiningSession[]>([]);

  useEffect(() => {
    const fetchMiningSessions = async () => {
      try {
        const response = await fetch('/api/mining');
        if (response.ok) {
          const data: { sessions: MiningSession[] } = await response.json();
          console.log('Отримані сесії:', data.sessions);
          setMiningSessions(data.sessions);
        } else {
          console.error('Ошибка получения даних про майнинг.');
        }
      } catch (error) {
        console.error('Ошибка сервера:', error);
      }
    };

    fetchMiningSessions();
  }, []);

  const calculatePercentages = (weeks: number): number[] => {
    const percentages: number[] = [];
      percentages.push(1 + (weeks - 1) * 0.1); // Для 1 тижня: 1%, для 2: 1.1%, і т.д.
    return percentages;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!week || !currency || !amount) {
      setError('Пожалуйста зполните все поля.');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Введите корректное количество.');
      return;
    }
    const numericWeek = parseInt(week, 10);
    const percentage = calculatePercentages(numericWeek);

    if (isNaN(numericWeek) || numericWeek <= 0 || numericWeek > 4) {
        setError('Выберите корректное количество недель.');
        return;
      }

    try {
      const response = await fetch('/api/mining', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          week,
          currency,
          amount: numericAmount,
          percentage
        }),
      });

      if (response.ok) {
        const updatedBalance = { ...user.balance };
        updatedBalance[currency] -= numericAmount;

        alert('Майнинг успешно активирован!');
        const newSession: MiningSession = (await response.json()).data;
        setMiningSessions((prevSessions) => [...prevSessions, newSession]);
      } else {
        const { error: responseError } = await response.json();
        setError(responseError || 'Не получилось активировать майнинг.');
      }
    } catch (error) {
      console.log(error)
      setError('Ошибка сервера. Попробуйте позже.');
    }
  };

  return (
    <div className="">
      <h2 className="text-xl font-bold mb-4">Активировать майнинг</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Вибір тижня */}
        <label className="mb-2 block ">
          <div>Выберите длительность:</div>
          <select
            value={week}
            onChange={(e) => setWeek(e.target.value)}
            className="w-full max-w-[300px] p-2 border rounded"
          >
            <option value="">Вибрать</option>
            {[...Array(4)].map((_, index) => (
              <option key={`week-${index}`} value={`${index + 1}`}>
                Неделя {index + 1}
              </option>
            ))}
          </select>
        </label>

        {/* Вибір криптовалюти */}
        <label className="block mb-2">
           <div> Выберите криптовалюту:</div>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full max-w-[300px] p-2 border rounded"
          >
            <option value="">Вибрать</option>
            {user?.balance &&
              Object.keys(user.balance).map((curr) => (
                <option key={`balance-${curr}`} value={curr}>
                  {curr}
                </option>
              ))}
          </select>
        </label>

        {/* Введення кількості */}
        <label className="block mb-2">
        <div>Введите количество: </div>
          <input
            type="text" // Змінюємо тип на "text" для повного контролю
            value={amount}
            onChange={(e) => {
              const value = e.target.value;
              // Перевіряємо, чи значення - це число або порожній рядок
              if (/^\d*\.?\d*$/.test(value)) {
                setAmount(value);
              }
            }}
            className="w-full max-w-[300px] p-2 border rounded"
            placeholder="Например, 0.01"
          />
        </label>

        {/* Кнопка */}
        <button
          type="submit"
          className="w-full max-w-[300px] text-white bg-[#4caf50] p-2 rounded hover:bg-blue-600"
        >
          Создать
        </button>
      </form>

      {/* Виведення активних майнінгів */}
      <div>
  <h3 className="text-lg font-bold mt-6">Активные майнинговые сессии</h3>
  {miningSessions.length > 0 ? (
    <>
      {/* Таблиця для великих екранів */}
      <div className="hidden lg:block">
        <table className="w-full border-collapse border border-gray-200 mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Криптовалюта</th>
              <th className="border px-4 py-2">Сумма</th>
              <th className="border px-4 py-2">Дата создания</th>
              <th className="border px-4 py-2">Дата завершения</th>
              <th className="border px-4 py-2">Проценти</th>
            </tr>
          </thead>
          <tbody>
            {miningSessions.map((session, index) => (
              <tr key={`table-row-${index}`} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{session.currency}</td>
                <td className="border px-4 py-2">{session.amount}</td>
                <td className="border px-4 py-2">
                  {new Date(session.startDate).toLocaleString()}
                </td>
                <td className="border px-4 py-2">
                  {new Date(session.endDate).toLocaleString()}
                </td>
                <td className="border px-4 py-2">{session.percentage.join(', ')}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Список для мобільних пристроїв */}
      <ul className="lg:hidden mt-4">
        {miningSessions.map((session, index) => (
          <li
            key={`miningSessions-${index}`}
            className="p-4 border rounded mb-2 shadow-sm hover:shadow-md"
          >
            <p>
              <strong>Криптовалюта:</strong> {session.currency}
            </p>
            <p>
              <strong>Сумма:</strong> {session.amount}
            </p>
            <p>
              <strong>Дата создания:</strong> {new Date(session.startDate).toLocaleString()}
            </p>
            <p>
              <strong>Дата завершения:</strong> {new Date(session.endDate).toLocaleString()}
            </p>
            <p>
              <strong>Проценти:</strong> {session.percentage.join(', ')}%
            </p>
          </li>
        ))}
      </ul>
    </>
  ) : (
    <p className="text-gray-500 mt-2">Нет активних сессий.</p>
  )}
</div>
    </div>
  );
}
