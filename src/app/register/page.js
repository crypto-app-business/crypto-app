'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export default function RegisterPage() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.success) {
      alert('Registration successful!');
      router.push('/dashboard'); // Перенаправлення на Dashboard
    } else {
      alert(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto mt-8">
      <input {...register('fullName')} placeholder="Full Name" required className="block mb-2 p-2" />
      <input {...register('nickname')} placeholder="Nickname" required className="block mb-2 p-2" />
      <input {...register('email')} placeholder="Email" type="email" required className="block mb-2 p-2" />
      <input {...register('password')} placeholder="Password" type="password" required className="block mb-2 p-2" />
      <input {...register('phone')} placeholder="Phone" required className="block mb-2 p-2" />
      <input {...register('country')} placeholder="Country" required className="block mb-2 p-2" />
      <button type="submit" className="bg-black text-white px-4 py-2 rounded">Register</button>
    </form>
  );
}
