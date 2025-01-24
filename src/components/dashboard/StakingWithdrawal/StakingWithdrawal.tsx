'use client';

import { useState } from 'react';

interface User {
  id: string;
  balance: Record<string, number>;
}

// interface MiningSession {
//   id: string;
//   currency: string;
//   amount: number;
//   startDate: string;
//   endDate?: string;
// }

interface StakingWithdrawalProps {
  user: User;
}

export default function StakingWithdrawal({ user }: StakingWithdrawalProps) {
  const [currency, setCurrency] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  // const [miningSessions, setMiningSessions] = useState<MiningSession[]>([]);

  // useEffect(() => {
  //   const fetchMiningSessions = async () => {
  //     if (!user?.id) return;
  //     try {
  //       const response = await fetch(`/api/staking?userId=${user.id}`);
  //       if (response.ok) {
  //         const data: { sessions: MiningSession[] } = await response.json();
  //         // setMiningSessions(data.sessions);
  //       } else {
  //         console.error('Ошибка получения даних про стейкинге.');
  //       }
  //     } catch (error) {
  //       console.error('Ошибка сервера:', error);
  //     }
  //   };

  //   fetchMiningSessions();
  // }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if ( !currency || !amount) {
      setError('Пожалуйста зполните все поля.');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Введите корректное количество.');
      return;
    }

    try {
      const response = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          currency,
          amount: numericAmount,
        }),
      });

      if (response.ok) {
        setSuccess('Деньги успешно сняти!');
        const updatedBalance = { ...user.balance };
        updatedBalance[currency] -= numericAmount;

        // const newSession: MiningSession = (await response.json()).data;
        // setMiningSessions((prevSessions) => [...prevSessions, newSession]);
      } else {
        const { error: responseError } = await response.json();
        setError(responseError || 'Не получилось снять стейкинг.');
      }
    } catch (error) {
      console.log(error)
      setError('Ошибка сервера. Попробуйте позже.');
    }
  };

  return (
    <div className="">
      <h2 className="text-xl font-bold mb-4">Вивести деньги с стейкина</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <form onSubmit={handleSubmit}>

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

        <label className="block mb-2">
        <div>Введите количество: </div>
          <input
            type="text"
            value={amount}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*\.?\d*$/.test(value)) {
                setAmount(value);
              }
            }}
            className="w-full max-w-[300px] p-2 border rounded"
            placeholder="Например, 0.01"
          />
        </label>

        <button
          type="submit"
          className="w-full max-w-[300px] text-white bg-[#4caf50] p-2 rounded hover:bg-blue-600"
        >
          Вивести деньги
        </button>
      </form>
    </div>
  );
}
