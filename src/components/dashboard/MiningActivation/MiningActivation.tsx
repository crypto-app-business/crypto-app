// 'use client';

// import { useState, useEffect } from 'react';

// interface User {
//   id: string;
//   balance: Record<string, number>;
// }

// interface MiningSession {
//   id: string;
//   currency: string;
//   amount: number;
//   startDate: string;
//   endDate: string;
//   percentage: number[];
// }

// interface MiningActivationProps {
//   user: User;
// }

// export default function MiningActivation({ user }: MiningActivationProps) {
//   const [week, setWeek] = useState<string>('');
//   const [currency, setCurrency] = useState<string>('');
//   const [amount, setAmount] = useState<string>('');
//   const [error, setError] = useState<string>('');
//   const [miningSessions, setMiningSessions] = useState<MiningSession[]>([]);

//   useEffect(() => {
//     const fetchMiningSessions = async () => {
//       if (!user?.id) return;
//       try {
//         const response = await fetch(`/api/mining?userId=${user?.id}`);
//         if (response.ok) {
//           const data: { sessions: MiningSession[] } = await response.json();
//           console.log('Отримані сесії:', data.sessions);
//           setMiningSessions(data.sessions);
//         } else {
//           console.error('Ошибка получения даних про майнинг.');
//         }
//       } catch (error) {
//         console.error('Ошибка сервера:', error);
//       }
//     };

//     fetchMiningSessions();
//   }, [user?.id]);

//   const calculatePercentages = (weeks: number): number[] => {
//     const percentages: number[] = [];
//       percentages.push(1 + (weeks - 1) * 0.1); // Для 1 тижня: 1%, для 2: 1.1%, і т.д.
//     return percentages;
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError('');

//     if (!week || !currency || !amount) {
//       setError('Пожалуйста зполните все поля.');
//       return;
//     }

//     const numericAmount = parseFloat(amount);
//     if (isNaN(numericAmount) || numericAmount <= 0) {
//       setError('Введите корректное количество.');
//       return;
//     }
//     const numericWeek = parseInt(week, 10);
//     const percentage = calculatePercentages(numericWeek);

//     if (isNaN(numericWeek) || numericWeek <= 0 || numericWeek > 4) {
//         setError('Выберите корректное количество недель.');
//         return;
//       }

//     try {
//       const response = await fetch('/api/mining', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           userId: user.id,
//           week,
//           currency,
//           amount: numericAmount,
//           percentage
//         }),
//       });

//       if (response.ok) {
//         const updatedBalance = { ...user.balance };
//         updatedBalance[currency] -= numericAmount;

//         alert('Майнинг успешно активирован!');
//         const newSession: MiningSession = (await response.json()).data;
//         setMiningSessions((prevSessions) => [...prevSessions, newSession]);
//       } else {
//         const { error: responseError } = await response.json();
//         setError(responseError || 'Не получилось активировать майнинг.');
//       }
//     } catch (error) {
//       console.log(error)
//       setError('Ошибка сервера. Попробуйте позже.');
//     }
//   };

//   return (
//     <div className="">
//       <h2 className="text-xl font-bold mb-4">Активировать майнинг</h2>
//       {error && <p className="text-red-500">{error}</p>}
//       <form onSubmit={handleSubmit}>
//         {/* Вибір тижня */}
//         <label className="mb-2 block ">
//           <div>Выберите длительность:</div>
//           <select
//             value={week}
//             onChange={(e) => setWeek(e.target.value)}
//             className="w-full max-w-[300px] p-2 border rounded"
//           >
//             <option value="">Вибрать</option>
//             {[...Array(4)].map((_, index) => (
//               <option key={`week-${index}`} value={`${index + 1}`}>
//                 Неделя {index + 1}
//               </option>
//             ))}
//           </select>
//         </label>

//         {/* Вибір криптовалюти */}
//         <label className="block mb-2">
//            <div> Выберите криптовалюту:</div>
//           <select
//             value={currency}
//             onChange={(e) => setCurrency(e.target.value)}
//             className="w-full max-w-[300px] p-2 border rounded"
//           >
//             <option value="">Вибрать</option>
//             {user?.balance &&
//               Object.keys(user.balance).map((curr) => (
//                 <option key={`balance-${curr}`} value={curr}>
//                   {curr}
//                 </option>
//               ))}
//           </select>
//         </label>

