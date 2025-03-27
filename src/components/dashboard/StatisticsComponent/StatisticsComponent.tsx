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
interface Bonus {
  id: string;
  rang: number;
  rangWait: number;
  bonus: number;
  bonusRef: number;
  createdAt: string;
  bonusGet: number[];
}

interface DepositRequest {
  id: string;
  currency: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface WithdrawalRequest {
  id: string;
  currency: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface TransferResponse {
  success: boolean;
  sentTransfers: TransferRequest[];
  receivedTransfers: TransferRequest[];
}
interface TransferRequest {
  id: string;
  username: string;
  currency: string;
  amount: number;
  status: string;
  createdAt: string;
}

const ReportComponent: React.FC<TeamComponentProps> = ({ userId }) => {
  const { language } = useLanguageStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [bonus, setBonus] = useState<Bonus | null>(null);
  const [miningSessions, setMiningSessions] = useState<MiningSession[]>([]);
  const [stakingSessions, setStakingSessions] = useState<MiningSession[]>([]);
  const [listingSessions, setListingSessions] = useState<MiningSession[]>([]);
  const [miningClosedSessions, setMiningClosedSessions] = useState<MiningSession[]>([]);
  const [stakingClosedSessions, setStakingClosedSessions] = useState<MiningSession[]>([]);
  const [listingClosedSessions, setListingClosedSessions] = useState<MiningSession[]>([]);
  const [depositReport, setDepositReport] = useState<DepositRequest[]>([]);
  const [transferSendReport, setTransferSendReport] = useState<TransferRequest[]>([]);
  const [transferGetReport, setTransferGetReport] = useState<TransferRequest[]>([]);
  const [withdrawalReport, setWithdrawalReport] = useState<WithdrawalRequest[]>([]);
  const [activeTab, setActiveTab] = useState<string>('mining');
  const [activeContratcTab, setActiveContratcTab] = useState<string>('open');
  const [activeButton, setActiveButton] = useState<string>('Заработано');

  const translations = {
    loading: {
      ru: "Загрузка...",
      en: "Loading...",
    },
    earned: {
      ru: "Заработано",
      en: "Earned",
    },
    invested: {
      ru: "Вложено",
      en: "Invested",
    },
    contracts: {
      ru: "Контракты",
      en: "Contracts",
    },
    depositOperations: {
      ru: "Операции пополнения",
      en: "Deposit Operations",
    },
    withdrawals: {
      ru: "Выводы",
      en: "Withdrawals",
    },
    transfers: {
      ru: "Переводы",
      en: "Transfers",
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
    open: {
      ru: "открытые",
      en: "Open",
    },
    referralProgram: {
      ru: "реферальная программа",
      en: "Referral Program",
    },
    bonuses: {
      ru: "бонусы",
      en: "Bonuses",
    },
    closed: {
      ru: "закрытые",
      en: "Closed",
    },
    totalEarned: {
      ru: "Всего заработано",
      en: "Total Earned",
    },
    contract: {
      ru: "Контракт",
      en: "Contract",
    },
    opened: {
      ru: "Открыт:",
      en: "Opened:",
    },
    closes: {
      ru: "Закрывается:",
      en: "Closes:",
    },
    sent: {
      ru: "отправлен",
      en: "sent",
    },
    received: {
      ru: "получен",
      en: "received",
    },
  };

  const [buttons, setButtons] = useState([
    { label: translations.earned[language], image: 'pie-chart.svg', sum: 0 },
    { label: translations.invested[language], image: 'safe.svg', sum: 0 },
    { label: translations.contracts[language], image: 'file.svg', sum: 0 },
    { label: translations.depositOperations[language], image: 'receive.svg', sum: 0 },
    { label: translations.withdrawals[language], image: 'send.svg', sum: 0 },
    { label: translations.transfers[language], image: 'export.svg', sum: 0 },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        const [miningRes, stakingRes, listingRes, miningClosedRes, stakingClosedRes, listingClosedRes, depositRes, transferRes, withdrawalRes] = await Promise.all([
          fetch(`/api/mining?userId=${userId}`),
          fetch(`/api/staking?userId=${userId}`),
          fetch(`/api/listing?userId=${userId}`),
          fetch(`/api/mining/closed?userId=${userId}`),
          fetch(`/api/staking/closed?userId=${userId}`),
          fetch(`/api/listing/closed?userId=${userId}`),
          fetch(`/api/get-report-deposit?userId=${userId}`),
          fetch(`/api/get-report-transfer?userId=${userId}`),
          fetch(`/api/get-report-withdrawal?userId=${userId}`),
        ]);

        if (miningRes.ok) {
          const miningData: { sessions: MiningSession[], bonus: Bonus } = await miningRes.json();
          setMiningSessions(miningData.sessions);
          setBonus(miningData.bonus);
        }

        if (stakingRes.ok) {
          const stakingData: { sessions: MiningSession[] } = await stakingRes.json();
          setStakingSessions(
            stakingData.sessions
              .filter((session) => session.currency === 'CC')
              .map((session) => ({
                ...session,
                amount: session.amount / 10,
              }))
          );
        }

        if (listingRes.ok) {
          const listingData: { sessions: MiningSession[] } = await listingRes.json();
          setListingSessions(listingData.sessions.filter((session) => session.currency === 'USDT'));
        }

        if (miningClosedRes.ok) {
          const miningData: { sessions: MiningSession[] } = await miningClosedRes.json();
          setMiningClosedSessions(miningData.sessions);
        }

        if (stakingClosedRes.ok) {
          const stakingData: { sessions: MiningSession[] } = await stakingClosedRes.json();
          setStakingClosedSessions(stakingData.sessions.filter((session) => session.currency === 'CC'));
        }

        if (listingClosedRes.ok) {
          const listingData: { sessions: MiningSession[] } = await listingClosedRes.json();
          setListingClosedSessions(listingData.sessions.filter((session) => session.currency === 'USDT'));
        }

        if (depositRes.ok) {
          const depositData: { deposits: DepositRequest[] } = await depositRes.json();
          setDepositReport(depositData.deposits.filter((deposit) => deposit.status === 'confirmed'));
        }

        if (transferRes.ok) {
          const transferData: TransferResponse = await transferRes.json();
          setTransferSendReport(
            transferData.sentTransfers.filter((transfer) => transfer.status === 'confirmed')
          );
          setTransferGetReport(
            transferData.receivedTransfers.filter((transfer) => transfer.status === 'confirmed')
          );
        }
        if (withdrawalRes.ok) {
          const withdrawalData: { withdrawals: WithdrawalRequest[] } = await withdrawalRes.json();
          setWithdrawalReport(withdrawalData.withdrawals.filter((withdrawal) => withdrawal.status === 'confirmed'));
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    const updatedButtons = buttons.map(button => {
      if (button.label === translations.earned[language]) {
        const totalEarnings = [
          ...miningSessions,
          ...stakingSessions,
          ...listingSessions,
        ].reduce((sum, session) => sum + (session.fullAmount || 0), 0);
        return { ...button, sum: Number(totalEarnings.toFixed(2)) };
      }
      if (button.label === translations.invested[language]) {
        const totalInvested = [
          ...miningSessions,
          ...stakingSessions,
          ...listingSessions,
        ].reduce((sum, session) => sum + (session.amount || 0), 0);
        return { ...button, sum: Number(totalInvested.toFixed(2)) };
      }
      if (button.label === translations.contracts[language]) {
        const totalContracts = [
          ...miningSessions,
          ...stakingSessions,
          ...listingSessions,
          ...miningClosedSessions,
          ...stakingClosedSessions,
          ...listingClosedSessions,
        ].reduce((sum, session) => sum + (session.amount || 0), 0);
        return { ...button, sum: Number(totalContracts.toFixed(2)) };
      }

      if (button.label === translations.depositOperations[language]) {
        const totalContracts = [
          ...depositReport,
        ].reduce((sum, session) => sum + (session.amount || 0), 0);
        return { ...button, sum: Number(totalContracts.toFixed(2)) };
      }

      if (button.label === translations.withdrawals[language]) {
        const totalContracts = [
          ...withdrawalReport,
        ].reduce((sum, session) => sum + (session.amount || 0), 0);
        return { ...button, sum: Number(totalContracts.toFixed(2)) };
      }

      if (button.label === translations.transfers[language]) {
        const totalContracts = [
          ...transferGetReport,
          ...transferSendReport,
        ].reduce((sum, session) => sum + (session.amount || 0), 0);
        return { ...button, sum: Number(totalContracts.toFixed(2)) };
      }
      return button;
    });

    setButtons(updatedButtons);
  }, [miningSessions, stakingSessions, listingSessions, miningClosedSessions, stakingClosedSessions, listingClosedSessions, language, depositReport, withdrawalReport, transferGetReport, transferSendReport,]);

  return (
    <div className="">
      {loading ? (
        <p>{translations.loading[language]}</p>
      ) : (
        <>
          <div className="p-[30px] pt-0 sm:p-0">
            <div className="flex flex-wrap justify-left sm:justify-between items-center mb-[35px] gap-[14px] sm:gap-[5px]">
              {buttons.map((button) => (
                <div
                  key={button.label}
                  onClick={() => setActiveButton(button.label)}
                  className={`flex gap-[5px] px-[5px] w-[150px] sm:w-max py-[10px] rounded-[5px] ${activeButton === button.label ? 'bg-[#3581FF] shadow-[8px_10px_18.5px_0px_rgba(0,22,58,0.25)]' : ''
                    }`}
                >
                  <Image
                    src={`/dashboard/statistic/${button.image}`}
                    alt={`${button.label} Icon`}
                    width={34}
                    height={34}
                    objectFit="cover"
                    priority={false}
                  />
                  <div className="font-bold">
                    <div className="text-[16px] text-[#00163A] w-min">{button.label}</div>
                    <div className={`text-[20px] ${activeButton === button.label ? 'text-white' : 'text-[#3581FF]'}`}>
                      {button.sum}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {(activeButton === translations.earned[language] || activeButton === translations.invested[language]) && (
              <div className="flex flex-wrap gap-[15px] sm:mr-[-15px] sm:ml-[-15px] sm:justify-start justify-center">
                <div className="flex gap-[5px] sm:hidden">
                  <div>
                    <div
                      onClick={() => setActiveTab('mining')}
                      className={`flex items-center gap-[5px] px-[8px] py-[5px] justify-center rounded-full ${activeTab === 'mining'
                          ? 'bg-[#3581FF] text-white rounded-[15px]'
                          : 'text-[#00163A] border border-[#00163A]'
                        }`}
                    >
                      <Image
                        src={`${activeTab === 'mining' ? '/dashboard/report/node-3-connections-white.svg' : '/dashboard/report/node-3-connections.svg'}`}
                        alt="Mining Icon"
                        width={19}
                        height={19}
                        objectFit="cover"
                        priority={false}
                      />
                      <div className="text-[16px]">{translations.mining[language]}</div>
                    </div>
                  </div>
                  <div>
                    <div
                      onClick={() => setActiveTab('staking')}
                      className={`flex items-center gap-[5px] px-[8px] py-[5px] justify-center rounded-full ${activeTab === 'staking'
                          ? 'bg-[#3581FF] text-white rounded-[15px]'
                          : 'text-[#00163A] border border-[#00163A]'
                        }`}
                    >
                      <Image
                        src={`${activeTab === 'staking' ? '/dashboard/report/invoice-white.svg' : '/dashboard/report/invoice.svg'}`}
                        alt="Staking Icon"
                        width={19}
                        height={19}
                        objectFit="cover"
                        priority={false}
                      />
                      <div className="text-[16px]">{translations.staking[language]}</div>
                    </div>
                  </div>
                  <div>
                    <div
                      onClick={() => setActiveTab('listing')}
                      className={`flex items-center gap-[5px] px-[8px] py-[5px] justify-center rounded-full ${activeTab === 'listing'
                          ? 'bg-[#3581FF] text-white rounded-[15px]'
                          : 'text-[#00163A] border border-[#00163A]'
                        }`}
                    >
                      <Image
                        src={`${activeTab === 'listing' ? '/dashboard/report/mnemonic-white.svg' : '/dashboard/report/mnemonic.svg'}`}
                        alt="Listing Icon"
                        width={19}
                        height={19}
                        objectFit="cover"
                        priority={false}
                      />
                      <div className="text-[16px]">{translations.listing[language]}</div>
                    </div>
                  </div>
                </div>
                <div className="mb-[15px]">
                  <div
                    onClick={() => setActiveTab('mining')}
                    className={`hidden sm:flex items-center gap-[5px] justify-center w-[257px] h-[65px] ${activeTab === 'mining'
                        ? 'bg-[#3581FF] sm:bg-white text-white sm:text-[#00163A] rounded-[15px]'
                        : 'text-[#00163A]'
                      }`}
                  >
                    <div className="text-[24px] font-bold uppercase">{translations.mining[language]}</div>
                    <Image
                      src={`${activeTab === 'mining' && window.innerWidth <= 640 ? '/dashboard/report/node-3-connections-white.svg' : '/dashboard/report/node-3-connections.svg'}`}
                      alt="Mining Icon"
                      width={25}
                      height={25}
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
                          {(activeButton === translations.earned[language] || activeButton === translations.invested[language]) && (
                            <div className="flex text-[16px] gap-[15px] mb-[5px]">
                              <div>{new Date(session.startDate).toISOString().slice(0, 10).replace(/\//g, '.')}</div>
                              <div>{new Date(session.startDate).toISOString().slice(11, 16)}</div>
                            </div>
                          )}
                          {activeButton === translations.invested[language] && (
                            <div className="flex justify-between text-[14px] font-bold mb-[5px]">
                              <div>{translations.invested[language]}</div>
                              <div>${session.amount}</div>
                            </div>
                          )}
                          {activeButton === translations.earned[language] && (
                            <div className="flex justify-between text-[14px] font-bold text-[#3581FF]">
                              <div>{translations.earned[language]}</div>
                              <div>{session?.fullAmount.toFixed(2)}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-[15px]">
                  <div
                    onClick={() => setActiveTab('staking')}
                    className={`hidden sm:flex items-center gap-[12px] justify-center w-[254px] h-[65px] ${activeTab === 'staking'
                        ? 'bg-[#3581FF] sm:bg-white text-white sm:text-[#00163A] rounded-[15px]'
                        : 'text-[#00163A]'
                      }`}
                  >
                    <div className="text-[24px] font-bold uppercase">{translations.staking[language]}</div>
                    <Image
                      src={`${activeTab === 'staking' && window.innerWidth <= 640 ? '/dashboard/report/invoice-white.svg' : '/dashboard/report/invoice.svg'}`}
                      alt="Staking Icon"
                      width={25}
                      height={25}
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
                          <div className="flex justify-between text-[16px] mb-[5px]">
                            <div className="font-bold">{translations.contract[language]}</div>
                            {(activeButton === translations.earned[language] || activeButton === translations.invested[language]) && (
                              <div className="flex text-[16px] gap-[15px]">
                                <div>{new Date(session.startDate).toISOString().slice(0, 10).replace(/\//g, '.')}</div>
                                <div>{new Date(session.startDate).toISOString().slice(11, 16)}</div>
                              </div>
                            )}
                          </div>
                          {activeButton === translations.invested[language] && (
                            <div className="flex justify-between text-[14px] font-bold text-white">
                              <div>{translations.invested[language]}</div>
                              <div>${session?.amount.toFixed(2)}</div>
                            </div>
                          )}
                          {activeButton === translations.earned[language] && (
                            <div className="flex justify-between text-[14px] font-bold text-white">
                              <div>{translations.earned[language]}</div>
                              <div>{session?.fullAmount.toFixed(2)}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-[15px]">
                  <div
                    onClick={() => setActiveTab('listing')}
                    className={`hidden sm:flex items-center gap-[12px] justify-center w-[257px] h-[65px] ${activeTab === 'listing'
                        ? 'bg-[#3581FF] sm:bg-white text-white sm:text-[#00163A] rounded-[15px]'
                        : 'text-[#00163A]'
                      }`}
                  >
                    <div className="text-[24px] font-bold uppercase">{translations.listing[language]}</div>
                    <Image
                      src={`${activeTab === 'listing' && window.innerWidth <= 640 ? '/dashboard/report/mnemonic-white.svg' : '/dashboard/report/mnemonic.svg'}`}
                      alt="Listing Icon"
                      width={25}
                      height={25}
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
                          <div className="flex justify-between text-[16px] mb-[5px] text-white gap-[5px]">
                            <div className="font-bold">{translations.contract[language]} {index + 1}</div>
                            {(activeButton === translations.earned[language] || activeButton === translations.invested[language]) && (
                              <div className="flex text-[16px] gap-[15px]">
                                <div>{new Date(session.startDate).toISOString().slice(0, 10).replace(/\//g, '.')}</div>
                                <div>{new Date(session.startDate).toISOString().slice(11, 16)}</div>
                              </div>
                            )}
                          </div>
                          {activeButton === translations.invested[language] && (
                            <div className="flex justify-between text-[14px] font-bold text-white">
                              <div>{translations.invested[language]}</div>
                              <div>{session?.amount.toFixed(2)}</div>
                            </div>
                          )}
                          {activeButton === translations.earned[language] && (
                            <div className="flex justify-between text-[14px] font-bold text-[#3581FF]">
                              <div>{translations.earned[language]}</div>
                              <div>{session?.fullAmount.toFixed(2)}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {(activeButton === translations.earned[language] || activeButton === translations.invested[language]) && (
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
                            {(activeButton === translations.earned[language] || activeButton === translations.invested[language]) && (
                              <div className="flex text-[16px] gap-[15px] mb-[5px]">
                                <div>{new Date(session.startDate).toISOString().slice(0, 10).replace(/\//g, '.')}</div>
                                <div>{new Date(session.startDate).toISOString().slice(11, 16)}</div>
                              </div>
                            )}
                            {activeButton === translations.invested[language] && (
                              <div className="flex justify-between text-[14px] font-bold mb-[5px]">
                                <div>{translations.invested[language]}</div>
                                <div>${session.amount}</div>
                              </div>
                            )}
                            {activeButton === translations.earned[language] && (
                              <div className="flex justify-between text-[14px] font-bold text-[#3581FF]">
                                <div>{translations.earned[language]}</div>
                                <div>{session?.fullAmount.toFixed(2)}</div>
                              </div>
                            )}
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
                            <div className="flex justify-between text-[16px] mb-[5px]">
                              <div className="font-bold">{translations.contract[language]}</div>
                              {(activeButton === translations.earned[language] || activeButton === translations.invested[language]) && (
                                <div className="flex text-[16px] gap-[15px]">
                                  <div>{new Date(session.startDate).toISOString().slice(0, 10).replace(/\//g, '.')}</div>
                                  <div>{new Date(session.startDate).toISOString().slice(11, 16)}</div>
                                </div>
                              )}
                            </div>
                            {activeButton === translations.invested[language] && (
                              <div className="flex justify-between text-[14px] font-bold text-white">
                                <div>{translations.invested[language]}</div>
                                <div>${session?.amount.toFixed(2)}</div>
                              </div>
                            )}
                            {activeButton === translations.earned[language] && (
                              <div className="flex justify-between text-[14px] font-bold text-white">
                                <div>{translations.earned[language]}</div>
                                <div>{session?.fullAmount.toFixed(2)}</div>
                              </div>
                            )}
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
                            <div className="flex justify-between text-[16px] mb-[5px] text-white gap-[10px]">
                              <div className="font-bold">{translations.contract[language]} {index + 1}</div>
                              {(activeButton === translations.earned[language] || activeButton === translations.invested[language]) && (
                                <div className="flex text-[16px] gap-[15px]">
                                  <div>{new Date(session.startDate).toISOString().slice(0, 10).replace(/\//g, '.')}</div>
                                  <div>{new Date(session.startDate).toISOString().slice(11, 16)}</div>
                                </div>
                              )}
                            </div>
                            {activeButton === translations.invested[language] && (
                              <div className="flex justify-between text-[14px] font-bold text-white">
                                <div>{translations.invested[language]}</div>
                                <div>{session?.amount.toFixed(2)}</div>
                              </div>
                            )}
                            {activeButton === translations.earned[language] && (
                              <div className="flex justify-between text-[14px] font-bold text-[#3581FF]">
                                <div>{translations.earned[language]}</div>
                                <div>{session?.fullAmount.toFixed(2)}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeButton === translations.contracts[language] && (
              <div className="flex flex-wrap gap-[10px]">
                <div className="flex flex-col gap-[5px] sm:hidden mb-[20px] w-full">
                  <div>
                    <div
                      onClick={() => setActiveContratcTab('open')}
                      className={`flex items-center gap-[5px] px-[8px] py-[5px] justify-center rounded-full ${activeContratcTab === 'open'
                          ? 'bg-[#3581FF] text-white rounded-[15px]'
                          : 'text-[#00163A] border border-[#00163A]'
                        }`}
                    >
                      <div className="text-[16px] font-bold uppercase">{translations.open[language]}</div>
                    </div>
                  </div>
                  <div>
                    <div
                      onClick={() => setActiveContratcTab('ref-prog')}
                      className={`flex items-center gap-[5px] px-[8px] py-[5px] justify-center rounded-full ${activeContratcTab === 'ref-prog'
                          ? 'bg-[#3581FF] text-white rounded-[15px]'
                          : 'text-[#00163A] border border-[#00163A]'
                        }`}
                    >
                      <div className="text-[16px] font-bold uppercase">{translations.referralProgram[language]}</div>
                    </div>
                  </div>
                  <div>
                    <div
                      onClick={() => setActiveContratcTab('bonus')}
                      className={`flex items-center gap-[5px] px-[8px] py-[5px] justify-center rounded-full ${activeContratcTab === 'bonus'
                          ? 'bg-[#3581FF] text-white rounded-[15px]'
                          : 'text-[#00163A] border border-[#00163A]'
                        }`}
                    >
                      <div className="text-[16px] font-bold uppercase">{translations.bonuses[language]}</div>
                    </div>
                  </div>
                  <div>
                    <div
                      onClick={() => setActiveContratcTab('close')}
                      className={`flex items-center gap-[5px] px-[8px] py-[5px] justify-center rounded-full ${activeContratcTab === 'close'
                          ? 'bg-[#3581FF] text-white rounded-[15px]'
                          : 'text-[#00163A] border border-[#00163A]'
                        }`}
                    >
                      <div className="text-[16px] font-bold uppercase">{translations.closed[language]}</div>
                    </div>
                  </div>
                </div>
                {activeContratcTab !== 'ref-prog' && activeContratcTab !== 'bonus' && (
                  <div className="flex gap-[5px] sm:hidden mb-[20px]">
                    <div>
                      <div
                        onClick={() => setActiveTab('mining')}
                        className={`flex items-center gap-[5px] px-[8px] py-[5px] justify-center rounded-full ${activeTab === 'mining'
                            ? 'bg-[#3581FF] text-white rounded-[15px]'
                            : 'text-[#00163A] border border-[#00163A]'
                          }`}
                      >
                        <Image
                          src={`${activeTab === 'mining' ? '/dashboard/report/node-3-connections-white.svg' : '/dashboard/report/node-3-connections.svg'}`}
                          alt="Mining Icon"
                          width={19}
                          height={19}
                          objectFit="cover"
                          priority={false}
                        />
                        <div className="text-[16px]">{translations.mining[language]}</div>
                      </div>
                    </div>
                    <div>
                      <div
                        onClick={() => setActiveTab('staking')}
                        className={`flex items-center gap-[5px] px-[8px] py-[5px] justify-center rounded-full ${activeTab === 'staking'
                            ? 'bg-[#3581FF] text-white rounded-[15px]'
                            : 'text-[#00163A] border border-[#00163A]'
                          }`}
                      >
                        <Image
                          src={`${activeTab === 'staking' ? '/dashboard/report/invoice-white.svg' : '/dashboard/report/invoice.svg'}`}
                          alt="Staking Icon"
                          width={19}
                          height={19}
                          objectFit="cover"
                          priority={false}
                        />
                        <div className="text-[16px]">{translations.staking[language]}</div>
                      </div>
                    </div>
                    <div>
                      <div
                        onClick={() => setActiveTab('listing')}
                        className={`flex items-center gap-[5px] px-[8px] py-[5px] justify-center rounded-full ${activeTab === 'listing'
                            ? 'bg-[#3581FF] text-white rounded-[15px]'
                            : 'text-[#00163A] border border-[#00163A]'
                          }`}
                      >
                        <Image
                          src={`${activeTab === 'listing' ? '/dashboard/report/mnemonic-white.svg' : '/dashboard/report/mnemonic.svg'}`}
                          alt="Listing Icon"
                          width={19}
                          height={19}
                          objectFit="cover"
                          priority={false}
                        />
                        <div className="text-[16px]">{translations.listing[language]}</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeContratcTab === 'open' && (
                  <div className="block sm:hidden">
                    {activeTab === 'mining' && (
                      <div className="flex flex-col gap-[15px]">
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
                      <div className="flex flex-col gap-[15px]">
                        {stakingSessions.map((session, index) => (
                          <div
                            key={index}
                            className="flex justify-center gap-[18px] px-[20px] py-[10px] bg-[#3581FF] rounded-[15px] w-[254px]"
                          >
                            <div className="min-w-[205px]">
                              <div className="flex justify-between text-[16px] font-bold mb-[5px]">
                                <div>{translations.contract[language]}</div>
                                <div>${session?.amount.toFixed(2)}</div>
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
                      <div className="flex flex-col gap-[15px]">
                        {listingSessions.map((session, index) => (
                          <div
                            key={index}
                            className="flex justify-center gap-[18px] px-[20px] py-[10px] bg-[#00163A] rounded-[15px] w-[257px]"
                          >
                            <div className="min-w-[205px]">
                              <div className="flex justify-between text-[16px] mb-[5px] text-white gap-[10px]">
                                <div className="font-bold">{translations.contract[language]} {index + 1}</div>
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
                )}
                {activeContratcTab === 'ref-prog' && (
                  <div>
                    <div className="flex gap-[10px] mb-[30px]">
                      <div className="text-[16px]">{translations.totalEarned[language]}</div>
                      <div className="text-[#3581FF]">0</div>
                    </div>
                  </div>
                )}
                {activeContratcTab === 'bonus' && (
                  <div>
                    <div className="flex gap-[10px]">
                      <div>{translations.totalEarned[language]}</div>
                      <div className="text-[#3581FF]">0</div>
                    </div>
                  </div>
                )}
                {activeContratcTab === 'close' && (
                  <div className="block sm:hidden">
                    {activeTab === 'mining' && (
                      <div className="flex flex-col gap-[15px]">
                        {miningClosedSessions.map((session, index) => (
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
                      <div className="flex flex-col gap-[15px]">
                        {stakingClosedSessions.map((session, index) => (
                          <div
                            key={index}
                            className="flex justify-center gap-[18px] px-[20px] py-[10px] bg-[#3581FF] rounded-[15px] w-[254px]"
                          >
                            <div className="min-w-[205px]">
                              <div className="flex justify-between text-[16px] font-bold mb-[5px]">
                                <div>{translations.contract[language]}</div>
                                <div>${session?.amount.toFixed(2)}</div>
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
                      <div className="flex flex-col gap-[15px]">
                        {listingClosedSessions.map((session, index) => (
                          <div
                            key={index}
                            className="flex justify-center gap-[18px] px-[20px] py-[10px] bg-[#00163A] rounded-[15px] w-[257px]"
                          >
                            <div className="min-w-[205px]">
                              <div className="flex justify-between text-[16px] mb-[5px] text-white gap-[10px]">
                                <div className="font-bold">{translations.contract[language]} {index + 1}</div>
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
                )}

                <div className="w-[255px] h-min hidden sm:block">
                  <div className="text-[20px] font-bold uppercase mb-[20px]">{translations.open[language]}</div>
                  <div className="flex flex-wrap gap-[15px] justify-center items-start">
                    <div>
                      <div
                        onClick={() => setActiveTab('mining')}
                        className={`flex items-center gap-[12px] justify-center w-[255px] h-[35px] rounded-full ${activeTab === 'mining'
                            ? 'bg-[#3581FF] text-white rounded-[15px]'
                            : 'text-[#00163A] border border-[#00163A]'
                          }`}
                      >
                        <Image
                          src={`${activeTab === 'mining' ? '/dashboard/report/node-3-connections-white.svg' : '/dashboard/report/node-3-connections.svg'}`}
                          alt="Mining Icon"
                          width={25}
                          height={25}
                          objectFit="cover"
                          priority={false}
                        />
                        <div className="text-[16px]">{translations.mining[language]}</div>
                      </div>
                    </div>
                    <div>
                      <div
                        onClick={() => setActiveTab('staking')}
                        className={`flex items-center gap-[12px] justify-center w-[255px] h-[35px] rounded-full ${activeTab === 'staking'
                            ? 'bg-[#3581FF] text-white rounded-[15px]'
                            : 'text-[#00163A] border border-[#00163A]'
                          }`}
                      >
                        <Image
                          src={`${activeTab === 'staking' ? '/dashboard/report/invoice-white.svg' : '/dashboard/report/invoice.svg'}`}
                          alt="Staking Icon"
                          width={25}
                          height={25}
                          objectFit="cover"
                          priority={false}
                        />
                        <div className="text-[16px]">{translations.staking[language]}</div>
                      </div>
                    </div>
                    <div>
                      <div
                        onClick={() => setActiveTab('listing')}
                        className={`flex items-center gap-[12px] justify-center w-[255px] h-[35px] rounded-full ${activeTab === 'listing'
                            ? 'bg-[#3581FF] text-white rounded-[15px]'
                            : 'text-[#00163A] border border-[#00163A]'
                          }`}
                      >
                        <Image
                          src={`${activeTab === 'listing' ? '/dashboard/report/mnemonic-white.svg' : '/dashboard/report/mnemonic.svg'}`}
                          alt="Listing Icon"
                          width={25}
                          height={25}
                          objectFit="cover"
                          priority={false}
                        />
                        <div className="text-[16px]">{translations.listing[language]}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap fap-[20px]">
                      <div>
                        {activeTab === 'mining' && (
                          <div className="flex flex-col gap-[15px]">
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
                          <div className="flex flex-col gap-[15px]">
                            {stakingSessions.map((session, index) => (
                              <div
                                key={index}
                                className="flex justify-center gap-[18px] px-[20px] py-[10px] bg-[#3581FF] rounded-[15px] w-[254px]"
                              >
                                <div className="min-w-[205px]">
                                  <div className="flex justify-between text-[16px] font-bold mb-[5px]">
                                    <div>{translations.contract[language]}</div>
                                    <div>${session?.amount.toFixed(2)}</div>
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
                          <div className="flex flex-col gap-[15px]">
                            {listingSessions.map((session, index) => (
                              <div
                                key={index}
                                className="flex justify-center gap-[18px] px-[20px] py-[10px] bg-[#00163A] rounded-[15px] w-[257px]"
                              >
                                <div className="min-w-[205px]">
                                  <div className="flex justify-between text-[16px] mb-[5px] text-white gap-[10px]">
                                    <div className="font-bold">{translations.contract[language]} {index + 1}</div>
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
                  </div>
                </div>

                <div className="w-[255px] h-min hidden sm:block">
                  <div className="text-[20px] font-bold uppercase mb-[20px]">{translations.closed[language]}</div>
                  <div className="flex flex-wrap gap-[15px] items-start">
                    <div>
                      <div
                        onClick={() => setActiveTab('mining')}
                        className={`flex items-center gap-[12px] justify-center w-[255px] h-[35px] rounded-full ${activeTab === 'mining'
                            ? 'bg-[#3581FF] text-white rounded-[15px]'
                            : 'text-[#00163A] border border-[#00163A]'
                          }`}
                      >
                        <Image
                          src={`${activeTab === 'mining' ? '/dashboard/report/node-3-connections-white.svg' : '/dashboard/report/node-3-connections.svg'}`}
                          alt="Mining Icon"
                          width={25}
                          height={25}
                          objectFit="cover"
                          priority={false}
                        />
                        <div className="text-[16px]">{translations.mining[language]}</div>
                      </div>
                    </div>
                    <div>
                      <div
                        onClick={() => setActiveTab('staking')}
                        className={`flex items-center gap-[12px] justify-center w-[255px] h-[35px] rounded-full ${activeTab === 'staking'
                            ? 'bg-[#3581FF] text-white rounded-[15px]'
                            : 'text-[#00163A] border border-[#00163A]'
                          }`}
                      >
                        <Image
                          src={`${activeTab === 'staking' ? '/dashboard/report/invoice-white.svg' : '/dashboard/report/invoice.svg'}`}
                          alt="Staking Icon"
                          width={25}
                          height={25}
                          objectFit="cover"
                          priority={false}
                        />
                        <div className="text-[16px]">{translations.staking[language]}</div>
                      </div>
                    </div>
                    <div>
                      <div
                        onClick={() => setActiveTab('listing')}
                        className={`flex items-center gap-[12px] justify-center w-[255px] h-[35px] rounded-full ${activeTab === 'listing'
                            ? 'bg-[#3581FF] text-white rounded-[15px]'
                            : 'text-[#00163A] border border-[#00163A]'
                          }`}
                      >
                        <Image
                          src={`${activeTab === 'listing' ? '/dashboard/report/mnemonic-white.svg' : '/dashboard/report/mnemonic.svg'}`}
                          alt="Listing Icon"
                          width={25}
                          height={25}
                          objectFit="cover"
                          priority={false}
                        />
                        <div className="text-[16px]">{translations.listing[language]}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap fap-[20px]">
                      <div>
                        {activeTab === 'mining' && (
                          <div className="flex flex-col gap-[15px]">
                            {miningClosedSessions.map((session, index) => (
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
                          <div className="flex flex-col gap-[15px]">
                            {stakingClosedSessions.map((session, index) => (
                              <div
                                key={index}
                                className="flex justify-center gap-[18px] px-[20px] py-[10px] bg-[#3581FF] rounded-[15px] w-[254px]"
                              >
                                <div className="min-w-[205px]">
                                  <div className="flex justify-between text-[16px] font-bold mb-[5px]">
                                    <div>{translations.contract[language]}</div>
                                    <div>${session?.amount.toFixed(2)}</div>
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
                          <div className="flex flex-col gap-[15px]">
                            {listingClosedSessions.map((session, index) => (
                              <div
                                key={index}
                                className="flex justify-center gap-[18px] px-[20px] py-[10px] bg-[#00163A] rounded-[15px] w-[257px]"
                              >
                                <div className="min-w-[205px]">
                                  <div className="flex justify-between text-[16px] mb-[5px] text-white gap-[10px]">
                                    <div className="font-bold">{translations.contract[language]} {index + 1}</div>
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
                  </div>
                </div>

                <div className="max-w-[215px] hidden sm:block">
                  <div className="text-[20px] font-bold uppercase mb-[10px]">{translations.referralProgram[language]}</div>
                  <div className="flex gap-[10px] mb-[30px]">
                    <div className="text-[16px]">{translations.totalEarned[language]}</div>
                    <div className="text-[#3581FF]">{bonus?.bonus}</div>
                  </div>
                  <div className="text-[20px] font-bold uppercase mb-[10px]">{translations.bonuses[language]}</div>
                  <div className="flex gap-[10px]">
                    <div>{translations.totalEarned[language]}</div>
                    <div className="text-[#3581FF]">{bonus?.bonusRef}</div>
                  </div>
                </div>
              </div>
            )}

            {activeButton === translations.depositOperations[language] && (
              <div className="flex gap-[10px]">
                <div className="w-full">
                  <div className="flex flex-wrap gap-[15px]">
                    {depositReport.map((deposit, index) => (
                      <div
                        key={`deposit-plus-${index}`}
                        className="w-[358px] px-[35px] py-[10px] rounded-full bg-[#3581FF4D] text-[#00163A]"
                      >
                        <div className="flex justify-between gap-[10px]">
                          <div className="flex gap-[10px] text-[14px]">
                            <div>{new Date(deposit.createdAt).toISOString().slice(0, 10)}</div>
                            <div>{new Date(deposit.createdAt).toISOString().slice(11, 16)}</div>
                          </div>
                          <div className="flex gap-[10px] text-[14px]">
                            <div>+</div>
                            <div className="font-bold">${deposit.amount?.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeButton === translations.withdrawals[language] && (
              <div className="flex gap-[10px]">
                <div className="w-full">
                  <div className="flex flex-wrap gap-[15px]">
                    {withdrawalReport.map((deposit, index) => (
                      <div
                        key={`deposit-plus-${index}`}
                        className="w-[358px] px-[35px] py-[10px] rounded-full bg-[#00163A26] text-[#00163A]"
                      >
                        <div className="flex justify-between gap-[10px]">
                          <div className="flex gap-[10px] text-[14px]">
                            <div>{new Date(deposit.createdAt).toISOString().slice(0, 10)}</div>
                            <div>{new Date(deposit.createdAt).toISOString().slice(11, 16)}</div>
                          </div>
                          <div className="flex gap-[10px] text-[14px]">
                            <div>-</div>
                            <div className="font-bold">${deposit.amount?.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeButton === translations.transfers[language] && (
              <div className="flex gap-[10px]">
                <div className="w-full flex flex-wrap gap-[15px ] sm:flex-nowrap">
                  <div className="flex flex-wrap gap-[15px]">
                    {transferSendReport.map((deposit, index) => (
                      <div
                        key={`deposit-plus-${index}`}
                        className="w-[378px] px-[35px] py-[10px] rounded-full bg-[#3581FF4D] text-[#00163A]"
                      >
                        <div className="flex justify-between gap-[10px]">
                          <div className="flex gap-[10px] text-[14px]">
                            <div>{new Date(deposit.createdAt).toISOString().slice(0, 10)}</div>
                            <div>{new Date(deposit.createdAt).toISOString().slice(11, 16)}</div>
                          </div>
                          <div>{deposit.username}</div>
                          <div>{translations.sent[language]}</div>
                          <div>→</div>
                          <div className="flex gap-[10px] text-[14px]">
                            <div className="font-bold">${deposit.amount?.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-[15px]">
                    {transferSendReport.map((deposit, index) => (
                      <div
                        key={`deposit-plus-${index}`}
                        className="w-[378px] px-[35px] py-[10px] rounded-full bg-[#00163A26] text-[#00163A]"
                      >
                        <div className="flex justify-between gap-[10px]">
                          <div className="flex gap-[10px] text-[14px]">
                            <div>{new Date(deposit.createdAt).toISOString().slice(0, 10)}</div>
                            <div>{new Date(deposit.createdAt).toISOString().slice(11, 16)}</div>
                          </div>
                          <div>{deposit.username}</div>
                          <div>{translations.received[language]}</div>
                          <div>←</div>
                          <div className="flex gap-[10px] text-[14px]">
                            <div className="font-bold">${deposit.amount?.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReportComponent