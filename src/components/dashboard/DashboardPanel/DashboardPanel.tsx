'use client';
import { useEffect, useState } from "react";
import LastRegistrations from "@/components/dashboard/LastRegistrations/LastRegistrations";
import Image from 'next/image';
import { cryptoOptions } from "./data";
import RequestStatusIndicator from '@/components/dashboard/RequestStatusIndicator/RequestStatusIndicator';
import { useLanguageStore } from '@/store/useLanguageStore';

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

const CustomSelect = ({ options, selectedWallet, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguageStore();

  const translations = {
    placeholder: {
      ru: "Тип валюты",
      en: "Currency type",
    },
  };

  const handleSelect = (currency) => {
    onSelect(currency);
    setIsOpen(false);
  };

  const selectedCrypto = options.find(crypto => crypto.currency === selectedWallet);

  return (
    <div className="relative w-full mb-[20px]">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-[5px] p-2 text-[#A0A5AD] text-[14px] pl-[10px] border cursor-pointer flex items-center bg-white h-[31px]"
      >
        {selectedCrypto ? (
          <>
            <Image
              src={selectedCrypto.logo}
              alt={selectedCrypto.currency}
              width={24}
              height={24}
              className="mr-2 rounded-full"
            />
            {selectedCrypto.currency}
          </>
        ) : (
          <>
            <Image
              src={'/dashboard/crypto-logos/search.svg'}
              alt={'find'}
              width={24}
              height={24}
              className="mr-2 rounded-full"
            />
            {translations.placeholder[language]}
          </>
        )}
        <svg className="ml-auto w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 12l-5-5 1.5-1.5L10 9l3.5-3.5L15 7l-5 5z" clipRule="evenodd" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-[5px] shadow-lg">
          {options.map((crypto) => (
            <div
              key={crypto.currency}
              onClick={() => handleSelect(crypto.currency)}
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer text-[#A0A5AD]"
            >
              <Image
                src={crypto.logo}
                alt={crypto.currency}
                width={24}
                height={24}
                className="mr-2 rounded-full"
              />
              {crypto.currency}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function DashboardPanel({ user }: AdminDepositsProps) {
  const { language } = useLanguageStore();
  const [referralLink, setReferralLink] = useState<string>("");
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const [amount, setAmount] = useState('');
  const [wallet, setWallet] = useState('');
  const [message, setMessage] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [requestStatus, setRequestStatus] = useState<'loading' | 'success' | 'error' | null>(null);

  console.log(isPending)
  const translations = {
    profile: {
      ru: "Профиль",
      en: "Profile",
    },
    registrationDate: {
      ru: "Дата регистрации:",
      en: "Registration date:",
    },
    accountStatus: {
      ru: "Статус аккаунта:",
      en: "Account status:",
    },
    notActive: {
      ru: "Не активный",
      en: "Not active",
    },
    contact: {
      ru: "Связаться:",
      en: "Contact:",
    },
    referrer: {
      ru: "Ваш пригласитель:",
      en: "Your referrer:",
    },
    referralLink: {
      ru: "Ваша рефералка:",
      en: "Your referral link:",
    },
    balance: {
      ru: "Баланс",
      en: "Balance",
    },
    amount: {
      ru: "Сумма",
      en: "Amount",
    },
    address: {
      ru: "Адрес:",
      en: "Address:",
    },
    deposit: {
      ru: "Пополнить",
      en: "Deposit",
    },
    paid: {
      ru: "Оплачено",
      en: "Paid",
    },
    errors: {
      noAmount: {
        ru: "Введите сумму",
        en: "Enter amount",
      },
      noCurrency: {
        ru: "Выберите криптовалюту",
        en: "Select cryptocurrency",
      },
    },
    requestStatus: {
      success: {
        ru: "Успех",
        en: "Success",
      },
      error: {
        ru: "Ошибка",
        en: "Error",
      },
    },
  };

  useEffect(() => {
    if (typeof window !== "undefined" && user?.username) {
      const link = `${window.location.origin}/register?referrer=${user.username}`;
      setReferralLink(link);
    }
  }, [user]);

  const handleCopy = (elem) => {
    navigator.clipboard.writeText(elem);
  };

  const handleDeposit = async () => {
    setMessage("");
    if (!amount) {
      setMessage(translations.errors.noAmount[language]);
      return;
    }

    if (!selectedWallet) {
      setMessage(translations.errors.noCurrency[language]);
      return;
    }

    setIsOpen(true);
    setIsPending(true);

    const selectedCrypto = findSelectedCrypto();

    if (selectedCrypto) {
      setWallet(selectedCrypto.qr);
    }
  };

  const handlePaid = async () => {
    setRequestStatus('loading');
    try {
      const response = await fetch('/api/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user?.id,
          currency: selectedWallet,
          amount: parseFloat(amount),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setIsOpen(false);
        setRequestStatus('success');
        setIsPending(false);
        setAmount('');
        setMessage('');
        setWallet('');
      } else {
        setRequestStatus('error');
      }
    } catch (error) {
      console.error('Error creating deposit:', error);
      setRequestStatus('error');
    }
  };

  const findSelectedCrypto = () => {
    return cryptoOptions.find(crypto => crypto.currency === selectedWallet);
  };

  const displayAddress = () => {
    const selectedCrypto = findSelectedCrypto();

    if (!selectedCrypto || !selectedCrypto.address) return "Loading...";

    return selectedCrypto.address.length > 28
      ? `${selectedCrypto.address.slice(0, 28)}...`
      : selectedCrypto.address;
  };

  const handleSpinnerHide = () => {
    setRequestStatus(null);
  };

  return (
    <div className="bg-gray-50 flex flex-wrap sm:flex-row flex-col-reverse gap-[65px] w-full sm:ml-[42px] font-segoeui">
      <RequestStatusIndicator
        status={requestStatus}
        message={
          requestStatus === 'success'
            ? translations.requestStatus.success[language]
            : requestStatus === 'error'
            ? translations.requestStatus.error[language]
            : undefined
        }
        onHide={handleSpinnerHide}
      />
      <div className="">
        <h3 className="text-[24px] font-bold mb-[20px] uppercase font-segoeui">
          {translations.profile[language]}
        </h3>
        <div
          className="w-[275px] bg-white rounded-[15px] p-4 mb-[35px]"
          style={{
            boxShadow: '8px 10px 18.5px 0px rgba(0, 22, 58, 0.25)',
          }}
        >
          <div className="flex items-center gap-4 mb-[20px]">
            <div className="w-[74px] h-[74px] rounded-full bg-gray-200 flex items-center justify-center">
              <Image
                src="/dashboard/address-book.svg"
                alt="Profile icon"
                width={74}
                height={74}
                objectFit="cover"
                priority={false}
              />
            </div>
            <div>
              <h3 className="text-[20px] font-bold">{user?.username || 'My'}</h3>
              <p className="text-[14px]">{user?.email || 'email@example.com'}</p>
              <p className="text-[13px] text-[#a1a4ad]">ID {user?.username || 'RU001587'}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[14px] font-semibold mb-[10px]">
              {translations.registrationDate[language]}{" "}
              <span className="text-[#a1a4ad]">{user?.registrationDate || 'нет данных'}</span>
            </p>
            <p className="text-[14px] font-semibold mb-[10px]">
              {translations.accountStatus[language]}{" "}
              <span className="text-[#a1a4ad]">{translations.notActive[language]}</span>
            </p>
            <p className="text-[14px] font-semibold mb-[10px] flex items-center gap-2">
              {translations.contact[language]}
              <Image
                src="/dashboard/devices.svg"
                alt="Phone icon"
                width={11}
                height={18}
                objectFit="cover"
                priority={false}
              />
              <Image
                src="/dashboard/envelope-fill.svg"
                alt="Email icon"
                width={17}
                height={16}
                objectFit="cover"
                priority={false}
              />
            </p>
            {user?.referrer && (
              <p className="text-[14px] font-semibold mb-[10px]">
                {translations.referrer[language]}{" "}
                <span className="text-[#a1a4ad]">{user?.referrer}</span>
              </p>
            )}
          </div>
        </div>
        {user?.username && (
          <div className="mb-[35px]">
            <p className="text-[16px] font-semibold mb-[10px] text-[#3581FF]">
              {translations.referralLink[language]}
            </p>
            <div
              className="p-[5px] pr-[20px] pl-[20px] flex rounded-[5px] items-center bg-gray-100 w-[275px]"
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
                  : "Loading..."}
              </a>
              <button
                onClick={() => handleCopy(referralLink)}
                className="ml-2 flex items-center justify-center"
              >
                <Image
                  src="/dashboard/copy.svg"
                  alt="Copy link"
                  width={29}
                  height={29}
                  objectFit="cover"
                  priority={false}
                />
              </button>
            </div>
          </div>
        )}
        <LastRegistrations userId={user?.id || ""} />
      </div>

      {/* Wallet Section */}
      <div className="">
        <h3 className="text-[24px] font-bold mb-[20px] uppercase">
          {translations.balance[language]}
        </h3>
        <div className="flex flex-wrap gap-4 mb-[30px]">
          {user?.balance && (
            <div className="bg-[#3581FF] rounded-[15px] shadow-md sm:w-[294px] w-[294px] min-w-[294px] min-h-[203px]">
              <div
                className="text-white rounded-[15px] pt-[10px] pl-[27px] pb-[22px] pr-[27px] min-h-[203px]"
                style={{
                  background: 'linear-gradient(180deg, rgba(53, 191, 255, 0) 33.1%, rgba(53, 191, 255, 0.74) 100%)',
                  borderRadius: '15px',
                  boxShadow: '8px 10px 18.5px 0px rgba(0, 22, 58, 0.25)',
                }}
              >
                <div className="flex justify-between items-baseline mb-[20px]">
                  <div className="flex items-baseline gap-[5px]">
                    <h4
                      className="font-bold"
                      style={{
                        fontSize: +user.balance.USDT?.toFixed(0) <= 99999
                          ? '48px'
                          : +user.balance.USDT?.toFixed(0) <= 999999
                          ? '42px'
                          : '30px',
                        fontWeight: 'bold',
                      }}
                    >
                      {user.balance.USDT?.toFixed(0) || 0}
                    </h4>
                    <h4 className="text-[14px] font-regular">USDT</h4>
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
                <div className="flex w-full">
                  <div className="w-full">
                    {!isOpen && (
                      <CustomSelect
                        options={cryptoOptions}
                        selectedWallet={selectedWallet}
                        onSelect={setSelectedWallet}
                      />
                    )}
                    {!isOpen && (
                      <div className="mb-[10px] flex flex-col gap-[10px]">
                        <label htmlFor="amount" className="text-[#00163A] text-[14px] font-semibold">
                          {translations.amount[language]}
                        </label>
                        <input
                          id="amount"
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0"
                          className="pl-[15px] w-full rounded-[5px] text-[#A0A5AD] text-[14px] h-[31px]"
                        />
                      </div>
                    )}
                    {isOpen && (
                      <div className="flex gap-[30px] justify-between">
                        <div>
                          <div className="text-[14px] font-semibold text-[#00163A] mb-[5px]">
                            {translations.amount[language]}
                          </div>
                          <div className="flex">
                            <div className="text-[14px] font-semibold uppercase">
                              {amount} {selectedWallet}
                            </div>
                            <button
                              onClick={() => handleCopy(`${amount} ${selectedWallet}`)}
                              className="flex items-center justify-center"
                            >
                              <Image
                                src="/dashboard/copy-outline.svg"
                                alt="Copy amount"
                                width={20}
                                height={20}
                                objectFit="cover"
                                priority={false}
                              />
                            </button>
                          </div>
                        </div>
                        {selectedWallet && (
                          <Image
                            src={`${wallet}`}
                            alt="QR code"
                            width={81}
                            height={81}
                            objectFit="cover"
                            priority={false}
                          />
                        )}
                      </div>
                    )}
                    {isOpen && (
                      <p className="text-[14px] font-semibold mb-[5px] text-[#00163A]">
                        {translations.address[language]}
                      </p>
                    )}
                    {isOpen && (
                      <div className="p-[5px] pr-[10px] pl-[15px] flex rounded-[5px] items-center bg-white w-full">
                        <div className="text-[#A0A5AD] break-all truncate max-w-[200px]">
                          {displayAddress()}
                        </div>
                        <button
                          onClick={() => handleCopy(findSelectedCrypto()?.address)}
                          className="flex items-center justify-center"
                        >
                          <Image
                            src="/dashboard/copy-gray.svg"
                            alt="Copy address"
                            width={20}
                            height={20}
                            objectFit="cover"
                            priority={false}
                          />
                        </button>
                      </div>
                    )}

                    <div>{message}</div>
                    <div className="flex justify-end w-full">
                      {!isOpen && (
                        <button
                          onClick={handleDeposit}
                          className="mt-4 bg-[#71baff] text-white text-[16px] font-bold px-[25px] py-[10px] rounded-full hover:bg-gray-200 transition"
                        >
                          {translations.deposit[language]}
                        </button>
                      )}
                      {isOpen && (
                        <button
                          onClick={handlePaid}
                          className="mt-4 bg-[#71baff] text-white text-[16px] font-bold px-[25px] py-[10px] rounded-full hover:bg-gray-200 transition"
                        >
                          {translations.paid[language]}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}