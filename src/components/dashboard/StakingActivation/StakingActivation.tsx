'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface User {
  id: string;
  balance: Record<string, number>;
  role: string;
  username: string;
  email: string;
  referrer: string;
  phone: string;
  registrationDate: string;
}

interface MiningSession {
  id: string;
  currency: string;
  amount: number;
  startDate: string;
  endDate?: string;
  fullAmount: number;
}

interface StakingActivationProps {
  user: User;
}

const handleSimulateTime = async () => {
  if (!confirm('Are you sure you want to simulate time?')) return;

  try {
    const response = await fetch('/api/updateStaking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify({ userId: user.id }),
    });

    if (response.ok) {
      alert('Time simulated successfully!');
    } else {
      console.error('Failed to simulate time.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export default function StakingActivation({ user }: StakingActivationProps) {
  const [currency] = useState<string>('USDT');
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [miningSessions, setMiningSessions] = useState<MiningSession[]>([]);

  const fetchMiningSessions = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`/api/staking?userId=${user.id}`);
      if (response.ok) {
        const data: { sessions: MiningSession[] } = await response.json();
        const filteredSessions = data.sessions.filter(session => session.currency === 'USDT');
        setMiningSessions(filteredSessions);
      } else {
        console.error('Ошибка получения даних про стейкинге.');
      }
    } catch (error) {
      console.error('Ошибка сервера:', error);
    }
  };

  useEffect(() => {
    fetchMiningSessions();
  }, [user?.id]);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>, action: string) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currency || !amount) {
      setError('Пожалуйста зполните все поля.');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Введите корректное количество.');
      return;
    }

    if (action === "withdraw" && miningSessions[0].amount < numericAmount) {
      setError('Введеная сумма больше баланса.');
      return;
    }

    try {
      const response = await fetch('/api/staking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          currency,
          amount: numericAmount,
          action: action,
        }),
      });

      if (response.ok) {
        const updatedBalance = { ...user.balance };
        updatedBalance[currency] -= numericAmount;

        if (action === "add") setSuccess('Стейкинг успешно активирован!');
        if (action === "withdraw") setSuccess('Деньги успешно выведены!');
        const newSession: MiningSession = (await response.json()).data;
        setMiningSessions((prevSessions) => [...prevSessions, newSession]);
        await fetchMiningSessions();
      } else {
        const { error: responseError } = await response.json();
        if (action === "add") setError(responseError || 'Не получилось активировать стейкинг.');
        if (action === "withdraw") setError(responseError || 'Не получилось вывесты деньги.');
      }
    } catch (error) {
      console.log(error)
      setError('Ошибка сервера. Попробуйте позже.');
    }
  };

  return (
    <div className="bg-gray-50 flex flex-wrap flex-row sm:gap-[4%] sm:justify-start justify-center w-full">
      {user?.role === "admin" && <button
        onClick={handleSimulateTime}
        className="bg-blue text-white px-4 py-2 rounded mb-4"
      >
        Симулировать стейкинг
      </button>}
      <div className=" rounded-[15px] gap-[6px] p-[30px] mb-[30px] min-w-[325px] w-full sm:w-[45%]"
        style={{
          boxShadow: '8px 10px 18.5px 0px rgba(0, 22, 58, 0.25)',
          background: 'linear-gradient(180.00deg, rgba(53, 191, 255, 0) 33%,rgba(53, 191, 255, 0.74) 100%),rgb(53, 129, 255)'
        }}
      >
        <div className='flex mb-[15px]'>
          <div className='text-white'>
            <div className='flex items-center'>
              <Image
                src="/dashboard/mining/safe.svg"
                alt="Wallet Icon"
                width={40}
                height={40}
                objectFit="cover"
                priority={false}
              />
              <div>
                <div className='text-[16px] font-semibold uppercase'>Вложено в стейкинг</div>
              </div>
            </div>
            <div className='flex items-end gap-[6px] ml-[40px] mt-[-13px]'>
              {miningSessions[0]?.amount && <div className='text-[24px] font-bold'>{miningSessions[0].amount?.toFixed(2)}</div>}
              {miningSessions[0]?.amount && <div className='text-[14px]'>{miningSessions[0].currency}</div>}
            </div>
          </div>
        </div>
        <div className='flex mb-[35px]'>
          <div className='text-white'>
            <div className='flex items-center'>
              <Image
                src="/dashboard/mining/coins.svg"
                alt="Wallet Icon"
                width={40}
                height={40}
                objectFit="cover"
                priority={false}
              />
              <div>
                <div className='text-[16px] font-semibold uppercase'>Баланс</div>
              </div>
            </div>
            <div className='flex items-end gap-[6px] ml-[40px] mt-[-13px]'>
              <div className='text-[24px] font-bold'>{user?.balance?.USDT?.toFixed(2)}</div>
              <div className='text-[14px]'>USDT</div>
            </div>
          </div>
        </div>
        <div className='flex mb-[30px]'>
          <div className='text-[#00163A]'>
            <div className='flex items-center'>
              <Image
                src="/dashboard/mining/shield.svg"
                alt="Wallet Icon"
                width={40}
                height={40}
                objectFit="cover"
                priority={false}
              />
              <div>
                <div className='text-[16px] font-semibold uppercase'>Заработано</div>
              </div>
            </div>
            <div className='flex items-end gap-[6px] ml-[40px] mt-[-13px]'>
              <div className='text-[24px] font-bold'>{miningSessions[0]?.fullAmount?.toFixed(2) || 0}</div>
              <div className='text-[14px]'>{miningSessions[0]?.currency}</div>
            </div>
          </div>
        </div>
        <div className='flex justify-end'>

          <div className='px-[25px] py-[10px] rounded-full bg-[#71a7fe] text-white text-[16px] bold'
          style={{
            background: 'rgba(255, 255, 255, 0.3)',
          }}
          >Обмен валюты</div>
        </div>
      </div>


      <div className="bg-[#00163A] rounded-[15px] gap-[6px] p-[30px] mb-[30px] min-w-[325px] sm:min-w-[400px] w-full sm:w-[47%] max-h-[345px]"
        style={{
          boxShadow: '8px 10px 18.5px 0px rgba(0, 22, 58, 0.25)',
        }}
      >
        <div className='flex justify-center flex-col items-center mb-[15px] text-white h-full text-[16px] max-w-[210px] ml-auto mr-auto'>
          <Image
            src="/dashboard/staking/Coin_gif.gif"
            alt="Wallet Icon"
            width={73}
            height={73}
            objectFit="cover"
            priority={false}
          />

          <button onClick={(e) => handleSubmit(e, "add")} className='px-[25px] py-[10px] rounded-full bg-[#3581FF4D] font-bold mb-[20px]'>Вложить в стейкинг</button>
          <input
            type="text"
            placeholder='Сумма'
            className='mb-[20px] rounded pl-[15px] py-[5px] text-[black]'
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*\.?\d*$/.test(value)) {
                setAmount(value);
              }
            }}
          />
          {error && <div className="text-red-500 w-max mb-[20px]">{error}</div>}
          {success && !error && <div className="text-green-500 w-max mb-[20px]">{success}</div>}
          <button onClick={(e) => handleSubmit(e, "withdraw")} className='px-[25px] py-[10px] rounded-full bg-[#4b5b75] font-bold'>Вывести вложение</button>

          <Image
            src="/dashboard/staking/Dolar_gif.gif"
            alt="Wallet Icon"
            width={73}
            height={73}
            objectFit="cover"
            priority={false}
          />
        </div>
      </div>


      {/* Wallet Section
      <div className="">
      <h2 className="text-xl font-bold mb-4">Активировать стейкинг</h2>
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
            <option value="">Выбрать</option>
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
          Создать
        </button>
      </form>

      <div>
  <h3 className="text-lg font-bold mt-6">Активные стейкинговые сессии</h3>
  {miningSessions.length > 0 ? (
    <>

      <div className="hidden lg:block">
        <table className="w-full border-collapse border border-gray-200 mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Криптовалюта</th>
              <th className="border px-4 py-2">Сумма</th>
              <th className="border px-4 py-2">Дата создания</th>
              <th className="border px-4 py-2">Дата завершения</th>
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
                  {session?.endDate && new Date(session.endDate).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


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
            {session?.endDate && <p>
              <strong>Дата завершения:</strong> {new Date(session?.endDate).toLocaleString()}
            </p>}
          </li>
        ))}
      </ul>
    </>
  ) : (
    <p className="text-gray-500 mt-2">Нет активних сессий.</p>
  )}
</div>
    </div> */}
    </div>
  );
}
