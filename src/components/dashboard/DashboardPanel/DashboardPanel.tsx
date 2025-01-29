'use client';
import { useEffect, useState } from "react";
import DepositComponent from "../DepositComponent/DepositComponent";
import LastRegistrations from "@/components/dashboard/LastRegistrations/LastRegistrations"
import Image from 'next/image';


interface User {
  id: string;
  balance: Record<string, number>;
  username: string;
  email: string;
  referrer: string;
  phone: string;
  registrationDate: string;
}

interface AdminDepositsProps {
  user: User;
}

export default function DashboardPanel({ user }: AdminDepositsProps) {
  const [referralLink, setReferralLink] = useState<string>("");
  const [selectedWallet, setSelectedWallet] = useState<string>("USDT");

  useEffect(() => {
    // Виконуємо дії з `window` лише на клієнтській стороні
    if (typeof window !== "undefined" && user?.username) {
      const link = `${window.location.origin}/register?referrer=${user.username}`;
      setReferralLink(link);
    }
  }, [user]);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
  };

  return (
    <div className="bg-gray-50 flex flex-wrap sm:flex-row flex-col-reverse gap-[65px] w-full sm:ml-[42px] font-segoeui">
      {/* User Info Section */}
      <div className="">
        <h3 className="text-[24px] font-bold mb-[20px] uppercase font-segoeui">Профиль</h3>
        <div className=" w-[275px] bg-white rounded-[15px] p-4  mb-[35px]"
          style={{
            boxShadow: '8px 10px 18.5px 0px rgba(0, 22, 58, 0.25)',
          }}
        >
          <div className="flex items-center gap-4 mb-[20px]">
            <div className="w-[74px] h-[74px] rounded-full bg-gray-200 flex items-center justify-center">
                <Image
                  src="/dashboard/address-book.svg"
                  alt="Your image description" 
                  width={74} 
                  height={74} 
                  objectFit="cover"
                  priority={false}
                />
            </div>
            <div>
              <h3 className="text-[20px] font-bold">{user?.username || 'My'}</h3>
              <p className="text-[14px] ">{user?.email || 'email@example.com'}</p>
              <p className="text-[13px] text-[#a1a4ad]">ID {user?.username || 'RU001587'}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[14px] font-semibold mb-[10px]">
              Дата регистрации: <span className="text-[#a1a4ad]">{user?.registrationDate || 'no data'}</span>
            </p>
            <p className="text-[14px] font-semibold mb-[10px]">
              Статус аккаунта: <span className="text-[#a1a4ad]">Не активный</span>
            </p>
            <p className="text-[14px] font-semibold mb-[10px] flex items-center gap-2">
              Связаться:
              {/* <span className="text-blue-500">📞</span> */}
              <Image
                src="/dashboard/devices.svg"
                alt="Your image description" 
                width={11} 
                height={18} 
                objectFit="cover"
                priority={false}
              />
              <Image
                src="/dashboard/envelope-fill.svg"
                alt="Your image description" 
                width={17} 
                height={16} 
                objectFit="cover"
                priority={false}
              />
              {/* <span className="text-blue-500">✉️</span> */}
            </p>
            {user?.referrer && <p className="text-[14px] font-semibold mb-[10px]">
              Ваш пригласитель: <span className="text-[#a1a4ad]">{user?.referrer}</span>
            </p>}
          </div>
        </div>
        {user?.username && (
          <div className="mb-[35px]">
          <p className="text-[16px] font-semibold mb-[10px] text-[#3581FF]">Ваша рефералка:</p>
          <div className="p-[5px] pr-[20px] pl-[20px] flex rounded-[5px] items-center bg-gray-100 w-[275px]"
            style={{
              boxShadow: '8px 10px 18.5px 0px rgba(0, 22, 58, 0.25)',
            }}
          >
            
            <a
              href={referralLink}
              className="text-blue hover:underline break-all truncate max-w-[200px]"
              title={referralLink}
            >
              {referralLink
                ? referralLink.length > 28
                  ? `${referralLink.slice(0, 28)}...`
                  : referralLink
                : "Завантаження..."}
            </a>
            <button
              onClick={handleCopy}
              className="ml-2 flex items-center justify-center"
            >
              <Image
                src="/dashboard/copy.svg"
                alt="Копіювати посилання"
                width={29}
                height={29}
                objectFit="cover"
                priority={false}
              />
            </button>
          </div>
        </div>
        )}
        {/* <h3 className="text-[24px] font-bold mb-[25px]">Регистрация партнеров</h3> */}
        <LastRegistrations userId={user?.id || ""} />
      </div>

      {/* Wallet Section */}
      <div className="">
      {/* Баланс */}
      <h3 className="text-[24px] font-bold mb-[20px] uppercase">Баланс</h3>
      <div className="flex flex-wrap gap-4 mb-[30px]">
        {user?.balance && (
          <div className="bg-[#3581FF] rounded-[15px] shadow-md sm:w-auto w-[294px] min-w-[294px] min-h-[203px]"   >
            <div className=" text-white rounded-[15px] pt-[31px] pl-[27px] pr-[27px] min-h-[203px]"
            style={{
              background: 'linear-gradient(180deg, rgba(53, 191, 255, 0) 33.1%, rgba(53, 191, 255, 0.74) 100%)',
              borderRadius: '15px',
              boxShadow: '8px 10px 18.5px 0px rgba(0, 22, 58, 0.25)',
            }}
            >
              <div className="flex justify-between items-baseline">
                <div className="flex items-baseline gap-[5px]">
                  <h4 className="text-[48px] font-bold">{user.balance[selectedWallet]?.toFixed(2) || 0}</h4>
                  <h4 className="text-[14px] font-regular">{selectedWallet}</h4>
                </div>
                <Image
                  src="/dashboard/wallet.svg"
                  alt="Wallet Icon"
                  width={72}
                  height={72}
                  objectFit="cover"
                  priority={false}
                />
              </div>
              <div className="flex pb-[31px] w-full">
                <DepositComponent id={user?.id} selectedWallet={selectedWallet}></DepositComponent>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Мої гаманці */}
      <h3 className="text-[24px] font-bold mb-[20px] uppercase">Мои кошельки</h3>
      <div className="flex flex-wrap gap-[25px]">
        {user?.balance &&
          Object.keys(user.balance).map((currency) => (
            <button
              key={currency}
              onClick={() => setSelectedWallet(currency)} // Вибір активного гаманця
              className={`${
                selectedWallet === currency ? " text-white " : "bg-white text-black border"
              } flex justify-center items-center w-[172px] h-[75px] rounded-[15px] font-bold text-[32px]`}
              style={{
                boxShadow: `${selectedWallet === currency ?'8px 10px 18.5px 0px rgba(0, 22, 58, 0.25)' :""}`,
                background: `${selectedWallet === currency ?'linear-gradient(180.00deg, rgba(53, 191, 255, 0) 33%,rgba(53, 191, 255, 0.74) 100%),rgb(53, 129, 255)' :""}`
              }}
            >
              {currency}
            </button>
          ))}
      </div>
    </div>
    </div>
  );
}
