'use client';
import { useState, useEffect } from "react";
// import DepositComponent from "../DepositComponent/DepositComponent";
import Image from 'next/image';
import { cryptoOptions } from "./data"
import RequestStatusIndicator from '@/components/dashboard/RequestStatusIndicator/RequestStatusIndicator';


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

interface Wallet {
  _id?: string;
  network: string;
  wallet: string;
  createdAt?: string;
}

interface WalletFormated {
  currency: string;
  address: string;
  logo?: string;
}

interface Field {
  label: string;
  key: 'username' | 'email' | 'phone' | 'password' | 'telegramId';
  value: string;
}

const CustomSelect = ({ options, selectedWallet, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (currency) => {
    onSelect(currency);
    setIsOpen(false);
  };

  const selectedCrypto = options.find(crypto => crypto.currency === selectedWallet);

  return (
    <div className="relative w-full mb-[5px]">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-[5px] p-2 text-[#A0A5AD] text-[14px] pl-[10px] border cursor-pointer flex items-center bg-white h-[31px]"
      >
        {selectedCrypto ? (
          <>
            {selectedCrypto.logo && <Image
              src={selectedCrypto.logo}
              alt={selectedCrypto.currency}
              width={24}
              height={24}
              className="mr-2 rounded-full"
            />}
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
            Тип валюты
          </>
        )}
        <svg className="ml-auto w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 12l-5-5 1.5-1.5L10 9l3.5-3.5L15 7l-5 5z" clipRule="evenodd" />
        </svg>
      </div>

      {
        isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-[5px] shadow-lg">
            {options.map((crypto, index) => (
              <div
                key={`${crypto.currency}-${index}`}
                onClick={() => handleSelect(crypto.currency)}
                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer text-[#A0A5AD]"
              >
                {crypto.logo && <Image
                  src={crypto.logo}
                  alt={crypto.currency}
                  width={24}
                  height={24}
                  className="mr-2 rounded-full"
                />}
                {crypto.currency}
              </div>
            ))}
          </div>
        )
      }
    </div >
  );
};

export default function ProfilePanel({ user }: AdminDepositsProps) {
  const [selectedSaveWallet, setSelectedSaveWallet] = useState<string>("");
  const [amount, setAmount] = useState('');
  const [amountWallet, setAmountWallet] = useState('');
  const [message, setMessage] = useState('');
  const [messageWallet, setMessageWallet] = useState('');
  const [walletsAdded, setWalletsAdded] = useState<Wallet[]>([]);
  const [formattedWallets, setFormattedWalletsd] = useState<WalletFormated[]>([]);
  const [outputNetwork, setOutputNetwork] = useState<WalletFormated[]>([]);
  const [outputNetworkValue, setOutputNetworkValue] = useState<string>('');
  const [walletSelection, setWalletSelection] = useState<string>('');

  const [editingField, setEditingField] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState(false); // Статус гідрації
  const [token, setToken] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState<'loading' | 'success' | 'error' | null>(null);


  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const fields: Field[] = [
    { label: 'Имя', key: 'username', value: user?.username || 'no data' },
    { label: 'Email', key: 'email', value: user?.email || 'no data' },
    { label: 'Телефон', key: 'phone', value: user?.phone || 'no data' },
    { label: 'Пароль', key: 'password', value: '*********' },
    { label: 'Телеграмм id', key: 'telegramId', value: 'den5tyuo' },
  ];

  const [userName, setUserName] = useState<string>('');
  const [userAmount, setUserAmount] = useState<string>('');


  const handleEditClick = (fieldKey: string, currentValue: string) => {
    setEditingField(fieldKey);
    setInputValue(currentValue === '*********' ? '' : currentValue);
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch("/api/auth-token");
        const data = await res.json();
        setToken(data.token); // Оновлюємо токен через setToken
      } catch (err) {
        console.error("Помилка при отриманні токена:", err);
      }
    };

    fetchToken();
  }, []);

  const handleSave = async () => {
    setRequestStatus('loading');
    setIsSaving(true);
    try {

      if (!token) throw new Error('Токен не знайдено');

      const response = await fetch('/api/user/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [editingField as string]: inputValue }),
      });

      if (!response.ok) throw new Error('Помилка при збереженні');

      const data = await response.json();
      console.log('Дані оновлено:', data);
      setEditingField(null);
      setRequestStatus('success');
    } catch (error) {
      console.error('Помилка:', error);
      setRequestStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveWallet = async () => {
    setMessageWallet("")
    if (!amountWallet) {
      setMessageWallet("Введите сумму");
      return;
    }

    if (!selectedSaveWallet) {
      setMessageWallet("Выберите криптовалюту");
      return;
    }
    setRequestStatus('loading');
    try {
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user?.id,
          network: selectedSaveWallet,
          wallet: amountWallet,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessageWallet('');
        setRequestStatus('success');
      } else {
        setRequestStatus('error');
      }
    } catch (error) {
      setMessageWallet(`${error}`);
      setRequestStatus('error');
      console.error('Error creating deposit:', error);
    }
  };

  const handleWithdrawBalance = async () => {
    setMessageWallet("")
    if (!amount) {
      setMessageWallet("Введите сумму");
      return;
    }

    if (!outputNetworkValue) {
      setMessageWallet("Выберите сеть");
      return;
    }

    if (!walletSelection) {
      setMessageWallet("Выберите кошелек");
      return;
    }
    console.log(walletSelection)
    setRequestStatus('loading');

    try {
      const response = await fetch('/api/withdrawBalance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user?.id,
          amount: amount,
          currency: outputNetworkValue,
          waletId: walletSelection,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessageWallet('');
        setRequestStatus('success');
      } else {
        setRequestStatus('error');
      }
    } catch (error) {
      setMessageWallet(`${error}`);
      setRequestStatus('error');
      console.error('Error creating deposit:', error);
    }
  };

  const handleTransfer = async () => {
    setMessageWallet("")

    if (!userAmount) {
      setMessageWallet("Введите сумму");
      return;
    }

    if (!userName) {
      setMessageWallet("Введите юзернейм");
      return;
    }
    setRequestStatus('loading');

    try {
      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          amount: userAmount,
          receiverUsername: userName,
          currency: "USDT"
        }),
      });

      const data = await response.json();
      if (data.success) {
        setRequestStatus('success');
        setMessageWallet('');
      } else {
        setRequestStatus('error');
      }
    } catch (error) {
      setMessageWallet(`${error}`);
      setRequestStatus('error');
      console.error('Error creating deposit:', error);
    }
  };

  useEffect(() => {
    const fetchWallets = async () => {
      if (!user) return; // Якщо користувач не встановлений, виходимо
      setMessage('')
      try {
        const res = await fetch(`/api/wallet?id=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setWalletsAdded(data.wallets);
        } else {
          console.error('Помилка отримання гаманців');
        }
      } catch (error) {
        console.error('Помилка сервера:', error);
      }
    };

    fetchWallets();
  }, [user]);

  useEffect(() => {
    const formattedWallets = walletsAdded.map(wallet => {
      // Знайти відповідний об'єкт у cryptoOptions за currency
      const foundCrypto = cryptoOptions.find(option => option.currency === wallet.network);

      return {
        currency: wallet.network, // Назва валюти
        address: wallet.wallet, // Адреса гаманця
        logo: foundCrypto ? foundCrypto.logo : "/dashboard/crypto-logos/default.svg", // Якщо не знайдено, ставимо дефолтне лого
      };
    });
    const formattedWallets2 = walletsAdded.map(wallet => {

      return {
        currency: wallet.wallet, // Назва валюти
        address: wallet.wallet, // Адреса гаманця
      };
    });
    setFormattedWalletsd(formattedWallets)
    setOutputNetwork(formattedWallets2)
  }, [walletsAdded]);


  const handleSpinnerHide = () => {
    setRequestStatus(null); // Скидаємо статус після зникнення спінера
  };

  if (!isHydrated) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="bg-gray-50 flex flex-wrap sm:flex-row flex-col gap-[18px] w-full font-segoeui px-[30px] sm:px-0">
      <RequestStatusIndicator
        status={requestStatus}
        message={
          requestStatus === 'success'
            ? 'Успех'
            : requestStatus === 'error'
              ? 'Ошибка'
              : undefined
        }
        onHide={handleSpinnerHide}
      />
      <div className=" w-[294px]">
        <h3 className="text-[24px] font-bold mb-[20px] uppercase font-segoeui">персональная информация</h3>
        <div className=" w-[294px] bg-white rounded-[15px] p-4  mb-[20px]"
          style={{
            boxShadow: '8px 10px 18.5px 0px rgba(0, 22, 58, 0.25)',
          }}
        >
          <div className="flex items-center gap-[10px]">
            <div className="w-[104px] h-[104px] rounded-full bg-gray-200 flex items-center justify-center">
              <Image
                src="/dashboard/address-book.svg"
                alt="Your image description"
                width={104}
                height={104}
                objectFit="cover"
                priority={false}
              />
            </div>
            <div>
              <h3 className="text-[20px] font-bold">{user?.username || 'My'}</h3>
              <p className="text-[13px] text-[#a1a4ad] mb-[20px]">ID {user?.username || 'RU001587'}</p>
              <button className="text-[17px] font-bold text-white py-[7.5px] px-[16px] bg-[#3581FF4D] rounded-full">Добавить фото</button>
            </div>
          </div>
        </div>
        <div className=" w-[294px] bg-white rounded-[15px] p-4  mb-[30px]"
          style={{
            boxShadow: '8px 10px 18.5px 0px rgba(0, 22, 58, 0.25)',
          }}
        >
          <div className="mt-4 text-[14px] font-semibold">
            {fields.map((field) => (
              <div key={field.key} className="flex justify-between items-center mb-[10px]">
                {editingField === field.key ? (
                  <div className="flex items-center gap-2">
                    {field.label}
                    <input
                      type={field.key === 'password' ? 'password' : 'text'}
                      value={inputValue}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                      className="border rounded px-2 py-1 text-black"
                      autoFocus
                    />
                  </div>
                ) : (
                  <p>
                    {field.label} <span className="text-[#a1a4ad]">{field.value}</span>
                  </p>
                )}
                <button onClick={() => handleEditClick(field.key, field.value)}>
                  <Image
                    src="/dashboard/profile/bx-edit.svg"
                    alt="Edit"
                    width={20}
                    height={20}
                    objectFit="cover"
                    priority={false}
                  />
                </button>
              </div>
            ))}
            {editingField && (
              <div className="w-full flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="text-[17px] font-bold text-white py-[7.5px] px-[16px] bg-[#3581FF4D] rounded-full disabled:opacity-50"
                >
                  {isSaving ? 'Зберігаю...' : 'Сохранить'}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mb-[30px]">
          <div className="rounded-[15px] shadow-md sm:w-[294px] w-[294px] min-w-[294px] min-h-[203px]"   >
            <div className="bg-[#0d316d] text-white rounded-[15px] p-[30px] min-h-[203px]"
              style={{
                background: 'linear-gradient(180.00deg, rgba(53, 129, 255, 0),rgba(53, 129, 255, 0.35) 100%),rgb(0, 22, 58)',
                boxShadow: '8px 10px 18.5px 0px rgba(0, 22, 58, 0.25)'
              }}
            >
              <h4 className="font-bold text-[20px] uppercase text-white">Перевод</h4>
              <div className="flex w-full">
                <div className='w-full'>
                  <div className='mb-[10px] flex flex-col gap-[5px]'>
                    <label htmlFor="amount" className="text-white text-[14px] font-semibold">Сумма в $ к переводу:</label>
                    <input
                      id="amount"
                      type="number"
                      value={userAmount}
                      onChange={(e) => setUserAmount(e.target.value)}
                      placeholder={`0`}
                      className='pl-[15px] w-full rounded-[5px] text-[#A0A5AD] text-[14px] h-[31px]'
                    />
                  </div>
                  <div className='flex flex-col gap-[5px]'>
                    <label htmlFor="amount" className="text-white text-[14px] font-semibold">Имя пользователя:</label>
                    <input
                      id="amount"
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder={`den`}
                      className='pl-[15px] w-full rounded-[5px] text-[#A0A5AD] text-[14px] h-[31px]'
                    />
                  </div>

                  <div>{message}</div>
                  <div className='flex justify-end w-full'>
                    <button onClick={handleTransfer} className="mt-4 bg-[#FFFFFF4D] text-white text-[16px] font-bold px-[25px] py-[10px] rounded-full hover:bg-gray-200 transition">
                      Перевод
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >

      {/* Wallet Section */}
      <div>
        < div className="flex flex-wrap sm:flex-nowrap gap-[18px]" >
          <div className="w-[254px]">
            < h3 className="text-[20px] font-bold mb-[20px] uppercase" > привязать кошельки для вывода</h3 >
            <div className="flex flex-wrap gap-4 mb-[30px]">

              <div className="bg-[#3581FF] rounded-[15px] shadow-md w-[254px] min-h-[236px]"   >
                <div className=" text-white rounded-[15px] p-[27px] min-h-[236px]"
                  style={{
                    background: 'linear-gradient(180deg, rgba(53, 191, 255, 0) 33.1%, rgba(53, 191, 255, 0.74) 100%)',
                    borderRadius: '15px',
                    boxShadow: '8px 10px 18.5px 0px rgba(0, 22, 58, 0.25)',
                  }}
                >
                  <div className="flex w-full">
                    <div className='w-full'>
                      <label htmlFor="amount" className="text-[#00163A] text-[14px] font-semibold">Сеть:</label>
                      <CustomSelect
                        options={cryptoOptions}
                        selectedWallet={selectedSaveWallet}
                        onSelect={setSelectedSaveWallet}
                      />
                      <div className='flex flex-col gap-[5px]'>
                        <label htmlFor="amount" className="text-[#00163A] text-[14px] font-semibold">Кошелёк:</label>
                        <input
                          id="amount"
                          type="text"
                          value={amountWallet}
                          onChange={(e) => setAmountWallet(e.target.value)}
                          placeholder={`987кен6547`}
                          className='pl-[15px] w-full rounded-[5px] text-[#A0A5AD] text-[14px] h-[31px]'
                        />
                      </div>
                      <div>{messageWallet}</div>
                      <div className='flex justify-center w-full'>
                        <button onClick={handleSaveWallet} className="w-[199px] h-[41px] mt-4 bg-[#71baff] text-white text-[16px] font-bold px-[25px] py-[10px] rounded-full hover:bg-gray-200 transition">
                          Добавить кошелёк
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="flex flex-wrap gap-4 mb-[30px]">
              <div className="bg-[#3581FF] rounded-[15px] shadow-md w-[220px] h-[315px]"   >
                <div className=" text-white rounded-[15px] p-[20px] h-[315px]"
                  style={{
                    background: 'linear-gradient(180deg, rgba(53, 191, 255, 0) 33.1%, rgba(53, 191, 255, 0.74) 100%)',
                    borderRadius: '15px',
                    boxShadow: '8px 10px 18.5px 0px rgba(0, 22, 58, 0.25)',
                  }}
                >
                  < h3 className="text-[20px] font-bold mb-[10px] uppercase" > вывод</h3 >
                  <div className="flex w-full">
                    <div className='w-full'>
                      <div className='mb-[5px] flex flex-col gap-[5px]'>
                        <label htmlFor="amount" className="text-[#00163A] text-[14px] font-semibold">Сумма к выводу:</label>
                        <input
                          id="amount"
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder={`100`}
                          className='pl-[15px] w-full rounded-[5px] text-[#A0A5AD] text-[14px] h-[31px]'
                        />
                      </div>
                      <label htmlFor="amount" className="text-[#00163A] text-[14px] font-semibold">Сеть вывода:</label>
                      <CustomSelect
                        options={formattedWallets}
                        selectedWallet={outputNetworkValue}
                        onSelect={setOutputNetworkValue}
                      />

                      <label htmlFor="amount" className="text-[#00163A] text-[14px] font-semibold">Выбор кошелька:</label>
                      <CustomSelect
                        options={outputNetwork}
                        selectedWallet={walletSelection}
                        onSelect={setWalletSelection}
                      />


                      <div>{message}</div>
                      <div className='flex justify-end w-full'>
                        <button onClick={handleWithdrawBalance} className=" mt-4 bg-[#71baff] text-white text-[16px] font-bold px-[25px] py-[10px] rounded-full hover:bg-gray-200 transition">
                          Вывод
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div >

        <div className="flex flex-col gap-[20px] max-w-[315px] sm:max-w-[380px] mb-[30px]">
          <div className="flex flex-wrap justify-between py-[7px] rounded-[5px] text-[16px] w-full font-bold">
            <div>Дата добавления</div>
            <div>Кошелёк</div>
            <div className="pr-[60px]">Сеть</div>
          </div>
          {walletsAdded.map((wallet, index) => (
            <div key={`wallet-${index}`} className="flex flex-wrap justify-around border py-[7px] rounded-[5px] text-[16px] w-full">
              <div>
                {wallet.createdAt &&
                  new Date(wallet.createdAt).toLocaleString("uk-UA", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
              </div>
              <div className="font-bold">{wallet.wallet}</div>
              <div>{wallet.network}</div>
            </div>
          ))}
        </div>
      </div>
    </div >
  );
}