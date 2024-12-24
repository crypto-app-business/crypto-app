// import { HomeIcon, UserIcon, CogIcon } from '@heroicons/react/outline';
import Link from "next/link";

export default function Sidebar() {

  const links: { text: string; href: string }[] =[
    {
      text: "Главная",
      href: "/dashboard",
    },
    {
      text: "Майнинг",
      href: "/dashboard/mining",
    },
    {
      text: "Настройки",
      href: "#",
    },
    {
      text: "Стейкинг",
      href: "#",
    },
    {
      text: "Листинг",
      href: "#",
    },
    {
      text: "NFT",
      href: "#",
    },
    {
      text: "Монета",
      href: "#",
    },
    {
      text: "Профиль",
      href: "#",
    },
    {
      text: "Очет",
      href: "#",
    },
    {
      text: "Команда",
      href: "#",
    },
    {
      text: "Статистика",
      href: "#",
    },
    {
      text: "Операции",
      href: "#",
    },
  ]

  return (
    <aside className="w-64 bg-gradient-to-br from-gray-800 to-gray-900 text-white flex flex-col">
      {/* Логотип */}
      {/* <div className="p-6 text-2xl font-bold tracking-widest text-center border-b border-gray-700">
        Дашборд
      </div> */}
      {/* Навігація */}
      <nav className="flex-grow text-white bg-[#324458] rounded">
        <ul>
          {links.map((elem:{ text: string; href: string }, index: number)=>(
            <Link href={elem.href} key={index}>
              <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center space-x-2 transition-all">
                {/* <HomeIcon className="w-6 h-6" /> */}
                {elem.text}
              </li>
            </Link>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      {/* <div className="p-4 text-xs text-gray-400 border-t border-gray-700">
        © 2024 Мій Проект
      </div> */}
    </aside>
  );
}
