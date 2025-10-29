import { HeaderContainer } from "@/layout/header/HeaderContainer";
import { SidebarContainer } from "@/layout/sidebar/SiderbarContainer";
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex overflow-hidden">
      <SidebarContainer />
      <div className="flex-1 h-full">
        <HeaderContainer />
        <main className="h-[calc(100%-80px)] overflow-auto bg-secondary md:rounded-tl-3xl p-5">
          {children}
        </main>
      </div>
    </div>
  );
}
