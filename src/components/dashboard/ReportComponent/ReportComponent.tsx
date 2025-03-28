import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLanguageStore } from '@/store/useLanguageStore';

interface Deposit {
  currency: string;
  amount: number;
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

interface MiningSession {
  id: string;
  currency: string;
  amount: number;
  startDate: string;
  endDate: string;
  percentage: number[];
  fullAmount: number;
}

const ReportComponent: React.FC<TeamComponentProps> = ({ userId }) => {
  const { language } = useLanguageStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [miningSessions, setMiningSessions] = useState<MiningSession[]>([]);
  const [stakingSessions, setStakingSessions] = useState<MiningSession[]>([]);
  const [listingSessions, setListingSessions] = useState<MiningSession[]>([]);
  const [activeTab, setActiveTab] = useState<string>('mining');

  const translations = {
    loading: {
      ru: "Загрузка...",
      en: "Loading...",
    },
    mining: {
      ru: "Майнинг",
      en: "Mining",
    },
    staking: {
      ru: "Стейкинг",
      en: "Staking",
    },
    listing: {
      ru: "Листинг",
      en: "Listing",
    },
    invested: {
      ru: "Вложено:",
      en: "Invested:",
    },
    opened: {
      ru: "Открыт:",
      en: "Opened:",
    },
    closes: {
      ru: "Закрывается:",
      en: "Closes:",
    },
    earned: {
      ru: "Заработано:",
      en: "Earned:",
    },
    contract: {
      ru: "Контракт",
      en: "Contract",
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        const [miningRes, stakingRes, listingRes] = await Promise.all([
          fetch(`/api/mining?userId=${userId}`),
          fetch(`/api/staking?userId=${userId}`),
          fetch(`/api/listing?userId=${userId}`),
        ]);

        if (miningRes.ok) {
          const miningData: { sessions: MiningSession[] } = await miningRes.json();
          setMiningSessions(miningData.sessions);
        }

        if (stakingRes.ok) {
          const stakingData: { sessions: MiningSession[] } = await stakingRes.json();
          setStakingSessions(stakingData.sessions.filter((session) => session.currency === 'CC'));
        }

        if (listingRes.ok) {
          const listingData: { sessions: MiningSession[] } = await listingRes.json();
          setListingSessions(listingData.sessions.filter((session) => session.currency === 'USDT'));
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="">
      {loading ? (
        <p>{translations.loading[language]}</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-[15px] sm:mr-[-15px] sm:ml-[-15px] sm:justify-start justify-center">
            <div className="mb-[15px]">
              <div
                onClick={() => setActiveTab('mining')}
                className={`flex items-center gap-[12px] justify-center w-[257px] h-[65px] ${
                  activeTab === 'mining'
                    ? 'bg-[#3581FF] sm:bg-white text-white sm:text-[#00163A] rounded-[15px]'
                    : 'text-[#00163A]'
                }`}
              >
                <div className="text-[24px] font-bold uppercase">{translations.mining[language]}</div>
                <Image
                  src={`${activeTab === 'mining' && window.innerWidth <= 640 ? "/dashboard/report/node-3-connections-white.svg" : "/dashboard/report/node-3-connections.svg"}`}
                  alt="Mining Icon"
                  width={45}
                  height={45}
                  objectFit="cover"
                  priority={false}
                />
              </div>
              <div className="flex-col gap-[15px] hidden sm:flex">
                {miningSessions.map((session, index) => (
                  <div
                    key={index}
                    className="flex gap-[18px] px-[20px] py-[10px] border border-[#00163A] rounded-[15px] w-[264px]"
                  >
                    <div className="text-[20px] font-bold">#{index + 1}</div>
                    <div className="min-w-[160px]">
                      <div className="flex justify-between text-[14px] font-bold mb-[5px]">
                        <div>{translations.invested[language]}</div>
                        <div>${session.amount}</div>
                      </div>
                      <div className="flex justify-between text-[14px] font-semibold">
                        <div>{translations.opened[language]}</div>
                        <div>{new Date(session.startDate).toISOString().slice(0, 10)}</div>
                      </div>
                      <div className="flex justify-between text-[14px] font-semibold mb-[5px]">
                        <div>{translations.closes[language]}</div>
                        <div>{new Date(session.endDate).toISOString().slice(0, 10)}</div>
                      </div>
                      <div className="flex justify-between text-[14px] font-bold text-[#3581FF]">
                        <div>{translations.earned[language]}</div>
                        <div>{session?.fullAmount.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-[15px]">
              <div
                onClick={() => setActiveTab('staking')}
                className={`flex items-center gap-[12px] justify-center mb-[15px] w-[254px] h-[65px] ${
                  activeTab === 'staking'
                    ? 'bg-[#3581FF] sm:bg-white text-white sm:text-[#00163A] rounded-[15px]'
                    : 'text-[#00163A]'
                }`}
              >
                <div className="text-[24px] font-bold uppercase">{translations.staking[language]}</div>
                <Image
                  src={`${activeTab === 'staking' && window.innerWidth <= 640 ? "/dashboard/report/invoice-white.svg" : "/dashboard/report/invoice.svg"}`}
                  alt="Staking Icon"
                  width={45}
                  height={47}
                  objectFit="cover"
                  priority={false}
                />
              </div>
              <div className="flex-col gap-[15px] hidden sm:flex">
                {stakingSessions.map((session, index) => (
                  <div
                    key={index}
                    className="flex justify-center gap-[18px] px-[20px] py-[10px] bg-[#3581FF] rounded-[15px] w-[254px]"
                  >
                    <div className="min-w-[205px]">
                      <div className="flex justify-between text-[16px] font-bold mb-[5px]">
                        <div>{translations.contract[language]} {index + 1}</div>
                        <div>CC {session?.amount.toFixed(2)}</div>
                      </div>
                      <div className="flex justify-between text-[14px] font-semibold">
                        <div>{translations.opened[language]}</div>
                        <div>{new Date(session.startDate).toISOString().slice(0, 10)}</div>
                      </div>
                      <div className="flex justify-between text-[14px] font-semibold mb-[5px]">
                        {/* <div>{translations.closes[language]}</div>
                        <div>{new Date(session.endDate).toLocaleDateString()}</div> */}
                      </div>
                      <div className="flex justify-between text-[14px] font-bold text-white">
                        <div>{translations.earned[language]}</div>
                        <div>{session?.fullAmount.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-[15px]">
              <div
                onClick={() => setActiveTab('listing')}
                className={`flex items-center gap-[12px] justify-center w-[257px] h-[65px] ${
                  activeTab === 'listing'
                    ? 'bg-[#3581FF] sm:bg-white text-white sm:text-[#00163A] rounded-[15px]'
                    : 'text-[#00163A]'
                }`}
              >
                <div className="text-[24px] font-bold uppercase">{translations.listing[language]}</div>
                <Image
                  src={`${activeTab === 'listing' && window.innerWidth <= 640 ? "/dashboard/report/mnemonic-white.svg" : "/dashboard/report/mnemonic.svg"}`}
                  alt="Listing Icon"
                  width={45}
                  height={45}
                  objectFit="cover"
                  priority={false}
                />
              </div>
              <div className="flex-col gap-[15px] hidden sm:flex">
                {listingSessions.map((session, index) => (
                  <div
                    key={index}
                    className="flex justify-center gap-[18px] px-[20px] py-[10px] bg-[#00163A] rounded-[15px] w-[257px]"
                  >
                    <div className="min-w-[205px]">
                      <div className="flex justify-between text-[16px] font-bold mb-[5px] text-white">
                        <div>{translations.contract[language]} {index + 1}</div>
                        <div>${session.amount}</div>
                      </div>
                      <div className="flex justify-between text-[14px] font-semibold text-white">
                        <div>{translations.opened[language]}</div>
                        <div>{new Date(session.startDate).toISOString().slice(0, 10)}</div>
                      </div>
                      <div className="flex justify-between text-[14px] font-semibold mb-[5px] text-white">
                        <div>{translations.closes[language]}</div>
                        <div>{new Date(session.endDate).toISOString().slice(0, 10)}</div>
                      </div>
                      <div className="flex justify-between text-[14px] font-bold text-[#3581FF]">
                        <div>{translations.earned[language]}</div>
                        <div>{session?.fullAmount.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap fap-[20px] sm:gap-[30px] sm:justify-start justify-center">
            <div>
              {activeTab === 'mining' && (
                <div className="flex flex-col gap-[15px] sm:hidden">
                  {miningSessions.map((session, index) => (
                    <div
                      key={index}
                      className="flex gap-[18px] px-[20px] py-[10px] border border-[#00163A] rounded-[15px] w-[264px]"
                    >
                      <div className="text-[20px] font-bold">#{index + 1}</div>
                      <div className="min-w-[160px]">
                        <div className="flex justify-between text-[14px] font-bold mb-[5px]">
                          <div>{translations.invested[language]}</div>
                          <div>${session.amount}</div>
                        </div>
                        <div className="flex justify-between text-[14px] font-semibold">
                          <div>{translations.opened[language]}</div>
                          <div>{new Date(session.startDate).toISOString().slice(0, 10)}</div>
                        </div>
                        <div className="flex justify-between text-[14px] font-semibold mb-[5px]">
                          <div>{translations.closes[language]}</div>
                          <div>{new Date(session.endDate).toISOString().slice(0, 10)}</div>
                        </div>
                        <div className="flex justify-between text-[14px] font-bold text-[#3581FF]">
                          <div>{translations.earned[language]}</div>
                          <div>{session?.fullAmount.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'staking' && (
                <div className="flex flex-col gap-[15px] sm:hidden">
                  {stakingSessions.map((session, index) => (
                    <div
                      key={index}
                      className="flex justify-center gap-[18px] px-[20px] py-[10px] bg-[#3581FF] rounded-[15px] w-[254px]"
                    >
                      <div className="min-w-[205px]">
                        <div className="flex justify-between text-[16px] font-bold mb-[5px]">
                          <div>{translations.contract[language]} {index + 1}</div>
                          <div>CC {session.amount}</div>
                        </div>
                        <div className="flex justify-between text-[14px] font-semibold">
                          <div>{translations.opened[language]}</div>
                          <div>{new Date(session.startDate).toISOString().slice(0, 10)}</div>
                        </div>
                        <div className="flex justify-between text-[14px] font-semibold mb-[5px]">
                          <div>{translations.closes[language]}</div>
                          <div>-</div>
                        </div>
                        <div className="flex justify-between text-[14px] font-bold text-white">
                          <div>{translations.earned[language]}</div>
                          <div>{session?.fullAmount.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'listing' && (
                <div className="flex flex-col gap-[15px] sm:hidden">
                  {listingSessions.map((session, index) => (
                    <div
                      key={index}
                      className="flex justify-center gap-[18px] px-[20px] py-[10px] bg-[#00163A] rounded-[15px] w-[257px]"
                    >
                      <div className="min-w-[205px]">
                        <div className="flex justify-between text-[16px] font-bold mb-[5px] text-white">
                          <div>{translations.contract[language]} {index + 1}</div>
                          <div>${session.amount}</div>
                        </div>
                        <div className="flex justify-between text-[14px] font-semibold text-white">
                          <div>{translations.opened[language]}</div>
                          <div>{new Date(session.startDate).toISOString().slice(0, 10)}</div>
                        </div>
                        <div className="flex justify-between text-[14px] font-semibold mb-[5px] text-white">
                          <div>{translations.closes[language]}</div>
                          <div>{new Date(session.endDate).toISOString().slice(0, 10)}</div>
                        </div>
                        <div className="flex justify-between text-[14px] font-bold text-[#3581FF]">
                          <div>{translations.earned[language]}</div>
                          <div>{session?.fullAmount.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportComponent;