import { MenuItem } from "@/core/types/navigation";
import { NavLink } from "./NavLink";

type NavTabsProps = {
  menuItems: MenuItem[];
};
export const NavTabs = ({ menuItems }: NavTabsProps) => {
  return (
    <ul className="bg-background p-2 rounded-3xl md:rounded-full flex flex-col md:flex-row gap-5 w-full md:w-fit">
      {menuItems.map((item) => (
        <NavLink key={item.href} href={item.href} children={item.children} />
      ))}
    </ul>
  );
};
