import Image from 'next/image';
import Link from "next/link";
import { useLanguageStore } from '@/store/useLanguageStore';

export default function Sidebar({ isSidebarOpen, toggleSidebar, setActiveTab, activeTab }) {
  const { language } = useLanguageStore();

  const links = [
    { text: { ru: "Главная", en: "Home" }, href: "/dashboard", icon: "/dashboard/sidebar-icon/grid.svg", iconBlue: "/dashboard/sidebar-icon/blue/grid.svg" },
    { text: { ru: "Майнинг", en: "Mining" }, href: "/dashboard/mining", icon: "/dashboard/sidebar-icon/node-3-connections.svg", iconBlue: "/dashboard/sidebar-icon/blue/node-3-connections.svg" },
    { text: { ru: "Стейкинг", en: "Staking" }, href: "/dashboard/staking", icon: "/dashboard/sidebar-icon/invoice.svg", iconBlue: "/dashboard/sidebar-icon/blue/invoice.svg" },
    { text: { ru: "Листинг", en: "Listing" }, href: "/dashboard/listing", icon: "/dashboard/sidebar-icon/mnemonic.svg", iconBlue: "/dashboard/sidebar-icon/blue/mnemonic.svg" },
    // { text: { ru: "NFT", en: "NFT" }, href: "/dashboard/NFT", icon: "/dashboard/sidebar-icon/nft.svg", iconBlue: "/dashboard/sidebar-icon/blue/nft.svg" },
    { text: { ru: "Профиль", en: "Profile" }, href: "/dashboard/profile", icon: "/dashboard/sidebar-icon/contacts.svg", iconBlue: "/dashboard/sidebar-icon/blue/contacts.svg" },
    { text: { ru: "Отчет", en: "Report" }, href: "/dashboard/report", icon: "/dashboard/sidebar-icon/calendar.svg", iconBlue: "/dashboard/sidebar-icon/blue/calendar.svg" },
    { text: { ru: "Команда", en: "Team" }, href: "/dashboard/teams", icon: "/dashboard/sidebar-icon/lightning.svg", iconBlue: "/dashboard/sidebar-icon/blue/lightning.svg" },
    { text: { ru: "Статистика", en: "Statistics" }, href: "/dashboard/statistics", icon: "/dashboard/sidebar-icon/graph.svg", iconBlue: "/dashboard/sidebar-icon/blue/graph.svg" },
    { text: { ru: "Операции", en: "Operations" }, href: "/dashboard/operations", icon: "/dashboard/sidebar-icon/credit-card.svg", iconBlue: "/dashboard/sidebar-icon/blue/credit-card.svg" },
  ];

  return (
    <aside className={`fixed inset-0 z-50 text-white flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-full h-full sm:w-[384px]" : "w-[370px]"}`}>
      <nav className="flex-grow text-white w-full">
        <div className="sm:hidden flex justify-end mt-[5px] mr-[5px] mb-[-30px]">
          {isSidebarOpen && (
            <div onClick={toggleSidebar} className={"sm:hidden mt-[35px] mr-[29px]"}>
              <Image src="/dashboard/cross.svg" alt="Close" width={45} height={45} priority={false} />
            </div>
          )}
        </div>
        <div className="w-full pt-[32px] pb-[32px] min-h-[100vh] sm:min-h-max">
          <ul className="w-max mr-auto ml-auto">
            {links.map((elem, index) => (
              <Link href={elem.href} key={index} onClick={() => { setActiveTab(elem.text.ru); toggleSidebar(); }}>
                <li className={`mb-[17px] font-semibold cursor-pointer flex items-center space-x-2 transition-all gap-[20px] ${activeTab === elem.text.ru ? "text-[#3581FF]" : "text-[#00163A]"}`}>
                  <Image src={activeTab === elem.text.ru ? elem.iconBlue : elem.icon} alt="Icon" width={45} height={45} priority={false} />
                  <span className='text-[24px]'>{elem.text[language]}</span>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
