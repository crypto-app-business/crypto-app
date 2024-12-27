// // // import React from 'react';

// // // const TeamComponent = () => {
// // //   const data = {
// // //     activePartners: 0,
// // //     personalPartners: 8,
// // //     totalPartners: 38,
// // //     lines: Array.from({ length: 10 }, (_, i) => `Линия ${i + 1}`),
// // //   };

// // //   return (
// // //     <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-md ">
// // //       <h3 className="text-2xl font-bold mb-4">Команда</h3>
// // //       <div className="grid grid-cols-3 gap-4 mb-6">
// // //         <div className="flex flex-col items-center">
// // //           <div className="text-xl font-semibold">{data.activePartners}</div>
// // //           <div className="text-gray-300">Активных партнёров</div>
// // //         </div>
// // //         <div className="flex flex-col items-center">
// // //           <div className="text-xl font-semibold">{data.personalPartners}</div>
// // //           <div className="text-gray-300">Личные партнёры</div>
// // //         </div>
// // //         <div className="flex flex-col items-center">
// // //           <div className="text-xl font-semibold">{data.totalPartners}</div>
// // //           <div className="text-gray-300">Всего</div>
// // //         </div>
// // //       </div>
// // //       <div className="flex flex-wrap gap-[20px]">
// // //         {data.lines.map((line, index) => (
// // //           <button
// // //             key={index}
// // //             className="bg-purple-700 hover:bg-purple bg-[#7001a6] text-white min-w-[200px] py-2 px-4 rounded-lg text-sm font-medium shadow"
// // //           >
// // //             {line}
// // //           </button>
// // //         ))}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default TeamComponent;

// // import React, { useEffect, useState } from 'react';

// // const TeamComponent = ({ userId }) => {
// //   const [team, setTeam] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchTeam = async () => {
// //       try {
// //         const response = await fetch(`/api/getTeam?userId=${userId}`);
// //         if (!response.ok) {
// //           throw new Error(`API error: ${response.status} ${response.statusText}`);
// //         }
// //         const data = await response.json();
// //         setTeam(data);
// //       } catch (error) {
// //         console.error('Error fetching team data:', error);
// //         setTeam([]); // Очищаємо список, якщо є помилка
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchTeam();
// //   }, [userId]);

// //   const renderTeam = (team, depth = 1) => (
// //     <ul className="pl-4">
// //       {team.map((member, index) => (
// //         <li key={index} className="mb-4">
// //           <div className="p-2 bg-gray-800 rounded shadow">
// //             <p><strong>Email:</strong> {member.email}</p>
// //             <p><strong>Referrer:</strong> {member.referrer}</p>
// //             <p><strong>Registration Date:</strong> {new Date(member.registrationDate).toLocaleDateString()}</p>
// //             <p><strong>Deposits:</strong> {member.deposits.map(d => `${d.currency}: ${d.amount}`).join(', ') || 'None'}</p>
// //             <p><strong>Line:</strong> {depth}</p>
// //           </div>
// //           {member.subTree && member.subTree.length > 0 && renderTeam(member.subTree, depth + 1)}
// //         </li>
// //       ))}
// //     </ul>
// //   );

// //   return (
// //     <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-md">
// //       <h3 className="text-2xl font-bold mb-4">Команда</h3>
// //       {loading ? (
// //         <p>Loading...</p>
// //       ) : (
// //         renderTeam(team)
// //       )}
// //     </div>
// //   );
// // };

// // export default TeamComponent;

// import React, { useEffect, useState } from 'react';

// const TeamComponent = ({ userId }) => {
//   const [team, setTeam] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedLine, setSelectedLine] = useState(null);


//   // const mockData = [
//   //   {
//   //     email: 'user1@example.com',
//   //     referrer: 'referrer1',
//   //     registrationDate: '2023-01-15',
//   //     deposits: [{ currency: 'USD', amount: 500 }],
//   //     subTree: [
//   //       {
//   //         email: 'user1_1@example.com',
//   //         referrer: 'user1@example.com',
//   //         registrationDate: '2023-02-01',
//   //         deposits: [{ currency: 'USD', amount: 300 }],
//   //         subTree: [],
//   //       },
//   //       {
//   //         email: 'user1_2@example.com',
//   //         referrer: 'user1@example.com',
//   //         registrationDate: '2023-02-10',
//   //         deposits: [],
//   //         subTree: [],
//   //       },
//   //     ],
//   //   },
//   //   {
//   //     email: 'user2@example.com',
//   //     referrer: 'referrer2',
//   //     registrationDate: '2023-01-20',
//   //     deposits: [],
//   //     subTree: [
//   //       {
//   //         email: 'user2_1@example.com',
//   //         referrer: 'user2@example.com',
//   //         registrationDate: '2023-02-05',
//   //         deposits: [{ currency: 'EUR', amount: 200 }],
//   //         subTree: [],
//   //       },
//   //     ],
//   //   },
//   // ];
  

//   useEffect(() => {
//     const fetchTeam = async () => {
//       try {
//         const response = await fetch(`/api/getTeam?userId=${userId}`);
//         if (!response.ok) {
//           throw new Error(`API error: ${response.status} ${response.statusText}`);
//         }
//         const data = await response.json();
//         setTeam(data);
//         // setTeam(mockData);
//       } catch (error) {
//         console.error('Error fetching team data:', error);
//         setTeam([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTeam();
//   }, [userId]);

