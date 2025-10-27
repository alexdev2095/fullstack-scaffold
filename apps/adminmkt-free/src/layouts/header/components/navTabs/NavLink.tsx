"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/core/types/navigation";
import { useNavigation } from "@/core/hooks/useNavigation";

export const NavLink = ({ href, label }: MenuItem) => {
  const { isActive } = useNavigation(href);

  return (
    <li>
      <Link
        href={href}
        className={cn(
          "py-2 px-4 rounded-full block hover:bg-background transition-colors duration-150",
          isActive && "bg-primary text-white hover:bg-primary"
        )}
      >
        {label}
      </Link>
    </li>
  );
};
