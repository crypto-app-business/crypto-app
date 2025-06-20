'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import RequestStatusIndicator from '@/components/dashboard/RequestStatusIndicator/RequestStatusIndicator';
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

const handleSimulateTime = async (language: string) => {
  const translations = {
    confirmSimulate: {
      ru: "Вы уверены, что хотите симулировать время?",
      en: "Are you sure you want to simulate time?",
    },
    simulateSuccess: {
      ru: "Время успешно симулировано!",
      en: "Time simulated successfully!",
    },
  };

  if (!confirm(translations.confirmSimulate[language])) return;

  try {
    const response = await fetch('/api/updateStaking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

export default function StakingActivation({ user }: StakingActivationProps) {
  const { language } = useLanguageStore();
  const [currency] = useState<string>('USDT');
  const [amount, setAmount] = useState<string>('');
  const [usdtAmount, setUSDTAmount] = useState("");
  const [ccAmount, setCCAmount] = useState("");
  const [isUSDTActive, setIsUSDTActive] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [miningSessions, setMiningSessions] = useState<MiningSession[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [requestStatus, setRequestStatus] = useState<'loading' | 'success' | 'error' | null>(null);
  const [loading, setLoading] = useState(true); 

  const translations = {
    simulateStaking: {
      ru: "Симулировать стейкинг",
      en: "Simulate Staking",
    },
    investedInStaking: {
      ru: "Вложено в стейкинг",
      en: "Invested in Staking",
    },
    balance: {
      ru: "Баланс",
      en: "Balance",
    },
    earned: {
      ru: "Заработано",
      en: "Earned",
    },
    exchange: {
      ru: "Обменять",
      en: "Exchange",
    },
    to: {
      ru: "на",
      en: "to",
    },
    amount: {
      ru: "Сумма",
      en: "Amount",
    },
    currencyExchange: {
      ru: "Обмен валюты",
      en: "Currency Exchange",
    },
    investInStaking: {
      ru: "Вложить в стейкинг",
      en: "Invest in Staking",
    },
    withdrawInvestment: {
      ru: "Вывести вложение",
      en: "Withdraw Investment",
    },
    errors: {
      fillAllFields: {
        ru: "Пожалуйста заполните все поля.",
        en: "Please fill in all fields.",
      },
      invalidAmount: {
        ru: "Введите корректное количество.",
        en: "Enter a valid amount.",
      },
      amountExceedsBalance: {
        ru: "Введенная сумма больше баланса.",
        en: "The entered amount exceeds the balance.",
      },
      stakingActivationFailed: {
        ru: "Не получилось активировать стейкинг.",
        en: "Failed to activate staking.",
      },
      withdrawalFailed: {
        ru: "Не получилось вывести деньги.",
        en: "Failed to withdraw funds.",
      },
      serverError: {
        ru: "Ошибка сервера. Попробуйте позже.",
        en: "Server error. Try again later.",
      },
      invalidExchangeAmount: {
        ru: "Введите корректную сумму для обмена.",
        en: "Enter a valid amount for exchange.",
      },
      exchangeFailed: {
        ru: "Ошибка при обмене валюты.",
        en: "Error during currency exchange.",
      },
    },
    success: {
      stakingActivated: {
        ru: "Стейкинг успешно активирован!",
        en: "Staking successfully activated!",
      },
      fundsWithdrawn: {
        ru: "Деньги успешно выведены!",
        en: "Funds successfully withdrawn!",
      },
      exchangeCompleted: {
        ru: "Обмен успешно выполнен!",
        en: "Exchange successfully completed!",
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
  };

  const fetchMiningSessions = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`/api/staking?userId=${user.id}`);
      if (response.ok) {
        const data: { sessions: MiningSession[], user: User } = await response.json();
        const filteredSessions = data.sessions.filter(session => session.currency === 'CC');
        setMiningSessions(filteredSessions);
        setBalance(data.user.balance.CC || 0);
      } else {
        console.error('Error fetching staking data.');
      }
    } catch (error) {
      console.error('Server error:', error);
    } finally {
      setLoading(false);
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
      setError(translations.errors.fillAllFields[language]);
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError(translations.errors.invalidAmount[language]);
      return;
    }

    if (action === "withdraw" && miningSessions[0]?.amount < numericAmount) {
      setError(translations.errors.amountExceedsBalance[language]);
      return;
    }
    setRequestStatus('loading');
    try {
      const response = await fetch('/api/staking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          currency: "CC",
          amount: numericAmount,
          action: action,
        }),
      });

      if (response.ok) {
        const updatedBalance = { ...user.balance };
        updatedBalance[currency] -= numericAmount;

        if (action === "add") {
          setSuccess(translations.success.stakingActivated[language]);
          setRequestStatus('success');
          setBalance(balance - +amount);
        }
        if (action === "withdraw") {
          setSuccess(translations.success.fundsWithdrawn[language]);
          setRequestStatus('success');
          setBalance(balance + +amount);
        }
        const newSession: MiningSession = (await response.json()).data;
        setMiningSessions((prevSessions) => [...prevSessions, newSession]);
        await fetchMiningSessions();
      } else {
        const { error: responseError } = await response.json();
        setRequestStatus('error');
        if (action === "add") setError(responseError || translations.errors.stakingActivationFailed[language]);
        if (action === "withdraw") setError(responseError || translations.errors.withdrawalFailed[language]);
      }
    } catch (error) {
      console.error(error);
      setRequestStatus('error');
      setError(translations.errors.serverError[language]);
    }
  };

  const handleSwap = () => {
    setIsUSDTActive((prev) => !prev);
    setUSDTAmount(`${+ccAmount / 10}`);
    setCCAmount(`${+usdtAmount * 10}`);
  };

  const handleUSDTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setUSDTAmount(value);
      setCCAmount(value ? (parseFloat(value) * 10).toString() : "");
    }
  };

  const handleCCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setCCAmount(value);
      setUSDTAmount(value ? (parseFloat(value) / 10).toString() : "");
    }
  };

  const handleExchange = async () => {
    setError('');
    setSuccess('');

    const amount = parseFloat(isUSDTActive ? usdtAmount : ccAmount);
    if (isNaN(amount) || amount <= 0) {
      setError(translations.errors.invalidExchangeAmount[language]);
      return;
    }

    const fromCurrency = isUSDTActive ? 'USDT' : 'CC';
    const toCurrency = isUSDTActive ? 'CC' : 'USDT';
    setRequestStatus('loading');

    try {
      const response = await fetch('/api/staking-exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          fromCurrency,
          toCurrency,
          amount,
        }),
      });

      if (response.ok) {
        setSuccess(translations.success.exchangeCompleted[language]);
        setRequestStatus('success');
      } else {
        const { error: responseError } = await response.json();
        setError(responseError || translations.errors.exchangeFailed[language]);
        setRequestStatus('error');
      }
    } catch (error) {
      console.error(error);
      setError(translations.errors.serverError[language]);
      setRequestStatus('error');
    }
  };

  const handleSpinnerHide = () => {
    setRequestStatus(null);
  };

  if(loading) return(<div>Loading...</div>)

  return (
    <div className="bg-gray-50 flex flex-wrap flex-row sm:gap-[4%] sm:justify-start justify-center w-full">
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
          onClick={() => handleSimulateTime(language)}
          className="bg-blue text-white px-4 py-2 rounded mb-4"
        >
          {translations.simulateStaking[language]}
        </button>
      )}
      <div
        className="rounded-[15px] gap-[6px] p-[30px] mb-[30px] min-w-[325px] w-full sm:w-[45%]"
        style={{
          boxShadow: '8px 10px 18.5px 0px rgba(0, 22, 58, 0.25)',
          background: 'linear-gradient(180.00deg, rgba(53, 191, 255, 0) 33%,rgba(53, 191, 255, 0.74) 100%),rgb(53, 129, 255)',
        }}
      >
        <div className="flex mb-[15px]">
          <div className="text-white">
            <div className="flex items-center">
              <Image
                src="/dashboard/mining/safe.svg"
                alt="Safe Icon"
                width={40}
                height={40}
                objectFit="cover"
                priority={false}
              />
              <div>
                <div className="text-[16px] font-semibold uppercase">
                  {translations.investedInStaking[language]}
                </div>
              </div>
            </div>
            <div className="flex items-end gap-[6px] ml-[40px] mt-[-13px]">
              {miningSessions[0]?.amount && (
                <div className="text-[24px] font-bold">{miningSessions[0].amount.toFixed(2)}</div>
              )}
              {miningSessions[0]?.amount && (
                <div className="text-[14px]">{miningSessions[0].currency}</div>
              )}
            </div>
          </div>
        </div>
        <div className="flex mb-[35px]">
          <div className="text-white">
            <div className="flex items-center">
              <Image
                src="/dashboard/mining/coins.svg"
                alt="Coins Icon"
                width={40}
                height={40}
                objectFit="cover"
                priority={false}
              />
              <div>
                <div className="text-[16px] font-semibold uppercase">
                  {translations.balance[language]}
                </div>
              </div>
            </div>
            <div className="flex items-end gap-[6px] ml-[40px] mt-[-13px]">
              <div className="text-[24px] font-bold">{balance.toFixed(0) || 0.00}</div>
              <div className="text-[14px]">CC</div>
            </div>
          </div>
        </div>
        <div className="flex mb-[30px]">
          <div className="text-[#00163A]">
            <div className="flex items-center">
              <Image
                src="/dashboard/mining/shield.svg"
                alt="Shield Icon"
                width={40}
                height={40}
                objectFit="cover"
                priority={false}
              />
              <div>
                <div className="text-[16px] font-semibold uppercase">
                  {translations.earned[language]}
                </div>
              </div>
            </div>
            <div className="flex items-end gap-[6px] ml-[40px] mt-[-13px]">
              <div className="text-[24px] font-bold">{miningSessions[0]?.fullAmount?.toFixed(2) || 0}</div>
              <div className="text-[14px]">CC</div>
            </div>
          </div>
        </div>
        <div>
          <div className="text-[14px] font-semibold text-[#00163A] mb-[5px]">
            {translations.exchange[language]}
          </div>
          <div className="flex gap-[10px] items-center">
            <input
              type="text"
              placeholder={translations.amount[language]}
              className="mb-[10px] rounded pl-[15px] py-[5px] text-[black] min-w-[209px]"
              onChange={isUSDTActive ? handleUSDTChange : handleCCChange}
              value={isUSDTActive ? usdtAmount : ccAmount}
            />
            <div className="text-[14px] mb-[10px]">{isUSDTActive ? "USDT" : "CC"}</div>
          </div>
          <div className="flex justify-between items-center max-w-[208px]">
            <div className="text-[14px] font-semibold text-[#00163A] mb-[10px]">
              {translations.to[language]}
            </div>
            <Image
              src="/dashboard/staking/arrow-2-svgrepo-com.svg"
              alt="Swap Icon"
              width={24}
              height={24}
              className="rotate-90 mb-[10px] cursor-pointer"
              onClick={handleSwap}
            />
          </div>
          <div className="flex gap-[10px] items-center">
            <input
              type="text"
              placeholder={translations.amount[language]}
              className="mb-[20px] rounded pl-[15px] py-[5px] text-[black] min-w-[209px]"
              onChange={isUSDTActive ? handleCCChange : handleUSDTChange}
              value={!isUSDTActive ? usdtAmount : ccAmount}
              disabled={true}
            />
            <div className="text-[14px] mb-[20px]">{isUSDTActive ? "CC" : "USDT"}</div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleExchange}
            className="px-[25px] py-[10px] rounded-full bg-[#71a7fe] text-white text-[16px] bold"
            style={{
              background: 'rgba(255, 255, 255, 0.3)',
            }}
          >
            {translations.currencyExchange[language]}
          </button>
        </div>
      </div>

      <div
        className="bg-[#00163A] rounded-[15px] gap-[6px] p-[30px] mb-[30px] min-w-[325px] sm:min-w-[400px] w-full sm:w-[47%] max-h-[345px]"
        style={{
          boxShadow: '8px 10px 18.5px 0px rgba(0, 22, 58, 0.25)',
        }}
      >
        <div className="flex justify-center flex-col items-center mb-[15px] text-white h-full text-[16px] max-w-[210px] ml-auto mr-auto">
          <Image
            src="/dashboard/staking/Coin_gif.gif"
            alt="Coin Animation"
            width={73}
            height={73}
            objectFit="cover"
            priority={false}
          />
          <button
            onClick={(e) => handleSubmit(e, "add")}
            className="px-[25px] py-[10px] rounded-full bg-[#3581FF4D] font-bold mb-[20px]"
          >
            {translations.investInStaking[language]}
          </button>
          <div className="flex gap-[10px] items-center">
            <input
              type="text"
              placeholder={translations.amount[language]}
              className="mb-[20px] rounded pl-[15px] py-[5px] text-[black]"
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) {
                  setAmount(value);
                }
              }}
            />
            <div className="text-[14px] mb-[20px]">CC</div>
          </div>
          {error && <div className="text-red-500 w-max mb-[20px]">{error}</div>}
          {success && !error && <div className="text-green-500 w-max mb-[20px]">{success}</div>}
          <button
            onClick={(e) => handleSubmit(e, "withdraw")}
            className="px-[25px] py-[10px] rounded-full bg-[#4b5b75] font-bold"
          >
            {translations.withdrawInvestment[language]}
          </button>
          <Image
            src="/dashboard/staking/Dolar_gif.gif"
            alt="Dollar Animation"
            width={73}
            height={73}
            objectFit="cover"
            priority={false}
          />
        </div>
      </div>
    </div>
  );
}