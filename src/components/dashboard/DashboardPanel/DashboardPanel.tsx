'use client';

import DepositComponent from "../DepositComponent/DepositComponent";

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

export default function DashboardPanel({ user }: AdminDepositsProps) {
  console.log(user);

  return (
    <div className="bg-gray-50 p-6 flex flex-wrap gap-[30px] w-full">
      {/* User Info Section */}
      <div className="w-max bg-white shadow-md rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-2xl">👤</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{user?.username || 'My'}</h3>
            <p className="text-sm text-gray-500">{user?.email || 'email@example.com'}</p>
            <p className="text-sm text-gray-500">ID {user?.username || 'RU001587'}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Дата регистрации: <span className="font-medium text-black">{user?.registrationDate || 'no data'}</span>
          </p>
          <p className="text-sm text-gray-500">
            Статус аккаунта: <span className="font-medium text-red-500">Не активный</span>
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            Связаться:
            <span className="text-blue-500">📞</span>
            <span className="text-blue-500">✉️</span>
          </p>
          <p className="text-sm text-gray-500">
            Ваш пригласитель: <span className="font-medium text-black">{user?.referrer || 'none'}</span>
          </p>
        </div>
      </div>

      {/* Wallet Section */}
      <div className="">
        <h3 className="text-lg font-semibold text-gray-700">Мои кошельки</h3>
        <div className="flex flex-wrap gap-4">
          {user?.balance && Object.entries(user.balance).map(([currency, amount]) => (
            <div key={currency} className="bg-blue p-3 rounded-lg shadow-md">
              <div className="text-white rounded-lg p-6">
                <h4 className="mb-4 text-xl font-semibold">{amount} {currency}</h4>
                <p className="text-sm text-gray-200">Баланс кошелька {currency}</p>
                <div className="flex justify-center">
                  <DepositComponent id={user?.id}></DepositComponent>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
