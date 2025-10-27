import { usePathname } from "next/navigation";

export const useNavigation = (href: string) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return {
    isActive,
  };
};
