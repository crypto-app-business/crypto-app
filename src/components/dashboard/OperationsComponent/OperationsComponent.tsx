import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
// import LastRegistrations from '../LastRegistrations/LastRegistrations';

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
  const [team, setTeam] = useState<FlattenedUserData[]>([]);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // const [selectedLine, setSelectedLine] = useState<number | null>(1);

  const flattenTree = (data: RawUserData[], currentLine = 1): FlattenedUserData[] => {
    return data.reduce<FlattenedUserData[]>((acc, user) => {
      const { subTree, ...userData } = user;
      const flattenedUser = { ...userData, line: currentLine };
      return [...acc, flattenedUser, ...flattenTree(subTree, currentLine + 1)];
    }, []);
  };

  console.log(team)

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

    // const fetchOperations = async () => {
    //   try {
    //     const response = await fetch(`/api/operations`);
    //     if (!response.ok) throw new Error(`API error: ${response.status} ${response.statusText}`);
    //     const data: Operation[] = await response.json();
    //     setOperations(data);
    //   } catch (error) {
    //     console.error('Error fetching operations:', error);
    //     setOperations([]);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    const fetchOperations = async () => {
      try {
        const response = await fetch(`/api/operations`);
        if (!response.ok) throw new Error(`API error: ${response.status} ${response.statusText}`);
    
        const data = await response.json();
    
        // Витягаємо масив operations
        if (data.success && Array.isArray(data.operations)) {
          setOperations(data.operations);
        } else {
          setOperations([]); // Якщо operations немає
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

  // const activePartnersCount = useMemo(() => {
  //   return team.reduce((count, member) => count + (member.deposits.length > 0 ? 1 : 0), 0);
  // }, [team]);

  // const personalPartnersCount = useMemo(() => {
  //   return team.filter(member => member.line === 1).length;
  // }, [team, userId]);

  return (
    <div className='mx-[30px] sm:mx-0'>
      {operations.length !== 0 && <div className="flex justify-between mx-0 sm:mx-[35px] mb-[20px]">
        <div className="text-[#00163A] sm:text-[20px] text-[14px] font-bold uppercase">дата/время</div>
        <div className="text-[#00163A] sm:text-[20px] text-[14px] font-bold uppercase">операции</div>
        <div className="text-[#00163A] sm:text-[20px] text-[14px] font-bold uppercase">сумма</div>
      </div>}

      {loading ? (
        <div className="text-center">Загрузка...</div>
      ) : operations.length === 0 ? (
        <div className="text-center"></div>
      ) : (
        operations.map((operation, index) => (
          <div
            key={index}
            className="flex gap-[15px] justify-between px-[15px] sm:px-[35px] py-[10px] border border-[#00163A] rounded-[15px] text-[14px] text-[#00163A] w-full mb-2"
          >
            <div>{new Date(operation.createdAt).toLocaleString()}</div>
            <div className="font-bold">{operation.description}</div>
            <div className="font-bold text-[#3581FF]">
              {operation.amount} {operation.currency}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OperationsComponent;
