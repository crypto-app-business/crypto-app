'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
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

interface ValidationErrorDetail {
  message: string;
  path?: string;
  type?: string;
}

interface ErrorResponse {
  error: string;
  details?: Record<string, ValidationErrorDetail>;
}

export default function NFTActivation({ user }: ListingActivationProps) {
  const { language } = useLanguageStore();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [listingIndex, setListingIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedSessionIndex, setSelectedSessionIndex] = useState<number>(0);
  const [requestStatus, setRequestStatus] = useState<'loading' | 'success' | 'error' | null>(null);
  const [nfts, setNfts] = useState<NFT[]>([]);

  const gradients = [
    // Gradient card black
    {
      start: '#00163A',
      end: '#3581FF',
    },
    // Gradient violet
    {
      start: '#51004E',
      end: '#3581FF',
    },
    // Gradient dark
    {
      start: '#000918',
      end: '#3581FF',
    },
  ];

  const translations = {
    forDuration: {
      ru: 'на',
      en: 'for',
    },
    dailyReward: {
      ru: 'Ежедневная выплата:',
      en: 'Daily reward:',
    },
    invest: {
      ru: 'Открыть',
      en: 'Open',
    },
    errors: {
      insufficientFunds: {
        ru: 'Недостаточно денег',
        en: 'Insufficient funds',
      },
      serverError: {
        ru: 'Ошибка сервера',
        en: 'Server error',
      },
      serverErrorRetry: {
        ru: 'Ошибка сервера. Попробуйте позже.',
        en: 'Server error. Try again later.',
      },
    },
    success: {
      listingActivated: {
        ru: 'NFT успешно куплен',
        en: 'NFT successfully purchased',
      },
    },
    requestStatus: {
      success: {
        ru: 'Успех',
        en: 'Success',
      },
      error: {
        ru: 'Ошибка',
        en: 'Error',
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
        console.error('Ошибка загрузки NFT:', error);
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
            currency: 'USDT',
            amount: nft.price,
          }),
        });

        if (response.ok) {
          setSuccess(translations.success.listingActivated[language]);
          setRequestStatus('success');
          setIsOpen(false);
        } else {
          const { error: responseError, details } = await response.json() as ErrorResponse;
          setError(
            responseError === 'Validation Error'
              ? `${translations.errors.serverError[language]}: ${
                  details && Object.keys(details).length > 0
                    ? Object.values(details)[0]?.message || 'Unknown validation error'
                    : 'Unknown validation error'
                }`
              : responseError || translations.errors.serverError[language]
          );
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
        const dailyReward = (nft.price * (nft.percentage / 100)) / nft.durationDays;

        const gradientIndex = index % gradients.length;
        const selectedGradient = gradients[gradientIndex];

        return (
          <div
            key={index}
            className="text-white rounded-[30px] gap-[6px] p-[30px] mb-[30px] sm:w-[388px] w-[346px] relative"
            style={{
              background: `linear-gradient(180deg, ${selectedGradient.start} 0%, ${selectedGradient.end} 100%)`,
              boxShadow: '8px 10px 18.5px 0px rgba(0, 22, 58, 0.25)',
            }}
          >
            <div className="flex gap-[30px] mb-[20px]">
              <div className="w-[139px] h-[139px] rounded-[15px]  border-[10px] border-[#3581FF4D]">
                <Image
                  src={`/api/nft/image/${nft.imageId}`}
                  alt={nft.name}
                  width={139}
                  height={139}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div>
                <div className="text-[#3581FF] text-[30px] font-bold">{nft.name}</div>
                <div className="text-[24px] font-bold">
                  {nft.percentage}%{' '}
                  <span className="text-[14px]">
                    ({translations.forDuration[language]} {nft.durationDays}{' '}
                    {language === 'ru' ? 'дней' : 'days'})
                  </span>
                </div>
                <div className="text-[10px]">
                  {translations.dailyReward[language]} ${dailyReward.toFixed(2)}
                </div>
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