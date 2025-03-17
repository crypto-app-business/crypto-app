import React, { useEffect, useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';

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

export interface FlattenedUserData {
  email: string;
  username: string;
  referrer: string;
  registrationDate: string;
  deposits: Deposit[];
  line: number;
  firstName?: string;
}

interface Operation {
  description: string;
  amount: number;
  currency: string;
  createdAt: string;
}

interface TeamComponentProps {
  userId: string;
}

const OperationsComponent: React.FC<TeamComponentProps> = ({ userId }) => {
  const { language } = useLanguageStore();
  const [team, setTeam] = useState<FlattenedUserData[]>([]);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  console.log(team)
  const translations = {
    loading: {
      ru: "Загрузка...",
      en: "Loading...",
    },
    dateTime: {
      ru: "дата/время",
      en: "Date/Time",
    },
    operations: {
      ru: "операции",
      en: "Operations",
    },
    amount: {
      ru: "сумма",
      en: "Amount",
    },
  };

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
        if (!response.ok) throw new Error(`API error: ${response.status} ${response.statusText}`);
        const data: RawUserData[] = await response.json();
        const flattenedData = flattenTree(data);
        setTeam(flattenedData);
      } catch (error) {
        console.error('Error fetching team data:', error);
        setTeam([]);
      }
    };

    const fetchOperations = async () => {
      try {
        const response = await fetch(`/api/operations`);
        if (!response.ok) throw new Error(`API error: ${response.status} ${response.statusText}`);
        const data = await response.json();
        if (data.success && Array.isArray(data.operations)) {
          const sortedOperations = data.operations.sort((a: Operation, b: Operation) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
          setOperations(sortedOperations);
        } else {
          setOperations([]);
        }
      } catch (error) {
        console.error('Error fetching operations:', error);
        setOperations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
    fetchOperations();
  }, [userId]);

  return (
    <div className="mx-[30px] sm:mx-0">
      {operations.length !== 0 && (
        <div className="flex justify-between mx-0 sm:mx-[35px] mb-[20px]">
          <div className="text-[#00163A] sm:text-[20px] text-[14px] font-bold uppercase">
            {translations.dateTime[language]}
          </div>
          <div className="text-[#00163A] sm:text-[20px] text-[14px] font-bold uppercase">
            {translations.operations[language]}
          </div>
          <div className="text-[#00163A] sm:text-[20px] text-[14px] font-bold uppercase">
            {translations.amount[language]}
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center">{translations.loading[language]}</div>
      ) : operations.length === 0 ? (
        <div className="text-center"></div>
      ) : (
        operations.map((operation, index) => (
          <div
            key={index}
            className="flex gap-[15px] justify-between px-[15px] sm:px-[35px] py-[10px] border border-[#00163A] rounded-[15px] text-[14px] text-[#00163A] w-full mb-2"
          >
            <div>{new Date(operation.createdAt).toUTCString()}</div>
            <div className="font-bold">{operation.description}</div>
            <div className="font-bold text-[#3581FF]">
              {operation.amount.toFixed(2)} {operation.currency}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OperationsComponent;