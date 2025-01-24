'use client';

import { useState } from 'react';

interface User {
  id: string;
  balance: Record<string, number>;

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
  const initialPercentage = 20;
  const finalPercentage = 100;

  const radius = 55;
  const circumference = 2 * Math.PI * radius;

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setlistingIndex(index)
    
    try {
      const response = await fetch('/api/listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          day: data[index].day,
          currency: "USDT",
          amount: data[index].amount,
          incomeAtEnd: data[index].incomeAtEnd,
          percentage: data[index].percentage
        }),
      });

      if (response.ok) {
        setSuccess('Листинг успешно активирован');
      } else {
        const { error: responseError } = await response.json();
        setError( 'Ошибка сервера');
        console.log(responseError)
      }
    } catch (error) {
      setError(`Ошибка сервера. Попробуйте позже.`);
      console.log(error)
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

  return (
    <div className="bg-gray-50 flex flex-wrap flex-row sm:gap-[35px] gap-[25px] w-full">
      {data.map((item, index) => {
        const isHovered = hoveredIndex === index; // Перевіряємо, чи ховер для цього елемента
        const strokeDashoffset = isHovered
          ? circumference - (finalPercentage / 100) * circumference
          : circumference - (initialPercentage / 100) * circumference;
        return (
          <div key={index} className="bg-[#0d316d] text-white rounded-[15px] gap-[6px] px-[30px] py-[25px] mb-[30px] sm:min-w-[370px] min-w-[316px] relative">
            <div className='text-[#3581FF] sm:text-[40px] text-[36px] bold'>${item.amount}</div>
            <div className='text-white text-[24px] bold mb-[30px]'>на {item.duration}</div>
            <div className='text-white text-[16px] mb-[10px] max-w-[200px]'>{item.incomeAtEnd? "Доход вместе с депозитом в конце срока": "Ежедневно  и Включен возврат тела в ежедневные начисления"}</div>
            <div className='flex justify-end'>
              <button onClick={(e)=> handleSubmit(e, index)} className='px-[25px] py-[10px] rounded-full bg-[#576f9b] hover:bg-[#3581FF]'>Вложить</button>
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
