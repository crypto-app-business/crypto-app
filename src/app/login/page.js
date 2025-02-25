'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8  w-full max-w-md"
      >
        <h2 className="text-3xl  mb-6 text-center ">Войти в аккаунт</h2>
        <h3 className=" mb-6 text-center">Введите свой email и пароль</h3>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            {error}
          </div>
        )}

        <div className="mb-4">
          <input
            id="email"
            {...register('email')}
            placeholder="Enter your email"
            type="email"
            required
            className="w-full px-3 py-2 border-[#d1d6da] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#e8f0fd]"
          />
        </div>

        <div className="mb-[10px]">
          <input
            id="password"
            {...register('password')}
            placeholder="Enter your password"
            type="password"
            required
            className="w-full px-3 py-2 border-[#d1d6da] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#e8f0fd]"
          />
        </div>
        <div className="mt-4 flex justify-between mb-[10px]">
          <div className='flex justify-between align-middle'>
            <input
              id="checkbox"
              {...register('checkbox')}
              type="checkbox"
              className="px-3 py-2 rounded-md focus:outline-none bg-[#e8f0fd] mr-[5px]"
            >
            </input>
            <a className="text-blue-500 hover:underline">
              Запомнить меня
            </a>
          </div>
          <Link href='/forgot-password' className="text-blue-500 hover:underline">
            Забыл пароль?
          </Link>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mb-[20px] w-full bg-[#234bef] text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 disabled:opacity-50"
        >
          {isSubmitting ? 'Входим...' : 'Войти'}
        </button>
        <div className="flex items-center w-full mb-[15px]">
          <div className="flex-grow h-[2px] bg-[#e2e2e0]"></div>
          <div className="px-4 text-center text-[#8190b1]">Или</div>
          <div className="flex-grow h-[2px] bg-[#e2e2e0]"></div>
        </div>

        <div className='flex justify-center text-center'>
          <Link href='/register' className="text-[#8190b1] pt-[7px] p-[7px]  hover:underline  w-full border rounded border-px border-[#e2e2e0]">
            Создать новый аккаунт
          </Link>
        </div>

      </form>

    </div>
  );
}