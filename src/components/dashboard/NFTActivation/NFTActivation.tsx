'use client';

import { useState, useEffect } from 'react';
import RequestStatusIndicator from '@/components/dashboard/RequestStatusIndicator/RequestStatusIndicator';
import { useLanguageStore } from '@/store/useLanguageStore';

interface User {
  id: string;
  balance: Record<string, number>;
  role: string;
  username: string;
  email: string;
  referrer: string;
  phone: string;
  registrationDate: string;
}

interface NFT {
  _id: string;
  name: string;
  imageId: string;
  percentage: number;
  durationDays: number;
  activationDays: number;
  price: number;
}

interface ListingActivationProps {
  user: User;
}

export default function NFTActivation({ user }: ListingActivationProps) {
  const { language } = useLanguageStore();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  // const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [listingIndex, setListingIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedSessionIndex, setSelectedSessionIndex] = useState<number>(0);
  const [requestStatus, setRequestStatus] = useState<'loading' | 'success' | 'error' | null>(null);
  const [nfts, setNfts] = useState<NFT[]>([]);

  const translations = {
    forDuration: {
      ru: "на",
      en: "for",
    },
    dailyReward: {
      ru: "Ежедневная выплата:",
      en: "Daily reward:",
    },
    invest: {
      ru: "Открыть",
      en: "Open",
    },
    errors: {
      insufficientFunds: {
        ru: "Недостаточно денег",
        en: "Insufficient funds",
      },
      serverError: {
        ru: "Ошибка сервера",
        en: "Server error",
      },
      serverErrorRetry: {
        ru: "Ошибка сервера. Попробуйте позже.",
        en: "Server error. Try again later.",
      },
    },
    success: {
      listingActivated: {
        ru: "NFT успешно куплен",
        en: "NFT successfully purchased",
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

  // Завантажуємо NFT із сервера
  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const response = await fetch('/api/nft');
        const { data } = await response.json();
        setNfts(data);
      } catch (error) {
        console.error('Помилка завантаження NFT:', error);
      }
    };
    fetchNFTs();
  }, []);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    if (isOpen && selectedSessionIndex === index) {
      e.preventDefault();
      setError('');
      setSuccess('');
      setListingIndex(index);

      const nft = nfts[index];

      // Перевірка балансу
      if (user?.balance?.USDT < nft.price) {
        setError(translations.errors.insufficientFunds[language]);
        return;
      }

      setRequestStatus('loading');

      try {
        const response = await fetch('/api/nft-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            nftId: nft._id,
            currency: "USDT",
          }),
        });

        if (response.ok) {
          setSuccess(translations.success.listingActivated[language]);
          setRequestStatus('success');
          setIsOpen(false);
        } else {
          const { error: responseError } = await response.json();
          setError(responseError || translations.errors.serverError[language]);
          setRequestStatus('error');
        }
      } catch (error) {
        setError(translations.errors.serverErrorRetry[language]);
        setRequestStatus('error');
        console.log(error);
      }
    } else {
      setSelectedSessionIndex(index);
      setRequestStatus('error');
      setIsOpen(true);
      setError('');
    }
  };

  const handleSpinnerHide = () => {
    setRequestStatus(null);
  };

  return (
    <div className="bg-gray-50 flex flex-wrap flex-row sm:gap-[18px] gap-[10px] w-full sm:justify-start justify-center">
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
      {nfts.map((nft, index) => {
        // Розрахунок щоденної виплати
        const dailyReward = (nft.price * (nft.percentage / 100)) / nft.durationDays;

        return (
          <div
            key={index}
            className="bg-[#0d316d] text-white rounded-[15px] gap-[6px] p-[30px] mb-[30px] sm:w-[388px] w-[346px] relative"
            style={{
              background: 'linear-gradient(180.00deg, rgba(53, 129, 255, 0),rgba(53, 129, 255, 0.35) 100%),rgb(0, 22, 58)',
              boxShadow: '8px 10px 18.5px 0px rgba(0, 22, 58, 0.25)',
            }}
          >
            <div className="flex gap-[30px] mb-[20px]">
              <div className="w-[139px] h-[139px] rounded bg-blue">
                <img src={`/api/nft/image/${nft.imageId}`} alt={nft.name} className="w-full h-full object-cover rounded" />
              </div>
              <div>
                <div className="text-[#3581FF] text-[30px] font-bold">{nft.name}</div>
                <div className="text-[24px] font-bold ">{nft.percentage}% <span className='text-[14px]'>({translations.forDuration[language]} {nft.durationDays} {language === 'ru' ? 'дней' : 'days'})</span></div>
                <div className="text-[10px]">{translations.dailyReward[language]} ${dailyReward.toFixed(2)}</div>
                <div className="text-[#3581FF] text-[24px] font-bold">${nft.price}</div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={(e) => handleSubmit(e, index)}
                className="px-[25px] py-[10px] rounded-full bg-[#576f9b] hover:bg-[#3581FF]"
              >
                {translations.invest[language]}
              </button>
            </div>
            {index === listingIndex && error && <div className="text-red-500">{error}</div>}
            {index === listingIndex && success && <div className="text-green-500">{success}</div>}
          </div>
        );
      })}
    </div>
  );
}