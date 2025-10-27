// components/navigation/NavMenu.tsx

import { menuItems } from "./menuItems";
import { NavLink } from "./NavLink";

export const NavTabs = () => {
  return (
    <ul className="bg-secondary p-1 rounded-3xl md:rounded-full flex flex-col md:flex-row gap-1 w-full md:w-fit">
      {menuItems.map((item) => (
        <NavLink key={item.href} href={item.href} label={item.label} />
      ))}
    </ul>
  );
};
