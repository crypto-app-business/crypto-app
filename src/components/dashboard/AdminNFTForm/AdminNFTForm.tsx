'use client';

import { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';

interface AdminNFTFormProps {
  user: { id: string; role: string };
}

export default function AdminNFTForm({ user }: AdminNFTFormProps) {
  const { language } = useLanguageStore();
  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [percentage, setPercentage] = useState<number>(0);
  const [durationDays, setDurationDays] = useState<number>(0);
  const [activationDays, setActivationDays] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const translations = {
    addNFT: {
      ru: "Добавить NFT",
      en: "Add NFT",
    },
    name: {
      ru: "Название",
      en: "Name",
    },
    image: {
      ru: "Изображение",
      en: "Image",
    },
    percentage: {
      ru: "Процент за весь срок",
      en: "Percentage for the entire term",
    },
    durationDays: {
      ru: "Длительность (дни)",
      en: "Duration (days)",
    },
    activationDays: {
      ru: "Дни для активации",
      en: "Activation days",
    },
    price: {
      ru: "Цена (USDT)",
      en: "Price (USDT)",
    },
    submit: {
      ru: "Создать",
      en: "Create",
    },
    success: {
      ru: "NFT успешно создан!",
      en: "NFT successfully created!",
    },
    error: {
      ru: "Ошибка при создании NFT.",
      en: "Error creating NFT.",
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!image) {
      setError('Зображення обов’язкове.');
      return;
    }

    const formData = new FormData();
    formData.append('userId', user.id);
    formData.append('name', name);
    formData.append('percentage', percentage.toString());
    formData.append('durationDays', durationDays.toString());
    formData.append('activationDays', activationDays.toString());
    formData.append('price', price.toString());
    formData.append('image', image);

    try {
      const response = await fetch('/api/nft', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSuccess(translations.success[language]);
        setName('');
        setImage(null);
        setPercentage(0);
        setDurationDays(0);
        setActivationDays(0);
        setPrice(0);
      } else {
        const { error } = await response.json();
        setError(error || translations.error[language]);
      }
    } catch (error) {
      setError(translations.error[language]);
      console.log(error)
    }
  };

  if (user.role !== 'admin') {
    return null;
  }

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{translations.addNFT[language]}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">{translations.name[language]}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block">{translations.image[language]}</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block">{translations.percentage[language]}</label>
          <input
            type="number"
            value={percentage}
            onChange={(e) => setPercentage(Number(e.target.value))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block">{translations.durationDays[language]}</label>
          <input
            type="number"
            value={durationDays}
            onChange={(e) => setDurationDays(Number(e.target.value))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block">{translations.activationDays[language]}</label>
          <input
            type="number"
            value={activationDays}
            onChange={(e) => setActivationDays(Number(e.target.value))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block">{translations.price[language]}</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue text-white rounded hover:bg-blue-600">
          {translations.submit[language]}
        </button>
      </form>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {success && <div className="text-green-500 mt-2">{success}</div>}
    </div>
  );
}