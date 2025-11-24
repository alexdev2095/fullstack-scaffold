import { MenuItem } from "@/core/types/navigation";
import { NavTabs } from "./NavTabs";
import Link from "next/link";
import { IoAdd } from "react-icons/io5";

type NavProps = {
  menuItems?: MenuItem[];
  href?: string;
  titleButtom?: string;
};
const NavTabsContainer = ({ menuItems, href, titleButtom }: NavProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
      {menuItems ? <NavTabs menuItems={menuItems} /> : <div></div>}
      {href ? (
        <Link
          href={href}
          className="flex items-center gap-2 bg-primary text-white h-10 px-3 rounded-full transition-all duration-300 hover:ring-2 hover:ring-primary ring-offset-2 ring-offset-background"
        >
          <IoAdd className="size-4" />
          <span>{titleButtom}</span>
        </Link>
      ) : (
        <div className="h-10"></div>
      )}
    </div>
  );
};

export default NavTabsContainer;
