// import React from 'react';

// const TeamComponent = () => {
//   const data = {
//     activePartners: 0,
//     personalPartners: 8,
//     totalPartners: 38,
//     lines: Array.from({ length: 10 }, (_, i) => `Линия ${i + 1}`),
//   };

//   return (
//     <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-md ">
//       <h3 className="text-2xl font-bold mb-4">Команда</h3>
//       <div className="grid grid-cols-3 gap-4 mb-6">
//         <div className="flex flex-col items-center">
//           <div className="text-xl font-semibold">{data.activePartners}</div>
//           <div className="text-gray-300">Активных партнёров</div>
//         </div>
//         <div className="flex flex-col items-center">
//           <div className="text-xl font-semibold">{data.personalPartners}</div>
//           <div className="text-gray-300">Личные партнёры</div>
//         </div>
//         <div className="flex flex-col items-center">
//           <div className="text-xl font-semibold">{data.totalPartners}</div>
//           <div className="text-gray-300">Всего</div>
//         </div>
//       </div>
//       <div className="flex flex-wrap gap-[20px]">
//         {data.lines.map((line, index) => (
//           <button
//             key={index}
//             className="bg-purple-700 hover:bg-purple bg-[#7001a6] text-white min-w-[200px] py-2 px-4 rounded-lg text-sm font-medium shadow"
//           >
//             {line}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TeamComponent;

import React, { useEffect, useState } from 'react';

const TeamComponent = ({ userId }) => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch(`/api/getTeam?userId=${userId}`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setTeam(data);
      } catch (error) {
        console.error('Error fetching team data:', error);
        setTeam([]); // Очищаємо список, якщо є помилка
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [userId]);

  const renderTeam = (team, depth = 1) => (
    <ul className="pl-4">
      {team.map((member, index) => (
        <li key={index} className="mb-4">
          <div className="p-2 bg-gray-800 rounded shadow">
            <p><strong>Email:</strong> {member.email}</p>
            <p><strong>Referrer:</strong> {member.referrer}</p>
            <p><strong>Registration Date:</strong> {new Date(member.registrationDate).toLocaleDateString()}</p>
            <p><strong>Deposits:</strong> {member.deposits.map(d => `${d.currency}: ${d.amount}`).join(', ') || 'None'}</p>
            <p><strong>Line:</strong> {depth}</p>
          </div>
          {member.subTree && member.subTree.length > 0 && renderTeam(member.subTree, depth + 1)}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-4">Команда</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        renderTeam(team)
      )}
    </div>
  );
};

export default TeamComponent;