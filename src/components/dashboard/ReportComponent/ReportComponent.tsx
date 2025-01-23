import React, { useEffect, useState } from 'react';
import Image from 'next/image';

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
  firstName?: string
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
  const [loading, setLoading] = useState<boolean>(true);
  const [miningSessions, setMiningSessions] = useState<MiningSession[]>([]);
  const [stakingSessions, setStakingSessions] = useState<MiningSession[]>([]);
  const [listingSessions, setListingSessions] = useState<MiningSession[]>([]);

  useEffect(() => {
    const fetchMiningSessions = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`/api/mining?userId=${userId}`);
        if (response.ok) {
          const data: { sessions: MiningSession[] } = await response.json();
          setMiningSessions(data.sessions);
          setLoading(false)
        } else {
          console.error('Ошибка получения данных о майнинге.');
        }
      } catch (error) {
        console.error('Ошибка сервера:', error);
      }
    };
    const fetchStakingSessions = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`/api/staking?userId=${userId}`);
        if (response.ok) {
          const data: { sessions: MiningSession[] } = await response.json();
          console.log('Отримані сесії:', data.sessions);
          const filteredSessions = data.sessions.filter(session => session.currency === 'USDT');
          setStakingSessions(filteredSessions);
        } else {
          console.error('Ошибка получения даних про стейкинге.');
        }
      } catch (error) {
        console.error('Ошибка сервера:', error);
      }
    };
    const fetchListingSessions = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`/api/listing?userId=${userId}`);
        if (response.ok) {
          const data: { sessions: MiningSession[] } = await response.json();
          console.log('Отримані сесії:', data.sessions);
          const filteredSessions = data.sessions.filter(session => session.currency === 'USDT');
          setListingSessions(filteredSessions);
        } else {
          console.error('Ошибка получения даних про стейкинге.');
        }
      } catch (error) {
        console.error('Ошибка сервера:', error);
      }
    };

    fetchMiningSessions();
    fetchStakingSessions();
    fetchListingSessions();
  }, [userId]);

  return (
    <div className="">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:justify-center justify-start">
            <div>
              <div className="flex items-center gap-[12px] sm:justify-center justify-start mb-[15px]">
                <div className="text-[#00163A] text-[24px] font-bold uppercase">Майнинг</div>
                <Image
                  src="/dashboard/report/node-3-connections.svg"
                  alt="Wallet Icon"
                  width={45}
                  height={45}
                  objectFit="cover"
                  priority={false}
                />
              </div>
              <div className='flex flex-col gap-[15px]'>
                {miningSessions.map((session, index) => (
                  <div
                    key={index}
                    className="flex gap-[18px] px-[20px] py-[10px] border border-[#00163A] rounded-[15px] w-[264px]"
                  >
                    <div className='text-[20px] font-bold'>#{index + 1}</div>
                    <div className='min-w-[160px]'>
                      <div className='flex justify-between text-[14px] font-bold mb-[5px]'>
                        <div className="">Вложено:</div>
                        <div>${session.amount}</div>
                      </div>
                      <div className='flex justify-between text-[14px] font-semibold'>
                        <div className="">Открыт:</div>
                        <div>{new Date(session.startDate).toLocaleDateString()}</div>
                      </div>
                      <div className='flex justify-between text-[14px] font-semibold mb-[5px]'>
                        <div className="">Закрывается:</div>
                        <div>{new Date(session.endDate).toLocaleDateString()}</div>
                      </div>
                      <div className='flex justify-between text-[14px] font-bold text-[#3581FF]'>
                        <div className="">Заработано:</div>
                        <div>{session.fullAmount}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-[12px] justify-center mb-[15px]">
                <div className="text-[#00163A] text-[24px] font-bold uppercase">Стейкинг</div>
                <Image
                  src="/dashboard/report/invoice.svg"
                  alt="Wallet Icon"
                  width={45}
                  height={47}
                  objectFit="cover"
                  priority={false}
                />
              </div>
              <div className='flex flex-col gap-[15px]'>
                {stakingSessions.map((session, index) => (
                  <div
                    key={index}
                    className="flex justify-center gap-[18px] px-[20px] py-[10px] bg-[#3581FF] rounded-[15px] w-[264px]"
                  >
                    {/* <div className='text-[20px] font-bold'>#{index + 1}</div> */}
                    <div className='min-w-[205px]'>
                      <div className='flex justify-between text-[16px] font-bold mb-[5px]'>
                        <div className="">Контракт {index + 1}</div>
                        <div>${session.amount}</div>
                      </div>
                      <div className='flex justify-between text-[14px] font-semibold'>
                        <div className="">Открыт:</div>
                        <div>{new Date(session.startDate).toLocaleDateString()}</div>
                      </div>
                      <div className='flex justify-between text-[14px] font-semibold mb-[5px]'>
                        <div className="">Закрывается:</div>
                        {/* <div>{new Date(session.endDate).toLocaleDateString()}</div> */}
                        <div>-</div>
                      </div>
                      <div className='flex justify-between text-[14px] font-bold text-white'>
                        <div className="">Заработано:</div>
                        <div>{session.fullAmount}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-[12px] justify-center mb-[15px]">
                <div className="text-[#00163A] text-[24px] font-bold uppercase">Листининг</div>
                <Image
                  src="/dashboard/report/mnemonic.svg"
                  alt="Wallet Icon"
                  width={45}
                  height={45}
                  objectFit="cover"
                  priority={false}
                />
              </div>
              <div className='flex flex-col gap-[15px]'>
              {listingSessions.map((session, index) => (
                  <div
                    key={index}
                    className="flex justify-center gap-[18px] px-[20px] py-[10px] bg-[#00163A] rounded-[15px] w-[264px]"
                  >
                    <div className='min-w-[205px]'>
                      <div className='flex justify-between text-[16px] font-bold mb-[5px] text-white'>
                        <div className="">Контракт {index + 1}</div>
                        <div>${session.amount}</div>
                      </div>
                      <div className='flex justify-between text-[14px] font-semibold text-white'>
                        <div className="">Открыт:</div>
                        <div>{new Date(session.startDate).toLocaleDateString()}</div>
                      </div>
                      <div className='flex justify-between text-[14px] font-semibold mb-[5px] text-white'>
                        <div className="">Закрывается:</div>
                        <div>{new Date(session.endDate).toLocaleDateString()}</div>
                      </div>
                      <div className='flex justify-between text-[14px] font-bold text-[#3581FF]'>
                        <div className="">Заработано:</div>
                        <div>{session.fullAmount}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='flex flex-wrap sm:flex-nowrap fap-[20px] sm:gap-[30px]'>

          </div>
        </>
      )}
    </div>
  );
};

export default ReportComponent;