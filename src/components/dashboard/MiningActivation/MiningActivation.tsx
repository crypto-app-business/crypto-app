'use client';

import { useState, useEffect } from 'react';
import ContractData from './contractData'

interface User {
  id: string;
  balance: Record<string, number>;
  role: string;
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
          className="w-full max-w-[300px] p-2 border rounded text-black"
          placeholder={`от ${availableContracts[selectedSessionIndex][0]}$`}
        />
      )}
    </label>
  );
};

export default function MiningActivation({ user }: MiningActivationProps) {
  const [miningSessions, setMiningSessions] = useState<MiningSession[]>([]);
  const [week, setWeek] = useState('');
  const [percentage, setPercentage] = useState('');
  const [currency, setCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string>('');;
  const availableContracts = Object.entries(ContractData());
  const [selectedSessionIndex, setSelectedSessionIndex] = useState<number>(0);

  // useEffect(() => {
  //   const fetchMiningSessions = async () => {
  //     if (!user?.id) return;
  //     try {
  //       const response = await fetch(`/api/mining?userId=${user?.id}`);
  //       if (response.ok) {
  //         const data: { sessions: MiningSession[] } = await response.json();
  //         setMiningSessions(data.sessions);
  //       } else {
  //         console.error('Ошибка получения данных о майнинге.');
  //       }
  //     } catch (error) {
  //       console.error('Ошибка сервера:', error);
  //     }
  //   };

  //   fetchMiningSessions();
  // }, [user?.id]);

  useEffect(() => {
    const fetchMiningSessions = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(`/api/mining?userId=${user?.id}`);
        if (response.ok) {
          const data: { sessions: MiningSession[] } = await response.json();
          setMiningSessions(data.sessions);
        } else {
          console.error('Ошибка получения данных о майнинге.');
        }
      } catch (error) {
        console.error('Ошибка сервера:', error);
      }
    };
  
    const updateMiningBalances = async () => {
      try {
        const response = await fetch('/api/mining/complete', { method: 'PATCH', body: JSON.stringify({ userId: user?.id }), });
        if (!response.ok) {
          console.error('Ошибка обновления баланса для майнинга.');
        }
      } catch (error) {
        console.error('Ошибка сервера при обновлении баланса:', error);
        }
      };
  
      fetchMiningSessions();
      updateMiningBalances(); // Додаємо виклик для оновлення балансу
    }, [user?.id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if(!(availableContracts[selectedSessionIndex][0] <= amount)){
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
        const data = await response.json();
        setMiningSessions(data.updatedSessions);
        alert('Time simulated successfully!');
      } else {
        console.error('Failed to simulate time.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <>
    <div className="bg-gray-50 p-6 flex flex-wrap sm:flex-row flex-col-reverse gap-[70px] w-full">
      <div className='max-w-[300px]'>
        <h3 className="text-[24px] font-bold mb-[20px]">Майнинговые сессии</h3>
        {user?.role === "admin" &&<button
          onClick={handleSimulateTime}
          className="bg-blue text-white px-4 py-2 rounded mb-4"
          // disabled={isLoading}
        >
          {/* {isLoading ? 'Simulating...' : 'Simulate Time'} */}
          Симулировать майнинг
        </button>}
        <div className='flex flex-col gap-[15px]'>
        {availableContracts.map(([amountRange, { weeks }], index) => (
          <div key={amountRange}>
          <div
            className={`px-[15px] py-[10px] border rounded-[15px] cursor-pointer ${
              selectedSessionIndex === index ? 'bg-blue text-white' : ''
            }`}
            onClick={() => handleSelectSession(index, { weeks })}
          >
            <div className='flex justify-between  items-center'>
              <div className='text-[24px] font-bold'>#{index+1}</div>
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
            {selectedSessionIndex === index &&<div className='sm:hidden block'>
              <h3 className="text-[24px] font-bold mb-[20px] text-blue">Активировать майнинг</h3>
              <div className="flex flex-wrap gap-4 mb-[30px] ">       
                <div className="bg-blue rounded-[15px] shadow-md w-[330px] min-h-[203px]">
                  <div className="text-white rounded-[15px] pt-[31px] pl-[27px] pr-[27px]">
                    <div className="">
                        <h4 className="text-[20px] mb-[15px] font-bold">Сессия #{selectedSessionIndex+1}</h4>
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
                            className="w-full max-w-[300px] p-2 border rounded text-black"
                          >
                            <option value="">Вибрать</option>
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
      <div className='max-w-[330px] sm:block hidden'>
        <h3 className="text-[24px] font-bold mb-[20px] text-blue">Активировать майнинг</h3>
        <div className="flex flex-wrap gap-4 mb-[30px] ">       
          <div className="bg-blue rounded-[15px] shadow-md w-[330px] min-h-[203px]">
            <div className="text-white rounded-[15px] pt-[31px] pl-[27px] pr-[27px]">
              <div className="">
                  <h4 className="text-[20px] mb-[15px] font-bold">Сессия #{selectedSessionIndex+1}</h4>
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
                      className="w-full max-w-[300px] p-2 border rounded text-black"
                    >
                      <option value="">Вибрать</option>
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
    <h3 className="text-xl font-bold mt-10 text-gray-800">Активные майнинговые сессии</h3>

    {miningSessions?.length > 0 ? (
  <div className="flex flex-wrap gap-6 mt-6">
    {miningSessions.map((session, index) => (
      <div
        key={index}
        className="p-6 bg-white border rounded-lg shadow-md hover:shadow-lg"
      >
        <p>
          <strong className="text-gray-700">Криптовалюта:</strong> {session.currency}
        </p>
        <p>
          <strong className="text-gray-700">Сумма:</strong> {session.amount}
        </p>
        <p>
          <strong className="text-gray-700">Дата создания:</strong>{' '}
          {new Date(session.startDate).toLocaleString()}
        </p>
        <p>
          <strong className="text-gray-700">Дата завершения:</strong>{' '}
          {new Date(session.endDate).toLocaleString()}
        </p>
        <p>
          <strong className="text-gray-700">Проценти:</strong>{' '}
          {session.percentage}%
        </p>
      </div>
    ))}
  </div>
) : (
  <p className="text-gray-500 mt-4">Нет активных сессий.</p>
)}
    </>
  );
}