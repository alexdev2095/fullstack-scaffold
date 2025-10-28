"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/core/hooks/useNavigation";

interface LinkProps {
  href: string;
  label?: string;
  children: React.ReactNode;
}

export const NavLink = ({ href, children }: LinkProps) => {
  const { isActive } = useNavigation(href);

  return (
    <li>
      <Link
        href={href}
        className={cn(
          "py-2 px-4 rounded-full block hover:bg-secondary transition-colors duration-150",
          isActive && "bg-primary text-white hover:bg-primary"
        )}
      >
        {children}
      </Link>
    </li>
  );
};
