import Link from "next/link";
// import { Header as MenuComponent } from "@/types/layout/header";

// interface MenuProps {
//   header: MenuComponent[];
// }


const headerMochup = [
  "Cryptocurrency",
  "Exchanges",
  "Watchlist",
  "NFT",
  "Portfolio",
  "Products",
]

export function Menu() {
  // const item = header[0];
  // const menuList: any = item.links;

  // const dropdownMenuItems = [
  //   { label: "Exchanges", href: "#" },
  //   { label: "Wallets", href: "#" },
  // ];

  return (
    <>
      <ul className="flex md:gap-8 gap-4 max-lg:flex-col">
        {headerMochup.map((menuItem: string, index: number) => (
          <li key={index}>
            <Link
              className="hover:text-primary transition ease-in-out delay-100"
              href="#"
            >
              {menuItem}
            </Link>
          </li>
        ))}
        {/* <DropdownMenu className="" onClick={undefined}>
          {dropdownMenuItems.map((item, index) => (
            <div key={index} className="py-4 max-md:-left-24">
              <Link
                className="hover:text-primary transition ease-in-out delay-100"
                href={item.href}
              >
                {item.label}
              </Link>
            </div>
          ))}
        </DropdownMenu> */}
      </ul>
    </>
  );
}
