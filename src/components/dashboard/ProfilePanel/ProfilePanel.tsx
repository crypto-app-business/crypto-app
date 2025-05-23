'use client';
import { useState, useEffect } from "react";
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
  telegramId: string;
  avatar?: string;
}

interface AdminDepositsProps {
  user: User;
  setUser: (user: User) => void;
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
  network?: string;
}

interface NetworkOption {
  currency: string;
  logo?: string;
}

interface Field {
  label: string;
  key: 'username' | 'email' | 'phone' | 'password' | 'telegramId';
  value: string;
}

interface CustomSelectProps {
  options: { currency: string; address?: string; logo?: string; network?: string }[];
  selectedWallet: string;
  onSelect: (currency: string) => void;
  titleName?: string;
}

const CustomSelect = ({ options, selectedWallet, onSelect, titleName }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguageStore();

  const translations = {
    currencyType: {
      ru: "Тип валюты",
      en: "Currency type",
    },
    currencyType2: {
      ru: "Кошелёк",
      en: "Wallet",
    },
  };

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
            <span className="truncate flex-1">{selectedCrypto.currency}</span>
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
            {titleName ? translations.currencyType2[language] : translations.currencyType[language]}
          </>
        )}
        <svg className="ml-auto w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 12l-5-5 1.5-1.5L10 9l3.5-3.5L15 7l-5 5z" clipRule="evenodd" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-[5px] shadow-lg max-h-[200px] overflow-y-auto">
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
              <span className="truncate flex-1">{crypto.currency}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function ProfilePanel({ user, setUser }: AdminDepositsProps) {
  const { language } = useLanguageStore();
  const [selectedSaveWallet, setSelectedSaveWallet] = useState<string>("");
  const [amount, setAmount] = useState('');
  const [amountWallet, setAmountWallet] = useState('');
  const [message, setMessage] = useState('');
  const [messageWallet, setMessageWallet] = useState('');
  const [walletsAdded, setWalletsAdded] = useState<Wallet[]>([]);
  const [, setFormattedWalletsd] = useState<WalletFormated[]>([]);
  const [outputNetwork, setOutputNetwork] = useState<WalletFormated[]>([]);
  const [outputNetworkOptions, setOutputNetworkOptions] = useState<NetworkOption[]>([]);
  const [outputNetworkValue, setOutputNetworkValue] = useState<string>('');
  const [walletSelection, setWalletSelection] = useState<string>('');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState<'loading' | 'success' | 'error' | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.avatar || null);

  const translations = {
    loading: {
      ru: "Загрузка...",
      en: "Loading...",
    },
    personalInfo: {
      ru: "персональная информация",
      en: "Personal Information",
    },
    addPhoto: {
      ru: "Добавить фото",
      en: "Add Photo",
    },
    uploadPhoto: {
      ru: "Загрузить фото",
      en: "Upload Photo",
    },
    fields: {
      username: {
        ru: "Имя",
        en: "Name",
      },
      email: {
        ru: "Email",
        en: "Email",
      },
      phone: {
        ru: "Телефон",
        en: "Phone",
      },
      password: {
        ru: "Пароль",
        en: "Password",
      },
      telegramId: {
        ru: "Телеграмм id",
        en: "Telegram ID",
      },
      noData: {
        ru: "нет данных",
        en: "no data",
      },
    },
    saving: {
      ru: "Зберігаю...",
      en: "Saving...",
    },
    save: {
      ru: "Сохранить",
      en: "Save",
    },
    transfer: {
      ru: "Перевод",
      en: "Transfer",
    },
    amountToTransfer: {
      ru: "Сумма в $ к переводу:",
      en: "Amount in $ to transfer:",
    },
    username: {
      ru: "Имя пользователя:",
      en: "Username:",
    },
    bindWallets: {
      ru: "привязать кошельки для вывода",
      en: "Bind Wallets for Withdrawal",
    },
    network: {
      ru: "Сеть:",
      en: "Network:",
    },
    wallet: {
      ru: "Кошелёк:",
      en: "Wallet:",
    },
    addWallet: {
      ru: "Добавить кошелёк",
      en: "Add Wallet",
    },
    withdrawal: {
      ru: "вывод",
      en: "Withdrawal",
    },
    amountToWithdraw: {
      ru: "Сумма к выводу:",
      en: "Amount to withdraw:",
    },
    withdrawalNetwork: {
      ru: "Сеть вывода:",
      en: "Withdrawal Network:",
    },
    walletSelection: {
      ru: "Выбор кошелька:",
      en: "Wallet Selection:",
    },
    withdraw: {
      ru: "Вывод",
      en: "Withdraw",
    },
    walletHeaders: {
      dateAdded: {
        ru: "Дата добавления",
        en: "Date Added",
      },
      wallet: {
        ru: "Кошелёк",
        en: "Wallet",
      },
      network: {
        ru: "Сеть",
        en: "Network",
      },
    },
    errors: {
      enterAmount: {
        ru: "Введите сумму",
        en: "Enter amount",
      },
      selectCrypto: {
        ru: "Выберите криптовалюту",
        en: "Select cryptocurrency",
      },
      selectNetwork: {
        ru: "Выберите сеть",
        en: "Select network",
      },
      selectWallet: {
        ru: "Выберите кошелек",
        en: "Select wallet",
      },
      enterUsername: {
        ru: "Введите юзернейм",
        en: "Enter username",
      },
      tokenNotFound: {
        ru: "Токен не найдено",
        en: "Token not found",
      },
      saveError: {
        ru: "Помилка при збереженні",
        en: "Error while saving",
      },
      selectFile: {
        ru: "Выберите файл",
        en: "Select a file",
      },
      uploadError: {
        ru: "Ошибка при загрузке фото",
        en: "Error uploading photo",
      },
      fileTooLarge: {
        ru: "Файл слишком большой (макс. 20 МБ)",
        en: "File too large (max 20 MB)",
      },
      invalidFileFormat: {
        ru: "Недопустимый формат файла (SVG не поддерживается)",
        en: "Invalid file format (SVG is not supported)",
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
    setIsHydrated(true);
  }, []);

  const fields: Field[] = [
    // { label: translations.fields.username[language], key: 'username', value: user?.username || translations.fields.noData[language] },
    { label: translations.fields.email[language], key: 'email', value: user?.email || translations.fields.noData[language] },
    { label: translations.fields.phone[language], key: 'phone', value: user?.phone || translations.fields.noData[language] },
    { label: translations.fields.password[language], key: 'password', value: '*********' },
    { label: translations.fields.telegramId[language], key: 'telegramId', value: user?.telegramId || translations.fields.noData[language] },
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
        setToken(data.token);
      } catch (err) {
        console.error("Error fetching token:", err);
      }
    };

    fetchToken();
  }, []);

  const handleSave = async () => {
    setRequestStatus('loading');
    setIsSaving(true);
    try {
      if (!token) throw new Error(translations.errors.tokenNotFound[language]);

      const response = await fetch('/api/user/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [editingField as string]: inputValue }),
      });

      if (!response.ok) throw new Error(translations.errors.saveError[language]);

      const data = await response.json();
      setUser(data.user);
      setEditingField(null);
      setRequestStatus('success');
    } catch (error) {
      console.error('Error:', error);
      setRequestStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Перевірка розміру файлу (20 МБ = 20 * 1024 * 1024 байт)
      if (file.size > 20 * 1024 * 1024) {
        setMessageWallet(translations.errors.fileTooLarge[language]);
        return;
      }
      // Перевірка формату файлу (виключити SVG)
      if (file.type === 'image/svg+xml') {
        setMessageWallet(translations.errors.invalidFileFormat[language]);
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setMessageWallet('');
    }
  };

  const handleUploadPhoto = async () => {
    if (!selectedFile) {
      setMessageWallet(translations.errors.selectFile[language]);
      return;
    }

    if (!token) {
      setMessageWallet(translations.errors.tokenNotFound[language]);
      return;
    }

    setRequestStatus('loading');
    try {
      const formData = new FormData();
      formData.append('avatar', selectedFile);
      formData.append('userId', user.id);

      const response = await fetch('/api/upload-avatar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setUser({ ...user, avatar: data.avatarUrl });
        setSelectedFile(null);
        setRequestStatus('success');
        setMessageWallet('');
      } else {
        throw new Error(data.message || translations.errors.uploadError[language]);
      }
    } catch (error) {
      setMessageWallet(`${error}`);
      setRequestStatus('error');
      console.error('Error uploading photo:', error);
    }
  };

  const handleSaveWallet = async () => {
    setMessageWallet("");
    if (!amountWallet) {
      setMessageWallet(translations.errors.enterAmount[language]);
      return;
    }

    if (!selectedSaveWallet) {
      setMessageWallet(translations.errors.selectCrypto[language]);
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
        const newWallet = {
          _id: data.wallet?._id || Date.now().toString(),
          network: selectedSaveWallet,
          wallet: amountWallet,
          createdAt: new Date().toISOString(),
        };

        setWalletsAdded((prevWallets) => [...prevWallets, newWallet]);
        setAmountWallet('');
        setSelectedSaveWallet('');
        setMessageWallet('');
        setRequestStatus('success');
      } else {
        setRequestStatus('error');
        setMessageWallet(data.message || 'Помилка при збереженні гаманця');
      }
    } catch (error) {
      setMessageWallet(`${error}`);
      setRequestStatus('error');
      console.error('Error creating wallet:', error);
    }
  };

  const handleWithdrawBalance = async () => {
    setMessageWallet("");
    if (!amount) {
      setMessageWallet(translations.errors.enterAmount[language]);
      return;
    }

    if (!outputNetworkValue) {
      setMessageWallet(translations.errors.selectNetwork[language]);
      return;
    }

    if (!walletSelection) {
      setMessageWallet(translations.errors.selectWallet[language]);
      return;
    }

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
    setMessageWallet("");
    if (!userAmount) {
      setMessageWallet(translations.errors.enterAmount[language]);
      return;
    }

    if (!userName) {
      setMessageWallet(translations.errors.enterUsername[language]);
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
          username: userName,
          currency: "USDT",
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
      if (!user) return;
      setMessage('');
      try {
        const res = await fetch(`/api/wallet?id=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setWalletsAdded(data.wallets);
        } else {
          console.error('Error fetching wallets');
        }
      } catch (error) {
        console.error('Server error:', error);
      }
    };

    fetchWallets();
  }, [user]);

  useEffect(() => {
    const formattedWallets = walletsAdded.map(wallet => {
      const foundCrypto = cryptoOptions.find(option => option.currency === wallet.network);
      return {
        currency: wallet.network,
        address: wallet.wallet,
        logo: foundCrypto ? foundCrypto.logo : "/dashboard/crypto-logos/default.svg",
      };
    });

    const formattedWalletsForSelection = walletsAdded.map(wallet => ({
      currency: wallet.wallet,
      address: wallet.wallet,
      network: wallet.network,
    }));

    const uniqueNetworks = Array.from(new Set(walletsAdded.map(wallet => wallet.network))).map(network => {
      const foundCrypto = cryptoOptions.find(option => option.currency === network);
      return {
        currency: network,
        logo: foundCrypto ? foundCrypto.logo : "/dashboard/crypto-logos/default.svg",
      };
    });

    setFormattedWalletsd(formattedWallets);
    setOutputNetwork(formattedWalletsForSelection);
    setOutputNetworkOptions(uniqueNetworks);
  }, [walletsAdded]);

  // Очищення URL для попереднього перегляду
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleNetworkSelect = (network: string) => {
    setOutputNetworkValue(network);
    setWalletSelection('');
  };

  const handleWalletSelect = (wallet: string) => {
    setWalletSelection(wallet);
    const selectedWallet = walletsAdded.find(w => w.wallet === wallet);
    if (selectedWallet) {
      setOutputNetworkValue(selectedWallet.network);
    }
  };

  const filteredWallets = outputNetworkValue
    ? outputNetwork.filter(wallet => wallet.network === outputNetworkValue)
    : outputNetwork;

  const filteredNetworks = walletSelection
    ? outputNetworkOptions.filter(option => {
      const selectedWallet = walletsAdded.find(w => w.wallet === walletSelection);
      return selectedWallet && selectedWallet.network === option.currency;
    })
    : outputNetworkOptions;

  const handleSpinnerHide = () => {
    setRequestStatus(null);
  };

  if (!isHydrated) {
    return <div>{translations.loading[language]}</div>;
  }

  return (
    <div className="bg-gray-50 flex flex-wrap sm:flex-row flex-col gap-[18px] w-full font-segoeui px-[30px] sm:px-0">
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
      <div className="w-[294px]">
        <h3 className="text-[24px] font-bold mb-[20px] uppercase font-segoeui">
          {translations.personalInfo[language]}
        </h3>
        <div
          className="w-[294px] bg-white rounded-[15px] p-4 mb-[20px]"
          style={{
            boxShadow: '8px 10px 18.5px 0px rgba(0, 22, 58, 0.25)',
          }}
        >
          <div className="flex items-center gap-[10px]">
            <div className="w-[104px] h-[104px] rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <Image
                src={
                  previewUrl ||
                  (user.avatar ? `${user.avatar}?id=${user.avatar.split('/').pop()}` : "/dashboard/address-book.svg")
                }
                alt="Profile image"
                width={104}
                height={104}
                className="object-cover"
                priority={false}
              />
            </div>
            <div>
              <h3 className="text-[20px] font-bold">{user?.username || ''}</h3>
              <p className="text-[13px] text-[#a1a4ad] mb-[10px]">ID {user?.username || ''}</p>
              <input
                type="file"
                accept="image/*, !image/svg+xml"
                onChange={handleFileChange}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className="text-[17px] font-bold text-white py-[7.5px] px-[16px] bg-[#3581FF4D] rounded-full cursor-pointer inline-block mb-[5px]"
              >
                {translations.addPhoto[language]}
              </label>
              {selectedFile && (
                <button
                  onClick={handleUploadPhoto}
                  className="text-[17px] font-bold text-white py-[7.5px] px-[16px] bg-[#3581FF] rounded-full"
                >
                  {translations.uploadPhoto[language]}
                </button>
              )}
            </div>
          </div>
          <div className="text-red-500 text-[12px] min-h-[16px] mt-[5px]">{messageWallet}</div>
        </div>
        <div
          className="w-[294px] bg-white rounded-[15px] p-4 mb-[30px]"
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
                  {isSaving ? translations.saving[language] : translations.save[language]}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mb-[30px]">
          <div className="rounded-[15px] shadow-md sm:w-[294px] w-[294px] min-w-[294px] min-h-[203px]">
            <div
              className="bg-[#0d316d] text-white rounded-[15px] p-[30px] min-h-[203px]"
              style={{
                background: 'linear-gradient(180.00deg, rgba(53, 129, 255, 0),rgba(53, 129, 255, 0.35) 100%),rgb(0, 22, 58)',
                boxShadow: '8px 10px 18.5px 0px rgba(0, 22, 58, 0.25)',
              }}
            >
              <h4 className="font-bold text-[20px] uppercase text-white">{translations.transfer[language]}</h4>
              <div className="flex w-full">
                <div className="w-full">
                  <div className="mb-[10px] flex flex-col gap-[5px]">
                    <label htmlFor="amount" className="text-white text-[14px] font-semibold">
                      {translations.amountToTransfer[language]}
                    </label>
                    <input
                      id="amount"
                      type="number"
                      value={userAmount}
                      onChange={(e) => setUserAmount(e.target.value)}
                      placeholder="0"
                      className="pl-[15px] w-full rounded-[5px] text-[#A0A5AD] text-[14px] h-[31px]"
                    />
                  </div>
                  <div className="flex flex-col gap-[5px]">
                    <label htmlFor="amount" className="text-white text-[14px] font-semibold">
                      {translations.username[language]}
                    </label>
                    <input
                      id="amount"
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder=""
                      className="pl-[15px] w-full rounded-[5px] text-[#A0A5AD] text-[14px] h-[31px]"
                    />
                  </div>
                  <div>{message}</div>
                  <div className="flex justify-end w-full">
                    <button
                      onClick={handleTransfer}
                      className="mt-4 bg-[#FFFFFF4D] text-white text-[16px] font-bold px-[25px] py-[10px] rounded-full hover:bg-gray-200 transition"
                    >
                      {translations.transfer[language]}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Section */}
      <div>
        <div className="flex flex-wrap sm:flex-nowrap gap-[18px]">
          <div className="w-[294px] sm:w-[254px]">
            <h3 className="text-[20px] font-bold mb-[20px] uppercase">
              {translations.bindWallets[language]}
            </h3>
            <div className="flex flex-wrap gap-4 mb-[30px]">
              <div className="bg-[#3581FF] rounded-[15px] shadow-md w-[294px] sm:w-[254px] min-h-[236px]">
                <div
                  className="text-white rounded-[15px] p-[27px] min-h-[236px]"
                  style={{
                    background: 'linear-gradient(180deg, rgba(53, 191, 255, 0) 33.1%, rgba(53, 191, 255, 0.74) 100%)',
                    borderRadius: '15px',
                    boxShadow: '8px 10px 18.5px 0px rgba(0, 22, 58, 0.25)',
                  }}
                >
                  <div className="flex w-full">
                    <div className="w-full">
                      <label htmlFor="amount" className="text-[#00163A] text-[14px] font-semibold">
                        {translations.network[language]}
                      </label>
                      <CustomSelect
                        options={cryptoOptions}
                        selectedWallet={selectedSaveWallet}
                        onSelect={setSelectedSaveWallet}
                      />
                      <div className="flex flex-col gap-[5px]">
                        <label htmlFor="amount" className="text-[#00163A] text-[14px] font-semibold">
                          {translations.wallet[language]}
                        </label>
                        <input
                          id="amount"
                          type="text"
                          value={amountWallet}
                          onChange={(e) => setAmountWallet(e.target.value)}
                          placeholder=""
                          className="pl-[15px] w-full rounded-[5px] text-[#A0A5AD] text-[14px] h-[31px]"
                        />
                      </div>
                      <div>{message}</div>
                      <div className="flex justify-center w-full">
                        <button
                          onClick={handleSaveWallet}
                          className="w-[199px] h-[41px] mt-4 bg-[#71baff] text-white text-[16px] font-bold px-[25px] py-[10px] rounded-full hover:bg-gray-200 transition"
                        >
                          {translations.addWallet[language]}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-wrap gap-4 mb-[30px]">
              <div className="bg-[#3581FF] rounded-[15px] shadow-md h-[315px] w-[294px] sm:w-[220px]">
                <div
                  className="text-white rounded-[15px] p-[20px] h-[315px]"
                  style={{
                    background: 'linear-gradient(180deg, rgba(53, 191, 255, 0) 33.1%, rgba(53, 191, 255, 0.74) 100%)',
                    borderRadius: '15px',
                    boxShadow: '8px 10px 18.5px 0px rgba(0, 22, 58, 0.25)',
                  }}
                >
                  <h3 className="text-[20px] font-bold mb-[10px] uppercase">
                    {translations.withdrawal[language]}
                  </h3>
                  <div className="flex w-full">
                    <div className="w-full">
                      <div className="mb-[5px] flex flex-col gap-[5px]">
                        <label htmlFor="amount" className="text-[#00163A] text-[14px] font-semibold">
                          {translations.amountToWithdraw[language]}
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
                      <label htmlFor="network" className="text-[#00163A] text-[14px] font-semibold">
                        {translations.withdrawalNetwork[language]}
                      </label>
                      <CustomSelect
                        options={filteredNetworks}
                        selectedWallet={outputNetworkValue}
                        onSelect={handleNetworkSelect}
                      />
                      <label htmlFor="wallet" className="text-[#00163A] text-[14px] font-semibold">
                        {translations.walletSelection[language]}
                      </label>
                      <CustomSelect
                        options={filteredWallets}
                        selectedWallet={walletSelection}
                        onSelect={handleWalletSelect}
                        titleName="wallet"
                      />
                      <div className="text-red-500 text-[12px] min-h-[16px]">{messageWallet}</div>
                      <div className="flex justify-end w-full">
                        <button
                          onClick={handleWithdrawBalance}
                          className="mt-4 bg-[#71baff] text-white text-[16px] font-bold px-[25px] py-[10px] rounded-full hover:bg-gray-200 transition"
                        >
                          {translations.withdrawal[language]}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[20px] max-w-[315px] sm:max-w-[380px] mb-[30px]">
          <div className="flex flex-wrap justify-between py-[7px] rounded-[5px] text-[16px] w-full font-bold">
            <div>{translations.walletHeaders.dateAdded[language]}</div>
            <div>{translations.walletHeaders.wallet[language]}</div>
            <div className="pr-[60px]">{translations.walletHeaders.network[language]}</div>
          </div>
          {walletsAdded.map((wallet, index) => (
            <div
              key={`wallet-${index}`}
              className="flex flex-wrap justify-around border py-[7px] rounded-[5px] text-[16px] w-full"
            >
              <div>
                {wallet.createdAt &&
                  new Date(wallet.createdAt).toLocaleString('en-US', {
                    timeZone: 'UTC',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  }).replace(/, /g, 'T').replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2')
                }
              </div>
              <div className="font-bold">{wallet.wallet}</div>
              <div>{wallet.network}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}