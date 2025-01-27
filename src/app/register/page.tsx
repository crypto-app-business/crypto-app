'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { useRouter, useSearchParams  } from 'next/navigation';
import { useForm } from 'react-hook-form';

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({mode: 'onChange'});
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  // const [passwordStrength, setPasswordStrength] = useState(0);
  const [referrer, setReferrer] = useState<string>("none");
  // const searchParams = useSearchParams();
  const [isUsernameUnique, setIsUsernameUnique] = useState(true);

  const checkUsername = async (username: string) => {
    if (!username) return;

    try {
      const response = await fetch('/api/auth/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const result = await response.json();
      setIsUsernameUnique(result.isUnique);
    } catch (error) {
      console.error('Error checking username:', error);
    }
  };
  
  ///register?referrer=ABCD1234 для створення реферального посилання

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('referrer');
    if(ref)setReferrer(ref);
  }, []);
  
  const validatePassword2 = (password2: string): boolean | string => {
    if (password2 !== watch('password')) {
      return 'Паролі не збігаються.';
    }
    return true;
  };

  const onSubmit = async (data) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({...data, referrer} ),
    });
    const result = await res.json();
    if (result.success) {
      router.push('/dashboard'); // Перенаправлення на Dashboard
    } else {
      alert(result.error);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="bg-white p-8  w-full max-w-md sm:min-w-[600px]"
    >
      <h2 className="text-3xl  mb-6 text-center ">Регистрация акаунта</h2>
      <h3 className=" mb-6 text-center">Пожалуйста заполните все форми регистрации</h3>
      <div className='flex sm:gap-[15px] flex-col sm:flex-row'>
        <input {...register('firstName')} autoComplete="given-name" placeholder="Имя" required className="mb-4 w-full px-3 py-2 border-[#d1d6da] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#e8f0fd]" />
        <input {...register('lastName')} autoComplete="family-name" placeholder="Фамилия" required className="mb-4 w-full px-3 py-2 border-[#d1d6da] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#e8f0fd]" />
      </div>
      {errors.firstName && <p className="text-red-500 text-sm">{String(errors.firstName.message)}</p>}
      {errors.lastName && <p className="text-red-500 text-sm">{String(errors.lastName.message)}</p>}
      <div className='flex sm:gap-[15px] flex-col sm:flex-row'>
        <input {...register('username',{
          required: 'Юзернейм обезателен',
          validate: async (value) => {
            await checkUsername(value);
            return isUsernameUnique || 'Юзернейм занятий';
          },
        })} autoComplete="off" placeholder="Юзернейм" type='text' required className="mb-4 w-full px-3 py-2 border-[#d1d6da] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#e8f0fd]" />
        <input {...register('country')} placeholder="Страна" required className="mb-4 w-full px-3 py-2 border-[#d1d6da] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#e8f0fd]" />
      </div>
      {errors.username && <p className="text-red-500 text-sm">{String(errors.username.message)}</p>}
      {errors.country && <p className="text-red-500 text-sm">{String(errors.country.message)}</p>}
      <div className='flex sm:gap-[15px] flex-col sm:flex-row'>
        <input id="email"{...register('email')} autoComplete="email" placeholder="Емейл" type="email" required className="mb-4 w-full px-3 py-2 border-[#d1d6da] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#e8f0fd]"/>
        <input {...register('phone')} autoComplete="tel" type='tel' placeholder="Мобильний телефон" required className="mb-4 w-full px-3 py-2 border-[#d1d6da] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#e8f0fd]" />
      </div>
      {errors.email && <p className="text-red-500 text-sm">{String(errors.email.message)}</p>}
      {errors.phone && <p className="text-red-500 text-sm">{String(errors.phone.message)}</p>}
      <div className='flex sm:gap-[15px] flex-col sm:flex-row'>
        <div className="relative w-full">
          <input {...register('password', {
            // validate: validatePassword, 
            required: 'Пароль обязателен',
          })} type={showPassword ? 'text' : 'password'} placeholder="Пароль" required className="w-full px-3 py-2 border-[#d1d6da] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#e8f0fd]" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-[8px] right-[8px] flex items-center"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
        <input {...register('password2',{
          validate: validatePassword2, 
          required: 'Потдверджения пароля обязательно.',
        })} placeholder="Подтвердите пароль" type={showPassword ? 'text' : 'password'} required className="max-h-[40px] mb-4 w-full px-3 py-2 border-[#d1d6da] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#e8f0fd]" />
      </div>
      {referrer &&<div className='flex mb-[15px]'>
        <div className='text-[#8190b1] text-[13px] mr-[3px]'>Приглашен:</div>
        <div className='text-[#8190b1] text-[13px] font-bold'>{referrer}</div>
      </div>}
      <button type="submit" className="mb-[20px] w-full bg-[#234bef] text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 disabled:opacity-50">
        Продолжить
      </button>
    </form>     
  </div>
  );
}
