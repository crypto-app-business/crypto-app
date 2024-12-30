import React, { useEffect, useState } from 'react';

interface Deposit {
  currency: string;
  amount: number;
}

interface RawUserData {
  email: string;
  username: string;
  referrer: string;
  registrationDate: string;
  deposits: Deposit[];
  line: number;
  subTree: RawUserData[];
}

interface FlattenedUserData {
  email: string;
  username: string;
  referrer: string;
  registrationDate: string;
  deposits: Deposit[];
  line: number;
}

interface TeamComponentProps {
  userId: string;
}

const TeamComponent: React.FC<TeamComponentProps> = ({ userId }) => {
  const [team, setTeam] = useState<FlattenedUserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);

  const flattenTree = (data: RawUserData[], currentLine = 1): FlattenedUserData[] => {
    return data.reduce<FlattenedUserData[]>((acc, user) => {
      const { subTree, ...userData } = user;
      const flattenedUser = { ...userData, line: currentLine };
      return [...acc, flattenedUser, ...flattenTree(subTree, currentLine + 1)];
    }, []);
  };

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch(`/api/getTeam?userId=${userId}`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        const data: RawUserData[] = await response.json();
        const flattenedData = flattenTree(data);
        setTeam(flattenedData);
      } catch (error) {
        console.error('Error fetching team data:', error);
        setTeam([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [userId]);

  const renderLineInfo = (line: number) => {
    const members = team.filter(member => member.line === line);
    return (
      <div className="flex flex-wrap gap-4">
        {members.map((member, index) => (
          <div
            key={index}
            className="p-4 bg-gray-800 rounded shadow-md w-full max-w-sm"
          >
            <p><strong>Юзернейм:</strong> {member.username}</p>
            <p><strong>Емейл:</strong> {member.email}</p>
            <p><strong>Пригласил:</strong> {member.referrer}</p>
            <p><strong>Дата Регистрации:</strong> {new Date(member.registrationDate).toLocaleString('uk-UA')}</p>
            <p>
              <strong>Депозит:</strong>{' '}
              {member.deposits.map(d => `${d.currency}: ${d.amount}`).join(', ') || 'Нет'}
            </p>
            <p><strong>Линия:</strong> {member.line}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-4">Команда</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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
                 {team.length}
              </div>
              <div className="text-gray-300">Всего</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            {[...new Set(team.map(user => user.line))].map(line => (
              <button
                key={line}
                onClick={() => setSelectedLine(line)}
                className="bg-purple-700 hover:bg-purple bg-[#7001a6] text-white min-w-[200px] py-2 px-4 rounded-lg text-sm font-medium shadow"
>
                Линия {line}
              </button>
            ))}
          </div>

          {selectedLine !== null && (
            <div className="mt-6">
              <h4 className="text-xl font-bold mb-4">Партнёры линии {selectedLine}</h4>
              {renderLineInfo(selectedLine)}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TeamComponent;
