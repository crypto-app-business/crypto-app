'use client';
import { useState } from "react";
// import DepositComponent from "../DepositComponent/DepositComponent";
import Image from 'next/image';
import { cryptoOptions } from "./data"


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
        )
      }
    </div >
  );
};

export default function ProfilePanel({ user }: AdminDepositsProps) {
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const [amount, setAmount] = useState('');
  const [wallet, setWallet] = useState('');
  const [message, setMessage] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
console.log(wallet)

  const handleDeposit = async () => {
    setMessage("")
    if (!amount) {
      setMessage("Введите сумму");
      return;
    }

    if (!selectedWallet) {
      setMessage("Выберите криптовалюту");
      return;
    }

    // setMessage(`Для оформления баланса, отправтье ${amount} ${selectedWallet} на кошелек ниже`);
    // setWallet(wallets[selectedWallet]);
    setIsOpen(true);
    console.log(isPending)
    setIsPending(true);

    const selectedCrypto = findSelectedCrypto();

    if (selectedCrypto) {
      console.log(selectedCrypto)
      setWallet(selectedCrypto.qr); // Зберігаємо лого вибраної криптовалюти
    }
  };

  const handlePaid = async () => {
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
        setIsOpen(false)
        alert('Deposit created successfully! Waiting for confirmation.');
        setIsPending(false);
        setAmount('');
        setMessage('');
        setWallet('');
      } else {
        alert('Failed to create deposit. Try again later.');
      }
    } catch (error) {
      console.error('Error creating deposit:', error);
    }
  };

  const findSelectedCrypto = () => {
    return cryptoOptions.find(crypto => crypto.currency === selectedWallet);
  };

  return (
    <div className="bg-gray-50 flex flex-wrap sm:flex-row flex-col gap-[18px] w-full font-segoeui px-[30px] sm:px-0">
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
            <div className="flex justify-between items-center mb-[10px]">
              <p>Имя <span className="text-[#a1a4ad]">{user?.username || 'no data'}</span></p>
              <button>
                <Image
                  src="/dashboard/profile/bx-edit.svg"
                  alt="Your image description"
                  width={20}
                  height={20}
                  objectFit="cover"
                  priority={false}
                />
              </button>
            </div>
            <div className="flex justify-between items-center mb-[10px]">
              <p>Email <span className="text-[#a1a4ad]">{user?.email || 'no data'}</span></p>
              <button>
                <Image
                  src="/dashboard/profile/bx-edit.svg"
                  alt="Your image description"
                  width={20}
                  height={20}
                  objectFit="cover"
                  priority={false}
                />
              </button>
            </div>
            <div className="flex justify-between items-center mb-[10px]">
              <p>Телефон <span className="text-[#a1a4ad]">{user?.phone || 'no data'}</span></p>
              <button>
                <Image
                  src="/dashboard/profile/bx-edit.svg"
                  alt="Your image description"
                  width={20}
                  height={20}
                  objectFit="cover"
                  priority={false}
                />
              </button>
            </div>
            <div className="flex justify-between items-center mb-[10px]">
              <p>Пароль <span className="text-[#a1a4ad]">{false || '*********'}</span></p>
              <button>
                <Image
                  src="/dashboard/profile/bx-edit.svg"
                  alt="Your image description"
                  width={20}
                  height={20}
                  objectFit="cover"
                  priority={false}
                />
              </button>
            </div>
            <div className="flex justify-between items-center mb-[10px]">
              <p>Телеграмм id <span className="text-[#a1a4ad]">{false || 'den5tyuo'}</span></p>
              <button>
                <Image
                  src="/dashboard/profile/bx-edit.svg"
                  alt="Your image description"
                  width={20}
                  height={20}
                  objectFit="cover"
                  priority={false}
                />
              </button>
            </div>
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
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={`0`}
                      className='pl-[15px] w-full rounded-[5px] text-[#A0A5AD] text-[14px] h-[31px]'
                    />
                  </div>
                  <div className='flex flex-col gap-[5px]'>
                    <label htmlFor="amount" className="text-white text-[14px] font-semibold">Имя пользователя:</label>
                    <input
                      id="amount"
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={`den`}
                      className='pl-[15px] w-full rounded-[5px] text-[#A0A5AD] text-[14px] h-[31px]'
                    />
                  </div>

                  <div>{message}</div>
                  <div className='flex justify-end w-full'>
                    {!isOpen && <button onClick={handleDeposit} className="mt-4 bg-[#FFFFFF4D] text-white text-[16px] font-bold px-[25px] py-[10px] rounded-full hover:bg-gray-200 transition">
                      Перевод
                    </button>}
                    {isOpen && (
                      <button onClick={handlePaid} className="mt-4 bg-[#71baff] text-white text-[16px] font-bold px-[25px] py-[10px] rounded-full hover:bg-gray-200 transition">
                        Оплачено
                      </button>
                    )}
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
                      {!isOpen && <CustomSelect
                        options={cryptoOptions}
                        selectedWallet={selectedWallet}
                        onSelect={setSelectedWallet}
                      />}
                      {!isOpen && (<div className='flex flex-col gap-[5px]'>
                        <label htmlFor="amount" className="text-[#00163A] text-[14px] font-semibold">Кошелёк:</label>
                        <input
                          id="amount"
                          type="text"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder={`987кен6547`}
                          className='pl-[15px] w-full rounded-[5px] text-[#A0A5AD] text-[14px] h-[31px]'
                        />
                      </div>)}

                      <div>{message}</div>
                      <div className='flex justify-center w-full'>
                        {!isOpen && <button onClick={handleDeposit} className="w-[199px] h-[41px] mt-4 bg-[#71baff] text-white text-[16px] font-bold px-[25px] py-[10px] rounded-full hover:bg-gray-200 transition">
                          Добавить кошелёк
                        </button>}
                        {isOpen && (
                          <button onClick={handlePaid} className="mt-4 bg-[#71baff] text-white text-[16px] font-bold px-[25px] py-[10px] rounded-full hover:bg-gray-200 transition">
                            Оплачено
                          </button>
                        )}
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
                          placeholder={`987кен6547`}
                          className='pl-[15px] w-full rounded-[5px] text-[#A0A5AD] text-[14px] h-[31px]'
                        />
                      </div>
                      <label htmlFor="amount" className="text-[#00163A] text-[14px] font-semibold">Сеть вывода:</label>
                      <CustomSelect
                        options={cryptoOptions}
                        selectedWallet={selectedWallet}
                        onSelect={setSelectedWallet}
                      />
                      <label htmlFor="amount" className="text-[#00163A] text-[14px] font-semibold">Выбор кошелька::</label>
                      <CustomSelect
                        options={cryptoOptions}
                        selectedWallet={selectedWallet}
                        onSelect={setSelectedWallet}
                      />


                      <div>{message}</div>
                      <div className='flex justify-end w-full'>
                        {!isOpen && <button onClick={handleDeposit} className=" mt-4 bg-[#71baff] text-white text-[16px] font-bold px-[25px] py-[10px] rounded-full hover:bg-gray-200 transition">
                          Вывод
                        </button>}
                        {isOpen && (
                          <button onClick={handlePaid} className="mt-4 bg-[#71baff] text-white text-[16px] font-bold px-[25px] py-[10px] rounded-full hover:bg-gray-200 transition">
                            Оплачено
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div >

        {/* <div className="flex flex-col gap-[17px] max-w-[275px]">
              <h3 className="text-[24px] font-bold mb-[25px] uppercase">Последнии регистрации</h3>
              {lastRegistrations.length > 0 && (
                lastRegistrations.map(({ username, line, registrationDate, firstName}, index) => (
                  <div key={index} className="flex flex-wrap justify-around border py-[7px] rounded-[5px] text-[16px]">
                    <div>{firstName}</div>
                    <div className="font-bold">линия: {line}</div>
                    <div>{new Date(registrationDate.split('.').reverse().join('-')).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}</div>
                    <div>{username}</div>
                  </div>
                ))
              )}
            </div> */}
        <div className="flex flex-col gap-[20px] max-w-[315px] sm:max-w-[380px] mb-[30px]">
          <div className="flex flex-wrap justify-between py-[7px] rounded-[5px] text-[16px] w-full font-bold">
            <div>Дата добавления</div>
            <div>Кошелёк</div>
            <div className="pr-[60px]">Сеть</div>
          </div>
          <div className="flex flex-wrap justify-around border py-[7px] rounded-[5px] text-[16px] w-full">
            <div>18.04.2024 17:08</div>
            <div className="font-bold">{"987кен6547"}</div>
            <div>USDT TRC20</div>
          </div>
        </div>
      </div>
    </div >
  );
}