//         {/* Введення кількості */}
//         <label className="block mb-2">
//         <div>Введите количество: </div>
//           <input
//             type="text" // Змінюємо тип на "text" для повного контролю
//             value={amount}
//             onChange={(e) => {
//               const value = e.target.value;
//               // Перевіряємо, чи значення - це число або порожній рядок
//               if (/^\d*\.?\d*$/.test(value)) {
//                 setAmount(value);
//               }
//             }}
//             className="w-full max-w-[300px] p-2 border rounded"
//             placeholder="Например, 0.01"
//           />
//         </label>

//         {/* Кнопка */}
//         <button
//           type="submit"
//           className="w-full max-w-[300px] text-white bg-[#4caf50] p-2 rounded hover:bg-blue-600"
//         >
//           Создать
//         </button>
//       </form>

//       {/* Виведення активних майнінгів */}
//       <div>
//   <h3 className="text-lg font-bold mt-6">Активные майнинговые сессии</h3>
//   {miningSessions.length > 0 ? (
//     <>
//       {/* Таблиця для великих екранів */}
//       <div className="hidden lg:block">
//         <table className="w-full border-collapse border border-gray-200 mt-4">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border px-4 py-2">Криптовалюта</th>
//               <th className="border px-4 py-2">Сумма</th>
//               <th className="border px-4 py-2">Дата создания</th>
//               <th className="border px-4 py-2">Дата завершения</th>
//               <th className="border px-4 py-2">Проценти</th>
//             </tr>
//           </thead>
//           <tbody>
//             {miningSessions.map((session, index) => (
//               <tr key={`table-row-${index}`} className="hover:bg-gray-50">
//                 <td className="border px-4 py-2">{session.currency}</td>
//                 <td className="border px-4 py-2">{session.amount}</td>
//                 <td className="border px-4 py-2">
//                   {new Date(session.startDate).toLocaleString()}
//                 </td>
//                 <td className="border px-4 py-2">
//                   {new Date(session.endDate).toLocaleString()}
//                 </td>
//                 <td className="border px-4 py-2">{session.percentage.join(', ')}%</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Список для мобільних пристроїв */}
//       <ul className="lg:hidden mt-4">
//         {miningSessions.map((session, index) => (
//           <li
//             key={`miningSessions-${index}`}
//             className="p-4 border rounded mb-2 shadow-sm hover:shadow-md"
//           >
//             <p>
//               <strong>Криптовалюта:</strong> {session.currency}
//             </p>
//             <p>
//               <strong>Сумма:</strong> {session.amount}
//             </p>
//             <p>
//               <strong>Дата создания:</strong> {new Date(session.startDate).toLocaleString()}
//             </p>
//             <p>
//               <strong>Дата завершения:</strong> {new Date(session.endDate).toLocaleString()}
//             </p>
//             <p>
//               <strong>Проценти:</strong> {session.percentage.join(', ')}%
//             </p>
//           </li>
//         ))}
//       </ul>
//     </>
//   ) : (
//     <p className="text-gray-500 mt-2">Нет активних сессий.</p>
//   )}
// </div>
//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect } from 'react';

// interface User {
//   id: string;
//   balance: Record<string, number>;
// }

// interface DemoMiningData {
//   weeks: number;
//   percentage: number;
// }

// interface MiningSession {
//   id: string;
//   currency: string;
//   amount: number;
//   startDate: string;
//   endDate: string;
//   percentage: number[];
// }

// interface MiningActivationProps {
//   user: User;
// }

// export default function MiningActivation({ user }: MiningActivationProps) {
//   const [miningSessions, setMiningSessions] = useState<MiningSession[]>([]);
//   const [error, setError] = useState<string>('');

//   const demoMiningData: DemoMiningData[] = [
//     { weeks: 1, percentage: 1 },
//     { weeks: 2, percentage: 1.1 },
//     { weeks: 3, percentage: 1.2 },
//     { weeks: 4, percentage: 1.3 },
//   ];

//   useEffect(() => {
//     const fetchMiningSessions = async () => {
//       if (!user?.id) return;
//       try {
//         const response = await fetch(`/api/mining?userId=${user?.id}`);
//         if (response.ok) {
//           const data: { sessions: MiningSession[] } = await response.json();
//           setMiningSessions(data.sessions);
//         } else {
//           console.error('Ошибка получения данных о майнинге.');
//         }
//       } catch (error) {
//         console.error('Ошибка сервера:', error);
//       }
//     };

//     fetchMiningSessions();
//   }, [user?.id]);

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Активировать майнинг</h2>

