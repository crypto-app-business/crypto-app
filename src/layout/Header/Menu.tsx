import Link from "next/link";
import { Header as MenuComponent } from "@/types/layout/header";

interface MenuProps {
  header: MenuComponent[];
}

export function Menu({ header }: MenuProps) {
  const item = header[0];
  const menuList = item.links;

  return (
    <ul className="flex md:gap-8 gap-4 max-lg:flex-col">
      {menuList.map((menuItem, index) => (
        <li key={index}>
          <Link
            className="hover:text-primary transition ease-in-out delay-100"
            href={`#${menuItem.id}`} // Використовуємо id для якірного посилання
          >
            {menuItem.text}
          </Link>
        </li>
      ))}
    </ul>
  );
}