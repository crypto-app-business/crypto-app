// src/components/Sidebar.tsx
// import { HomeIcon, UserIcon, CogIcon } from '@heroicons/react/outline';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gradient-to-br from-gray-800 to-gray-900 text-white flex flex-col">
      {/* Логотип */}
      <div className="p-6 text-2xl font-bold tracking-widest text-center border-b border-gray-700">
        Дашборд
      </div>

      {/* Навігація */}
      <nav className="flex-grow text-black">
        <ul>
          <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center space-x-2 transition-all">
            {/* <HomeIcon className="w-6 h-6" /> */}
            <span>Главная</span>
          </li>
          <li className="p-4  hover:bg-gray-700 cursor-pointer flex items-center space-x-2 transition-all">
            {/* <UserIcon className="w-6 h-6" /> */}
            <span>Майнинг</span>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center space-x-2 transition-all">
            {/* <CogIcon className="w-6 h-6" /> */}
            <span>Налаштування</span>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center space-x-2 transition-all">
            {/* <CogIcon className="w-6 h-6" /> */}
            <span>Стейкинг</span>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center space-x-2 transition-all">
            {/* <CogIcon className="w-6 h-6" /> */}
            <span>Листинг</span>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center space-x-2 transition-all">
            {/* <CogIcon className="w-6 h-6" /> */}
            <span>NFT</span>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center space-x-2 transition-all">
            {/* <CogIcon className="w-6 h-6" /> */}
            <span>Монета</span>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center space-x-2 transition-all">
            {/* <CogIcon className="w-6 h-6" /> */}
            <span>Профиль</span>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center space-x-2 transition-all">
            {/* <CogIcon className="w-6 h-6" /> */}
            <span>Очет</span>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center space-x-2 transition-all">
            {/* <CogIcon className="w-6 h-6" /> */}
            <span>Команда</span>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center space-x-2 transition-all">
            {/* <CogIcon className="w-6 h-6" /> */}
            <span>Статистика</span>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center space-x-2 transition-all">
            {/* <CogIcon className="w-6 h-6" /> */}
            <span>Операции</span>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 text-xs text-gray-400 border-t border-gray-700">
        © 2024 Мій Проект
      </div>
    </aside>
  );
}
