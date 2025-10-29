"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/core/hooks/useNavigation";

interface LinkProps {
  href: string;
  nav: string[];
  children: React.ReactNode;
  onClick?: () => void;
  classNameLink?: string;
}

export const NavLink = ({
  href,
  children,
  nav,
  onClick,
  classNameLink,
}: LinkProps) => {
  const { isActive } = useNavigation(nav);

  const classNameUpdate = classNameLink
    ? classNameLink
    : "py-2 px-4 rounded-full block hover:bg-secondary transition-colors duration-150";

  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          classNameUpdate,
          isActive && "bg-primary text-white hover:bg-primary"
        )}
      >
        {children}
      </Link>
    </li>
  );
};