//   const renderLineInfo = (members, depth) => (
//     <div className="flex flex-wrap gap-4">
//       {members.map((member, index) => (
//         <div
//           key={index}
//           className="p-4 bg-gray-800 rounded shadow-md w-full max-w-sm"
//         >
//           <p><strong>Емейл:</strong> {member.email}</p>
//           <p><strong>Пригласил:</strong> {member.referrer}</p>
//           <p><strong>Дата Регистрации:</strong> {new Date(member.registrationDate).toLocaleDateString()}</p>
//           <p>
//             <strong>Депозит:</strong>{' '}
//             {member.deposits.map(d => `${d.currency}: ${d.amount}`).join(', ') || 'None'}
//           </p>
//           <p><strong>Линия:</strong> {depth}</p>
//         </div>
//       ))}
//     </div>
//   );

//   return (
//     <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-md">
//       <h3 className="text-2xl font-bold mb-4">Команда</h3>
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <>
//           <div className="grid grid-cols-3 gap-4 mb-6">
//             <div className="flex flex-col items-center">
//               <div className="text-xl font-semibold">{team.length}</div>
//               <div className="text-gray-300">Активных партнёров</div>
//             </div>
//             <div className="flex flex-col items-center">
//               <div className="text-xl font-semibold">
//                 {team.filter(member => member.referrer === userId).length}
//               </div>
//               <div className="text-gray-300">Личные партнёры</div>
//             </div>
//             <div className="flex flex-col items-center">
//               <div className="text-xl font-semibold">{team.reduce((sum, member) => sum + (member.subTree ? member.subTree.length : 0), team.length)}</div>
//               <div className="text-gray-300">Всего</div>
//             </div>
//           </div>
//           <div className="flex flex-wrap gap-[20px]">
//             {team.map((member, index) => (
//               <button
//                 key={index}
//                 onClick={() => setSelectedLine(index)}
//                 className="bg-purple-700 hover:bg-purple bg-[#7001a6] text-white min-w-[200px] py-2 px-4 rounded-lg text-sm font-medium shadow"
//               >
//                 Линия {index + 1}
//               </button>
//             ))}
//           </div>
//           {selectedLine !== null && (
//             <div className="mt-6">
//               <h4 className="text-xl font-bold mb-4">Партнёры Линии {selectedLine + 1}</h4>
//               {team[selectedLine]?.subTree
//                 ? renderLineInfo(team[selectedLine].subTree, selectedLine + 1)
//                 : <p>Нет данных для этой линии.</p>}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default TeamComponent;


import React, { useEffect, useState } from 'react';

interface Deposit {
  currency: string;
  amount: number;
}

interface TeamMember {
  email: string;
  referrer: string;
  registrationDate: string;
  deposits: Deposit[];
  subTree: TeamMember[];
}

interface TeamComponentProps {
  userId: string;
}

const TeamComponent: React.FC<TeamComponentProps> = ({ userId }) => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch(`/api/getTeam?userId=${userId}`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        const data: TeamMember[] = await response.json();
        setTeam(data);
      } catch (error) {
        console.error('Error fetching team data:', error);
        setTeam([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [userId]);

  const renderLineInfo = (members: TeamMember[], depth: number) => (
    <div className="flex flex-wrap gap-4">
      {members.map((member, index) => (
        <div
          key={index}
          className="p-4 bg-gray-800 rounded shadow-md w-full max-w-sm"
        >
          <p><strong>Емейл:</strong> {member.email}</p>
          <p><strong>Пригласил:</strong> {member.referrer}</p>
          <p><strong>Дата Регистрации:</strong> {new Date(member.registrationDate).toLocaleDateString()}</p>
          <p>
            <strong>Депозит:</strong>{' '}
            {member.deposits.map(d => `${d.currency}: ${d.amount}`).join(', ') || 'None'}
          </p>
          <p><strong>Линия:</strong> {depth}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-4">Команда</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col items-center">
              <div className="text-xl font-semibold">{team.length}</div>
              <div className="text-gray-300">Активных партнёров</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-xl font-semibold">
                {team.filter(member => member.referrer === userId).length}
              </div>
              <div className="text-gray-300">Личные партнёры</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-xl font-semibold">
                {team.reduce((sum, member) => sum + (member.subTree ? member.subTree.length : 0), team.length)}
              </div>
              <div className="text-gray-300">Всего</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-[20px]">
            {team.map((member, index) => (
              <button
                key={index}
                onClick={() => setSelectedLine(index)}
                className="bg-purple-700 hover:bg-purple bg-[#7001a6] text-white min-w-[200px] py-2 px-4 rounded-lg text-sm font-medium shadow"
              >
                Линия {index + 1}
              </button>
            ))}
          </div>
          {selectedLine !== null && (
            <div className="mt-6">
              <h4 className="text-xl font-bold mb-4">Партнёры Линии {selectedLine + 1}</h4>
              {team[selectedLine]?.subTree
                ? renderLineInfo(team[selectedLine].subTree, selectedLine + 1)
                : <p>Нет данных для этой линии.</p>}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TeamComponent;
