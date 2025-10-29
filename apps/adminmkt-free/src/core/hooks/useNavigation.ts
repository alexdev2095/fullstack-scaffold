import { usePathname } from "next/navigation";

export const useNavigation = (href: string[]) => {
  const pathname = usePathname();
  const isActive = href.includes(pathname);

  return {
    isActive,
  };
};
