'use client';

import { useState, useEffect } from 'react';
import ContractData from './contractData'
import RequestStatusIndicator from '@/components/dashboard/RequestStatusIndicator/RequestStatusIndicator';

interface User {
  id: string;
  balance: Record<string, number>;
  role: string;
}

interface MiningActivationProps {
  user: User;
}

interface Week {
  weekNumber: number;
  percentage: number;
}

interface ContractWeeks {
  weeks: Week[];
}

type ContractData = [string, ContractWeeks][];

interface DepositInputProps {
  amount: string;
  setAmount: (value: string) => void;
  selectedSessionIndex: number;
  availableContracts: ContractData;
}

const DepositInput = ({
  amount,
  setAmount,
  selectedSessionIndex,
  availableContracts
}: DepositInputProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <label className="block mb-2">
      <div className="text-[16px] mb-[5px] text-black">Сумма депозита:</div>
      {availableContracts.length > selectedSessionIndex && (
        <input
          type="text"
          value={amount}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*\.?\d*$/.test(value)) {
              setAmount(value);
            }
          }}
          className="w-full max-w-[300px] p-2 rounded text-black"
          placeholder={`от ${availableContracts[selectedSessionIndex][0]}$`}
        />
      )}
    </label>
  );
};

export default function MiningActivation({ user }: MiningActivationProps) {
  const [week, setWeek] = useState('');
  const [percentage, setPercentage] = useState('');
  const [currency, setCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string>('');;
  const availableContracts = Object.entries(ContractData());
  const [selectedSessionIndex, setSelectedSessionIndex] = useState<number>(0);
  const [requestStatus, setRequestStatus] = useState<'loading' | 'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!(availableContracts[selectedSessionIndex][0] <= amount)) {
      setError('Сумма меньше контракта');
      return;
    }
    if (!week || !amount || !percentage) {
      setError('Пожалуйста зполните все поля.');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Введите корректное количество.');
      return;
    }
    setCurrency("USDT")
    setRequestStatus('loading');
    try {
      const response = await fetch('/api/mining', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          week,
          currency: "USDT",
          amount,
          percentage
        }),
      });

      if (response.ok) {
        const updatedBalance = { ...user.balance };
        updatedBalance[currency] -= numericAmount;

        setRequestStatus('success');
      } else {
        const { error: responseError } = await response.json();
        setRequestStatus('error');
        setError(responseError || 'Не получилось активировать майнинг.');
      }
    } catch (error) {
      console.log(error)
      setRequestStatus('error');
      setError('Ошибка сервера. Попробуйте позже.');
    }
  };

  const handleSelectSession = (index: number, session: ContractWeeks) => {
    setSelectedSessionIndex(index);
    setWeek(session.weeks[0]?.weekNumber?.toString() || '');
  };

  const handleSimulateTime = async () => {
    if (!confirm('Are you sure you want to simulate time?')) return;

    try {
      const response = await fetch('/api/admin/simulate-mining', {
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
    <>
      <div className="bg-gray-50 flex flex-wrap sm:flex-row flex-col-reverse gap-[70px] w-full sm:ml-[45px]">
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
        <div className='max-w-[300px]'>
          <h3 className="text-[24px] font-bold mb-[20px] uppercase">Майнинговые сессии</h3>
          {user?.role === "admin" && <button
            onClick={handleSimulateTime}
            className="bg-blue text-white px-4 py-2 rounded mb-4"
          >
            Симулировать майнинг
          </button>}
          <div className='flex flex-col gap-[15px]'>
            {availableContracts.map(([amountRange, { weeks }], index) => (
              <div key={amountRange} className='flex flex-wrap gap-[10px] min-h-[82px] justify-end'>
                {selectedSessionIndex === index && <div className='w-[5px] bg-[#3581FF] min-h-[54px] h-[100%] rounded-full'></div>}
                <div
                  className={`px-[15px] py-[10px] border rounded-[15px] cursor-pointer w-full max-w-[284px] ${selectedSessionIndex === index ? 'bg-blue text-white' : ''
                    }`}
                  onClick={() => handleSelectSession(index, { weeks })}
                >
                  <div className='flex justify-between  items-center'>
                    <div className='text-[24px] font-bold'>#{index + 1}</div>
                    <div className='text-[16px]'>от ${amountRange}</div>
                    {weeks[weeks.length - 1].weekNumber === weeks[0].weekNumber ?
                      <div className='text-[16px] font-semibold'>{weeks[0].weekNumber} неделя</div>
                      :
                      <div className='text-[16px] font-semibold'>{weeks.length > 0 && (`от  ${weeks[weeks.length - 1].weekNumber}-${weeks[0].weekNumber} неделя`)}</div>
                    }

                  </div>
                  {weeks[weeks.length - 1].percentage === weeks[0].percentage ?
                    <div className='text-[16px] ml-auto w-max'>{weeks[0].percentage}%</div>
                    :
                    <div className='text-[16px] ml-auto w-max'>{weeks.length > 0 && (`от ${weeks[weeks.length - 1].percentage}-${weeks[0].percentage}%`)}</div>
                  }
                </div>
                {selectedSessionIndex === index && <div className='sm:hidden block'>
                  <h3 className="text-[24px] font-bold mb-[20px] text-blue">Активировать майнинг</h3>
                  <div className="flex flex-wrap gap-4 mb-[30px] w-full">
                    <div className="bg-blue rounded-[15px] shadow-md w-[330px] min-h-[203px]">
                      <div className="text-white rounded-[15px] pt-[31px] pl-[27px] pr-[27px]">
                        <div className="">
                          <h4 className="text-[20px] mb-[15px] font-bold">Сессия #{selectedSessionIndex + 1}</h4>
                          <form onSubmit={handleSubmit}>
                            <label className="mb-[10px] block">
                              <div className="text-[16px] mb-[5px] text-black">Виберите срок и %:</div>
                              <select
                                value={week && percentage ? `${week}-${percentage}` : ""}
                                onChange={(e) => {
                                  const [weekValue, percentageValue] = e.target.value.split('-');
                                  setWeek(weekValue);
                                  setPercentage(percentageValue);
                                }}
                                className="w-full max-w-[300px] p-2 rounded text-black"
                              >
                                <option value="">Выбрать</option>
                                {availableContracts[selectedSessionIndex][1].weeks.map((elem, index) => (
                                  <option key={`week-${index}`} value={`${elem.weekNumber}-${elem.percentage}`}>
                                    {elem.weekNumber} неделя - {elem.percentage}%
                                  </option>
                                ))}
                              </select>
                            </label>
                            <DepositInput
                              amount={amount}
                              setAmount={setAmount}
                              selectedSessionIndex={selectedSessionIndex}
                              availableContracts={availableContracts}
                            />
                            <div>{error}
                            </div>
                            <div className="flex justify-end mb-[31px]">
                              <button type="submit" className="mt-4 bg-[#71baff] text-white text-[16px] font-bold px-[25px] py-[10px] rounded-full hover:bg-gray-200 transition">
                                Пополнить
                              </button>

                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>}
              </div>
            ))}
          </div>

        </div>
        <div className='max-w-[330px] sm:block hidden w-full'>
          <h3 className="text-[24px] font-bold mb-[20px] text-blue uppercase">Активировать майнинг</h3>
          <div className="flex flex-wrap gap-4 mb-[30px] ">
            <div className="bg-blue rounded-[15px] shadow-md w-[330px] min-h-[203px]">
              <div className="text-white rounded-[15px] pt-[31px] pl-[27px] pr-[27px]">
                <div className="">
                  <h4 className="text-[20px] mb-[15px] font-bold">Сессия #{selectedSessionIndex + 1}</h4>
                  <form onSubmit={handleSubmit}>
                    <label className="mb-[10px] block">
                      <div className="text-[16px] mb-[5px] text-black">Виберите срок и %:</div>
                      <select
                        value={week && percentage ? `${week}-${percentage}` : ""}
                        onChange={(e) => {
                          const [weekValue, percentageValue] = e.target.value.split('-');
                          setWeek(weekValue);
                          setPercentage(percentageValue);
                        }}
                        className="w-full max-w-[300px] p-2 rounded text-black"
                      >
                        <option value="">Выбрать</option>
                        {availableContracts[selectedSessionIndex][1].weeks.map((elem, index) => (
                          <option key={`week-${index}`} value={`${elem.weekNumber}-${elem.percentage}`}>
                            {elem.weekNumber} неделя - {elem.percentage}%
                          </option>
                        ))}
                      </select>
                    </label>
                    <DepositInput
                      amount={amount}
                      setAmount={setAmount}
                      selectedSessionIndex={selectedSessionIndex}
                      availableContracts={availableContracts}
                    />
                    <div>{error}
                    </div>
                    <div className="flex justify-end mb-[31px]">
                      <button type="submit" className="mt-4 bg-[#71baff] text-white text-[16px] font-bold px-[25px] py-[10px] rounded-full hover:bg-gray-200 transition">
                        Пополнить
                      </button>

                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}