//       <div className="flex flex-wrap gap-6">
//         {demoMiningData.map((data, index) => (
//           <div
//             key={index}
//             className="w-[230px] bg-white p-6 border rounded-lg shadow-md hover:shadow-lg transform transition hover:-translate-y-1"
//           >
//             <h3 className="text-lg font-semibold text-gray-700">Неделя: {data.weeks}</h3>
//             <p className="text-gray-600 mt-2">Процент прибыли: {data.percentage}%</p>
//             <button className="mt-4 w-full px-4 py-2 bg-blue rounded-full text-white font-semibold hover:bg-blue-600">
//               Пополнить
//             </button>
//           </div>
//         ))}
//       </div>

//       <h3 className="text-xl font-bold mt-10 text-gray-800">Активные майнинговые сессии</h3>

//       {miningSessions.length > 0 ? (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
//           {miningSessions.map((session, index) => (
//             <div
//               key={index}
//               className="p-6 bg-white border rounded-lg shadow-md hover:shadow-lg"
//             >
//               <p>
//                 <strong className="text-gray-700">Криптовалюта:</strong> {session.currency}
//               </p>
//               <p>
//                 <strong className="text-gray-700">Сумма:</strong> {session.amount}
//               </p>
//               <p>
//                 <strong className="text-gray-700">Дата создания:</strong>{' '}
//                 {new Date(session.startDate).toLocaleString()}
//               </p>
//               <p>
//                 <strong className="text-gray-700">Дата завершения:</strong>{' '}
//                 {new Date(session.endDate).toLocaleString()}
//               </p>
//               <p>
//                 <strong className="text-gray-700">Проценти:</strong>{' '}
//                 {session.percentage.join(', ')}%
//               </p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-500 mt-4">Нет активных сессий.</p>
//       )}
//     </div>
//   );
// }



'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  balance: Record<string, number>;
}

interface DemoMiningData {
  weeks: number;
  percentage: number;
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
  const [miningSessions, setMiningSessions] = useState<MiningSession[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [week, setWeek] = useState('');
  const [currency, setCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string>('');
  const demoMiningData: DemoMiningData[] = [
    { weeks: 1, percentage: 1 },
    { weeks: 2, percentage: 1.1 },
    { weeks: 3, percentage: 1.2 },
    { weeks: 4, percentage: 1.3 },
  ];

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

    fetchMiningSessions();
  }, [user?.id]);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log(`Создан майнинг: Неделя ${week}, Валюта ${currency}, Сумма ${amount}`);
  //   setIsModalOpen(false); // Закрити попап після відправки форми
  // };

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
    const percentage = 1;

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

        setIsModalOpen(false);
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Активировать майнинг</h2>

      <div className="flex flex-wrap gap-6">
        {demoMiningData.map((data, index) => (
          <div
            key={index}
            className="w-[230px] bg-white p-6 border rounded-lg shadow-md hover:shadow-lg transform transition hover:-translate-y-1"
          >
            <h3 className="text-lg font-semibold text-gray-700">Неделя: {data.weeks}</h3>
            <p className="text-gray-600 mt-2">Процент прибыли: {data.percentage}%</p>
            <button
              className="mt-4 w-full px-4 py-2 bg-blue rounded-full text-white font-semibold hover:bg-blue-600"
              onClick={() => setIsModalOpen(true)}
            >
              Пополнить
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Создать майнинг</h3>
            <form onSubmit={handleSubmit}>
              <label className="mb-2 block">
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

              <label className="block mb-2">
                <div>Выберите криптовалюту:</div>
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
                <div>Введите количество:</div>
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

              <div>{error}</div>

              <button
                type="submit"
                className="w-full text-white bg-[#4caf50] p-2 rounded hover:bg-green-600"
              >
                Создать
              </button>

              <button
                type="button"
                className="w-full mt-2 text-white bg-red-500 p-2 rounded hover:bg-red-600"
                onClick={() => setIsModalOpen(false)}
              >
                Отмена
              </button>
            </form>
          </div>
        </div>
      )}
    <h3 className="text-xl font-bold mt-10 text-gray-800">Активные майнинговые сессии</h3>

{miningSessions.length > 0 ? (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
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
          {session.percentage.join(', ')}%
        </p>
      </div>
    ))}
  </div>
) : (
  <p className="text-gray-500 mt-4">Нет активных сессий.</p>
)}
    </div>
  );
}
