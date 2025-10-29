import { Sidebar } from "@/components/ui-custom/sidebar";
import { HeaderContainer } from "@/components/ui-custom/header/HeaderContainer";
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 h-full">
        <HeaderContainer />
        <main className="h-[calc(100%-80px)] overflow-auto bg-secondary md:rounded-tl-3xl p-5">
          {children}
        </main>
      </div>
    </div>
  );
}
