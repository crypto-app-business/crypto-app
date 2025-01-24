// Import іконки
import Image from 'next/image';
import Link from "next/link";
// import { useRouter } from "next/router";
// import { useSidebar } from "../context/SidebarContext";

export default function Sidebar({ isSidebarOpen, toggleSidebar, setActiveTab, activeTab }) {
  // const { activeTab, setActiveTab } = useSidebar();
  // const router = useRouter();
  const links: { text: string; href: string; icon: string; iconBlue: string }[] = [
    {
      text: "Главная",
      href: "/dashboard",
      icon: "/dashboard/sidebar-icon/grid.svg",
      iconBlue: "/dashboard/sidebar-icon/blue/grid.svg",
    },
    {
      text: "Майнинг",
      href: "/dashboard/mining",
      icon: "/dashboard/sidebar-icon/node-3-connections.svg",
      iconBlue: "/dashboard/sidebar-icon/blue/node-3-connections.svg",
    },
    {
      text: "Настройки",
      href: "#",
      icon: "/dashboard/sidebar-icon/gear.svg",
      iconBlue: "/dashboard/sidebar-icon/blue/gear.svg",
    },
    {
      text: "Стейкинг",
      href: "/dashboard/staking",
      icon: "/dashboard/sidebar-icon/invoice.svg",
      iconBlue: "/dashboard/sidebar-icon/blue/invoice.svg",
    },
    {
      text: "Листинг",
      href: "/dashboard/listing",
      icon: "/dashboard/sidebar-icon/mnemonic.svg",
      iconBlue: "/dashboard/sidebar-icon/blue/mnemonic.svg",
    },
    {
      text: "NFT",
      href: "#",
      icon: "/dashboard/sidebar-icon/photo.svg",
      iconBlue: "/dashboard/sidebar-icon/blue/photo.svg",
    },
    {
      text: "Монета",
      href: "#",
      icon: "/dashboard/sidebar-icon/coins.svg",
      iconBlue: "/dashboard/sidebar-icon/blue/coins.svg",
    },
    {
      text: "Профиль",
      href: "#",
      icon: "/dashboard/sidebar-icon/contacts.svg",
      iconBlue: "/dashboard/sidebar-icon/blue/contacts.svg",
    },
    {
      text: "Отчет",
      href: "/dashboard/report",
      icon: "/dashboard/sidebar-icon/calendar.svg",
      iconBlue: "/dashboard/sidebar-icon/blue/calendar.svg",
    },
    {
      text: "Команда",
      href: "/dashboard/teams",
      icon: "/dashboard/sidebar-icon/lightning.svg",
      iconBlue: "/dashboard/sidebar-icon/blue/lightning.svg",
    },
    {
      text: "Статистика",
      href: "#",
      icon: "/dashboard/sidebar-icon/graph.svg",
      iconBlue: "/dashboard/sidebar-icon/blue/graph.svg",
    },
    {
      text: "Операции",
      href: "#",
      icon: "/dashboard/sidebar-icon/credit-card.svg",
      iconBlue: "/dashboard/sidebar-icon/blue/credit-card.svg",
    },
  ];

  return (
    <aside
    className={`fixed inset-0 z-50 bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col transition-all duration-300 ease-in-out ${
      isSidebarOpen
        ? "w-full h-full sm:w-[384px] sm:h-auto rounded-none"
        : "w-[370px] h-auto rounded-[15px]"
    }`}
  >
      <nav className="flex-grow text-white bg-[#293953] w-full rounded-none sm:rounded-[15px]">
        <div className="sm:hidden flex justify-end mt-[5px] mr-[5px] mb-[-30px]">
          {isSidebarOpen && (
            <div onClick={toggleSidebar} className={"sm:hidden mt-[35px] mr-[29px]"}>
              <Image
                src="/dashboard/cross.svg"
                alt="Your image description" 
                width={45} 
                height={45} 
                objectFit="cover"
                priority={false}
              />
            </div>
          )}
        </div>
        <div className="w-full pt-[32px] pb-[32px]">
          <ul className="w-max mr-auto ml-auto">
            {links.map((elem, index) => (
              <Link href={elem.href} key={index} onClick={() => setActiveTab(elem.text)}>
                <li className={`mb-[17px] cursor-pointer flex items-center  space-x-2 transition-all  gap-[20px]
                    ${activeTab === elem.text ? "text-[#3581FF]" : ""}
                  `}>
                  <Image
                    src={activeTab === elem.text ? elem.iconBlue : elem.icon}
                    alt="Your image description" 
                    width={45} 
                    height={45} 
                    objectFit="cover"
                    priority={false}
                  />
                  <span className='text-[24px]'>{elem.text}</span>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
