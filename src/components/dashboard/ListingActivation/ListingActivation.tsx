'use client';

import { useState } from 'react';
import RequestStatusIndicator from '@/components/dashboard/RequestStatusIndicator/RequestStatusIndicator';
import User from '@/models/User';
import { useLanguageStore } from '@/store/useLanguageStore';

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
  const { language } = useLanguageStore();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [listingIndex, setListingIndex] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedSessionIndex, setSelectedSessionIndex] = useState<number>(0);
  const finalPercentage = 100;
  const [requestStatus, setRequestStatus] = useState<'loading' | 'success' | 'error' | null>(null);

  const translations = {
    simulateListing: {
      ru: "Симулировать листинг",
      en: "Simulate Listing",
    },
    forDuration: {
      ru: "на",
      en: "for",
    },
    incomeAtEnd: {
      ru: "Доход вместе с депозитом в конце срока",
      en: "Income with deposit at the end of the term",
    },
    dailyIncome: {
      ru: "Ежедневно и Включен возврат тела в ежедневные начисления",
      en: "Daily and deposit return included in daily accruals",
    },
    listingAmount: {
      ru: "Сумма листинга:",
      en: "Listing amount:",
    },
    invest: {
      ru: "Вложить",
      en: "Invest",
    },
    errors: {
      amountBelowListing: {
        ru: "Сумма меньше листинга",
        en: "Amount is less than the listing",
      },
      insufficientFunds: {
        ru: "Недостаточно денег",
        en: "Insufficient funds",
      },
      selectNextListing: {
        ru: "Выберите следующий листинг",
        en: "Select the next listing",
      },
      fillAllFields: {
        ru: "Пожалуйста заполните все поля.",
        en: "Please fill in all fields.",
      },
      // invalidAmount: {
      //   ru: "Введите корректное количество.",
      //   en: "Enter a valid amount.",
      // },
      serverError: {
        ru: "Ошибка сервера",
        en: "Server error",
      },
      serverErrorRetry: {
        ru: "Ошибка сервера. Попробуйте позже.",
        en: "Server error. Try again later.",
      },
    },
    success: {
      listingActivated: {
        ru: "Листинг успешно активирован",
        en: "Listing successfully activated",
      },
    },
    requestStatus: {
      success: {
        ru: "Успех",
        en: "Success",
      },
      error: {
        ru: "Ошибка",
        en: "Error",
      },
    },
    confirmSimulate: {
      ru: "Вы уверены, что хотите симулировать время?",
      en: "Are you sure you want to simulate time?",
    },
    simulateSuccess: {
      ru: "Время успешно симулировано!",
      en: "Time simulated successfully!",
    },
  };

  const radius = 55;
  const circumference = 2 * Math.PI * radius;

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    if (isOpen && selectedSessionIndex === index) {
      e.preventDefault();
      setError('');
      setSuccess('');
      setListingIndex(index);

      if (!(data[index].amount <= amount)) {
        setError(translations.errors.amountBelowListing[language]);
        return;
      }
      if (user?.balance?.USDT <= amount) {
        setError(translations.errors.insufficientFunds[language]);
        return;
      }

      if (index + 1 < data.length && data[index + 1]?.amount <= amount) {
        setError(translations.errors.selectNextListing[language]);
        return;
      }

      if (!amount) {
        setError(translations.errors.fillAllFields[language]);
        return;
      }

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
            percentage: data[index].percentage,
          }),
        });

        if (response.ok) {
          setSuccess(translations.success.listingActivated[language]);
          setRequestStatus('success');
          setIsOpen(false);
        } else {
          const { error: responseError } = await response.json();
          setError(responseError || translations.errors.serverError[language]);
          setRequestStatus('error');
        }
      } catch (error) {
        setError(translations.errors.serverErrorRetry[language]);
        setRequestStatus('error');
        console.log(error);
      }
    } else {
      setSelectedSessionIndex(index);
      setRequestStatus('error');
      setIsOpen(true);
      setError('');
    }
  };

  const data: DataItem[] = [
    { amount: 5000, duration: language === 'ru' ? "3 недели" : "3 weeks", day: 21, incomeAtEnd: true, percentage: 24 },
    { amount: 10000, duration: language === 'ru' ? "2 недели" : "2 weeks", day: 14, incomeAtEnd: true, percentage: 27 },
    { amount: 25000, duration: language === 'ru' ? "1 неделю" : "1 week", day: 7, incomeAtEnd: true, percentage: 18 },
    { amount: 50000, duration: language === 'ru' ? "5 дней" : "5 days", day: 5, percentage: 25 },
    { amount: 100000, duration: language === 'ru' ? "3 дня" : "3 days", day: 3, percentage: 40 },
    { amount: 250000, duration: language === 'ru' ? "2 дня" : "2 days", day: 2, percentage: 62 },
    { amount: 500000, duration: language === 'ru' ? "1 день" : "1 day", day: 1, percentage: 125 },
  ];

  const handleSimulateTime = async () => {
    if (!confirm(translations.confirmSimulate[language])) return;

    try {
      const response = await fetch('/api/admin/simulate-listing', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        alert(translations.simulateSuccess[language]);
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
            ? translations.requestStatus.success[language]
            : requestStatus === 'error'
            ? translations.requestStatus.error[language]
            : undefined
        }
        onHide={handleSpinnerHide}
      />
      {user?.role === "admin" && (
        <button
          onClick={handleSimulateTime}
          className="bg-blue text-white px-4 py-2 rounded mb-4"
        >
          {translations.simulateListing[language]}
        </button>
      )}
      {data.map((item, index) => {
        const isHovered = hoveredIndex === index;
        const strokeDashoffset = isHovered
          ? circumference - (finalPercentage / 100) * circumference
          : circumference - (item.percentage > 100 ? 1 : item.percentage / 100) * circumference;
        return (
          <div
            key={index}
            className="bg-[#0d316d] text-white rounded-[15px] gap-[6px] px-[30px] py-[25px] mb-[30px] sm:min-w-[370px] min-w-[316px] relative"
            style={{
              background: 'linear-gradient(180.00deg, rgba(53, 129, 255, 0),rgba(53, 129, 255, 0.35) 100%),rgb(0, 22, 58)',
              boxShadow: '8px 10px 18.5px 0px rgba(0, 22, 58, 0.25)',
            }}
          >
            <div className="text-[#3581FF] sm:text-[40px] text-[36px] bold">${item.amount}</div>
            <div className="text-white text-[24px] bold mb-[30px]">
              {translations.forDuration[language]} {item.duration}
            </div>
            <div className="text-white text-[16px] mb-[10px] max-w-[200px]">
              {item.incomeAtEnd ? translations.incomeAtEnd[language] : translations.dailyIncome[language]}
            </div>
            {isOpen && selectedSessionIndex === index && (
              <label className="block mb-2">
                <div className="text-[16px] mb-[5px] text-white">{translations.listingAmount[language]}</div>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) {
                      setAmount(parseFloat(value) || 0);
                    }
                  }}
                  className="w-full max-w-[300px] p-2 border rounded text-black"
                />
              </label>
            )}
            <div className="flex justify-end">
              <button
                onClick={(e) => handleSubmit(e, index)}
                className="px-[25px] py-[10px] rounded-full bg-[#576f9b] hover:bg-[#3581FF]"
              >
                {translations.invest[language]}
              </button>
            </div>
            {index === listingIndex && error && <div className="text-red-500">{error}</div>}
            {index === listingIndex && success && <div className="text-green-500">{success}</div>}
            <div className="sm:flex hidden items-center justify-center absolute top-[25px] right-[30px]"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <svg width="131" height="131" viewBox="0 0 131 131" className="cursor-pointer">
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
                  strokeWidth="17"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-180 65.5 65.5)"
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[24px] font-bold">
                {item.percentage}%
              </div>
            </div>
            <div
              className="flex items-center justify-center absolute top-[15px] right-[15px] sm:hidden"
              style={{ transform: "scale(0.8)" }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <svg width="131" height="131" viewBox="0 0 131 131" className="cursor-pointer">
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
                  transform="rotate(-180 65.5 65.5)"
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[24px] font-bold">
                {item.percentage}%
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}