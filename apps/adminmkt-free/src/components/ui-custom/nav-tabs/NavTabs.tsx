import { MenuItem } from "@/core/types/navigation";
import { NavLink } from "./NavLink";
import { cn } from "@/lib/utils";

type NavTabsProps = {
  menuItems: MenuItem[];
  className?: string;
  classNameLink?: string;
  onItemClick?: () => void;
};
export const NavTabs = ({
  menuItems,
  className,
  classNameLink,
  onItemClick,
}: NavTabsProps) => {
  const classNameUpdate = className
    ? className
    : "bg-background p-2 rounded-3xl md:rounded-full flex flex-col md:flex-row gap-5 w-full md:w-fit";

  return (
    <ul className={cn(classNameUpdate)}>
      {menuItems.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          children={item.children}
          nav={item.nav}
          onClick={onItemClick}
          classNameLink={classNameLink}
        />
      ))}
    </ul>
  );
};
