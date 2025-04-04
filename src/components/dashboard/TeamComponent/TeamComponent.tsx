import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import LastRegistrations from '../LastRegistrations/LastRegistrations';
import { useLanguageStore } from '@/store/useLanguageStore';

interface Deposit {
  currency: string;
  amount: number;
  isCompleted: boolean
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

interface TeamComponentProps {
  userId: string;
}

const TeamComponent: React.FC<TeamComponentProps> = ({ userId }) => {
  const { language } = useLanguageStore();
  const [team, setTeam] = useState<FlattenedUserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLine, setSelectedLine] = useState<number | null>(1);

  const translations = {
    loading: {
      ru: "Загрузка...",
      en: "Loading...",
    },
    activePartners: {
      ru: "Активных партнёров",
      en: "Active Partners",
    },
    personalPartners: {
      ru: "Личные партнёры",
      en: "Personal Partners",
    },
    total: {
      ru: "Всего",
      en: "Total",
    },
    line: {
      ru: "Линия",
      en: "Line",
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
        {members.map((member, index) => {
          const pendingDepositsTotal = member.deposits
          .filter(deposit => !deposit.isCompleted) // Фільтруємо незавершені депозити
          .reduce((sum, deposit) => sum + deposit.amount, 0); // Підсумовуємо amount
        
        return(
          <div
            key={index}
            className="flex flex-wrap justify-around border border-white py-[7px] rounded-[5px] text-[14px] w-[230px] ml-auto mr-auto"
          >
            <div className="font-bold text-white">{member.email || '-'}</div>
            <div className="font-bold text-white">${pendingDepositsTotal}</div>
          </div>
        )})}
      </div>
    );
  };

  const activePartnersCount = useMemo(() => {
    return team.reduce((count, member) => {
      return count + (member.deposits.length > 0 ? 1 : 0);
    }, 0);
  }, [team]);

  const personalPartnersCount = useMemo(() => {
    return team.filter(member => member.line === 1).length;
  }, [team]);
  
  console.log(team)

  return (
    <div className="">
      {loading ? (
        <p>{translations.loading[language]}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-[12px] sm:justify-center justify-start">
              <Image
                src="/dashboard/teams/file-person.svg"
                alt="Active Partners Icon"
                width={45}
                height={45}
                objectFit="cover"
                priority={false}
              />
              <div>
                <div className="text-[#00163A] text-[20px] font-bold">{translations.activePartners[language]}</div>
                <div className="text-[24px] font-bold text-[#3581FF]">{activePartnersCount}</div>
              </div>
            </div>
            <div className="flex items-center gap-[12px] sm:justify-center justify-start">
              <Image
                src="/dashboard/teams/file-person-fill.svg"
                alt="Personal Partners Icon"
                width={45}
                height={45}
                objectFit="cover"
                priority={false}
              />
              <div>
                <div className="text-[#00163A] text-[20px] font-bold">{translations.personalPartners[language]}</div>
                <div className="text-[24px] font-bold text-[#3581FF]">{personalPartnersCount}</div>
              </div>
            </div>
            <div className="flex items-center gap-[12px] sm:justify-center justify-start">
              <Image
                src="/dashboard/teams/people-fill.svg"
                alt="Total Icon"
                width={45}
                height={45}
                objectFit="cover"
                priority={false}
              />
              <div>
                <div className="text-[#00163A] text-[20px] font-bold">{translations.total[language]}</div>
                <div className="text-[24px] font-bold text-[#3581FF]">{team.length}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap fap-[20px] sm:gap-[30px]">
            <div className="flex flex-col gap-[20px] sm:gap-[30px] w-full sm:w-[190px] mb-[45px]">
              {[...new Set(team.map(user => user.line))].map(line => (
                <div key={line}>
                  <button
                    onClick={() => setSelectedLine(line)}
                    className={`text-[16px] font-bold w-full sm:w-[190px] h-[41px] py-2 px-4 rounded-full ${
                      selectedLine === line ? "bg-[#3581FF] text-white" : "bg-[#aac8fa] text-[#00163A]"
                    }`}
                  >
                    {translations.line[language]} {line}
                  </button>
                  {selectedLine === line && (
                    <div className="bg-[#3581FF] rounded-[25px] w-full sm:w-[270px] pb-[21px] sm:hidden">
                      <h4 className="text-[16px] font-bold mb-[10px] text-white text-center mt-[15px]">
                        {translations.line[language]} {selectedLine}
                      </h4>
                      {renderLineInfo(selectedLine)}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {selectedLine !== null && team.length > 0 && (
              <div className="bg-[#3581FF] rounded-[25px] w-[270px] pb-[21px] hidden sm:block">
                <h4 className="text-[16px] font-bold mb-[10px] text-white text-center mt-[15px]">
                  {translations.line[language]} {selectedLine}
                </h4>
                {renderLineInfo(selectedLine)}
              </div>
            )}
            {team.length > 0 && <LastRegistrations userId={userId || ""} />}
          </div>
        </>
      )}
    </div>
  );
};

export default TeamComponent;