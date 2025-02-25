'use client';

import { useState } from 'react';
import RequestStatusIndicator from '@/components/dashboard/RequestStatusIndicator/RequestStatusIndicator';

interface User {
  id: string;
  balance: Record<string, number>;
  role: string,
  username: string;
  email: string;
  referrer: string;
  phone: string;
  registrationDate: string;
}

interface ListingActivationProps {
  user: User;
}

interface DataItem {
  amount: number;
  day: number;
  duration: string;
  incomeAtEnd?: boolean;
  percentage: number;
}

export default function ListingActivation({ user }: ListingActivationProps) {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [listingIndex, setlistingIndex] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedSessionIndex, setSelectedSessionIndex] = useState<number>(0);
  const finalPercentage = 100;
  const [requestStatus, setRequestStatus] = useState<'loading' | 'success' | 'error' | null>(null);
  

  const radius = 55;
  const circumference = 2 * Math.PI * radius;

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    if (isOpen) {
      e.preventDefault();
      setError('');
      setSuccess('');
      setlistingIndex(index)

      if (!(data[index].amount <= amount)) {
        setError('Сумма меньше листинга');
        return;
      }


      if ((data[index + 1]?.amount <= amount && !(data.length === index))) {
        setError('Виберите следующий листинг');
        return;
      }

      if (!amount) {
        setError('Пожалуйста зполните все поля.');
        return;
      }

      // const numericAmount = parseFloat(amount);
      // if (isNaN(numericAmount) || numericAmount <= 0) {
      //   setError('Введите корректное количество.');
      //   return;
      // }
      setRequestStatus('loading');

      try {
        const response = await fetch('/api/listing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            day: data[index].day,
            currency: "USDT",
            amount: amount,
            incomeAtEnd: data[index].incomeAtEnd,
            percentage: data[index].percentage
          }),
        });

        if (response.ok) {
          setSuccess('Листинг успешно активирован');
          setRequestStatus('success');
          setIsOpen(false)
        } else {
          const { error: responseError } = await response.json();
          setError(responseError || 'Ошибка сервера');
        }
      } catch (error) {
        setError(`Ошибка сервера. Попробуйте позже.`);
        setRequestStatus('error');
        console.log(error)
      }
    } else {
      setSelectedSessionIndex(index);
      setRequestStatus('error');
      setIsOpen(true)
    }
  };

  const data: DataItem[] = [
    { amount: 5000, duration: "3 недели", day: 21, incomeAtEnd: true, percentage: 24 },
    { amount: 10000, duration: "2 недели", day: 14, incomeAtEnd: true, percentage: 27 },
    { amount: 25000, duration: "1 неделю", day: 7, incomeAtEnd: true, percentage: 18 },
    { amount: 50000, duration: "5 дней", day: 5, percentage: 25 },
    { amount: 100000, duration: "3 дня", day: 3, percentage: 40 },
    { amount: 250000, duration: "2 дня", day: 2, percentage: 62 },
    { amount: 500000, duration: "1 день", day: 1, percentage: 125 },
  ];

  const handleSimulateTime = async () => {
    if (!confirm('Are you sure you want to simulate time?')) return;

    try {
      const response = await fetch('/api/admin/simulate-listing', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
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

  const handleSpinnerHide = () => {
    setRequestStatus(null);
  };

  return (
    <div className="bg-gray-50 flex flex-wrap flex-row sm:gap-[35px] gap-[25px] w-full sm:justify-start justify-center">
      <RequestStatusIndicator
        status={requestStatus}
        message={
          requestStatus === 'success'
            ? 'Успех'
            : requestStatus === 'error'
              ? 'Ошибка'
              : undefined
        }
        onHide={handleSpinnerHide}
      />
      {user?.role === "admin" && <button
        onClick={handleSimulateTime}
        className="bg-blue text-white px-4 py-2 rounded mb-4"
      >
        Симулировать листинг
      </button>}
      {data.map((item, index) => {
        const isHovered = hoveredIndex === index; // Перевіряємо, чи ховер для цього елемента
        const strokeDashoffset = isHovered
          ? circumference - (finalPercentage / 100) * circumference
          : circumference - (item.percentage > 100 ? 1 : item.percentage / 100) * circumference;
        return (
          <div key={index} className="bg-[#0d316d] text-white rounded-[15px] gap-[6px] px-[30px] py-[25px] mb-[30px] sm:min-w-[370px] min-w-[316px] relative"
            style={{
              background: 'linear-gradient(180.00deg, rgba(53, 129, 255, 0),rgba(53, 129, 255, 0.35) 100%),rgb(0, 22, 58)',
              boxShadow: '8px 10px 18.5px 0px rgba(0, 22, 58, 0.25)'
            }}
          >
            <div className='text-[#3581FF] sm:text-[40px] text-[36px] bold'>${item.amount}</div>
            <div className='text-white text-[24px] bold mb-[30px]'>на {item.duration}</div>
            <div className='text-white text-[16px] mb-[10px] max-w-[200px]'>{item.incomeAtEnd ? "Доход вместе с депозитом в конце срока" : "Ежедневно  и Включен возврат тела в ежедневные начисления"}</div>
            {isOpen && selectedSessionIndex === index && (
              <label className="block mb-2">
                <div className="text-[16px] mb-[5px] text-white">Сумма листинга:</div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) {
                      setAmount(parseFloat(value) || 0);
                    }
                  }}
                  className="w-full max-w-[300px] p-2 border rounded text-black"
                // placeholder={`от ${availableContracts[selectedSessionIndex][0]}$`}
                />

              </label>
            )}
            <div className='flex justify-end'>
              <button onClick={(e) => handleSubmit(e, index)} className='px-[25px] py-[10px] rounded-full bg-[#576f9b] hover:bg-[#3581FF]'>Вложить</button>
            </div>
            {index === listingIndex && error && <div className="text-red-500">{error}</div>}
            {index === listingIndex && success && <div className="text-green-500">{success}</div>}
            <div></div>
            {/* <div>{success}</div> */}
            <div className="sm:flex hidden items-center justify-center absolute top-[25px] right-[30px]"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <svg
                width="131"
                height="131"
                viewBox="0 0 131 131"
                className="cursor-pointer "
              >
                <defs>
                  <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="25%" stopColor="rgb(255, 0, 247)" />
                    <stop offset="50%" stopColor="rgba(53, 129, 255, 0.57)" />
                    <stop offset="75%" stopColor="rgb(53, 129, 255)" />
                  </linearGradient>
                </defs>
                <circle
                  cx="65.5"
                  cy="65.5"
                  r={radius}
                  stroke="#293953"
                  strokeWidth="17"
                  fill="transparent"
                />
                <circle
                  cx="65.5"
                  cy="65.5"
                  r={1}
                  stroke="#00163A"
                  strokeWidth="91"
                  fill="transparent"
                />
                <circle
                  cx="65.5"
                  cy="65.5"
                  r={radius}
                  stroke="url(#gradientStroke)"
                  // stroke="linear-gradient(225.00deg, rgb(255, 0, 247) 24.874%,rgba(53, 129, 255, 0.57) 50%,rgb(53, 129, 255) 75.126%),rgb(255, 255, 255)"
                  // background: linear-gradient(225.00deg, rgb(255, 0, 247) 24.874%,rgba(53, 129, 255, 0.57) 50%,rgb(53, 129, 255) 75.126%),rgb(255, 255, 255);
                  strokeWidth="17"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-180 65.5 65.5) "
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[24px] font-bold'>{item.percentage}%</div>
            </div>
            <div className="flex items-center justify-center absolute top-[15px] right-[15px] sm:hidden"
              style={{ transform: "scale(0.8)" }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <svg
                width="131"
                height="131"
                viewBox="0 0 131 131"
                className="cursor-pointer "
              >
                <circle
                  cx="65.5"
                  cy="65.5"
                  r={radius}
                  stroke="#293953"
                  strokeWidth="17"
                  fill="transparent"
                />
                <circle
                  cx="65.5"
                  cy="65.5"
                  r={1}
                  stroke="#00163A"
                  strokeWidth="91"
                  fill="transparent"
                />
                <circle
                  cx="65.5"
                  cy="65.5"
                  r={radius}
                  stroke="#3B82F6"
                  strokeWidth="17"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-180 65.5 65.5) "
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[24px] font-bold'>{item.percentage}%</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
