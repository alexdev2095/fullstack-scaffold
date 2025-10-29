"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { Separator } from "@/components/ui/separator";
import { IoLogOutOutline, IoMenuOutline } from "react-icons/io5";
import { Logo } from "@/components/ui-custom/logo";
import { Button } from "@/components/ui/button";
import { NavTabs } from "@/components/ui-custom/nav-tabs/NavTabs";
import { menuConfig, menuSiderbar } from "./menuSiderbar";

export function SidebarContainer() {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  const fnShowSidebar = () => setShowSidebar(false);

  return (
    <>
      <aside
        className={cn(
          "fixed -left-full md:left-0 md:static bg-background w-24 h-screen overflow-auto pb-5 flex flex-col items-center justify-between z-50 transition-all duration-150 ease-in-out",
          showSidebar && "left-0"
        )}
      >
        <section>
          <div className="h-20 flex items-center justify-center">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          <NavTabs
            menuItems={menuSiderbar}
            onItemClick={fnShowSidebar}
            className="bg-secondary rounded-full p-1 space-y-1"
            classNameLink="flex size-10 mx-auto items-center justify-center rounded-full hover:bg-background transition-colors duration-150"
          ></NavTabs>

          <Separator className="my-5" />

          <NavTabs
            menuItems={menuConfig}
            onItemClick={fnShowSidebar}
            className="bg-secondary rounded-full p-1 space-y-1"
            classNameLink="flex size-10 mx-auto items-center justify-center rounded-full hover:bg-background transition-colors duration-150"
          ></NavTabs>
        </section>

        <section>
          <ul className="bg-secondary rounded-full p-1 space-y-1">
            <li>
              <Link
                href="/auth/login"
                onClick={() => setShowSidebar(false)}
                className={cn(
                  "flex size-10 mx-auto items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-background"
                )}
              >
                <IoLogOutOutline className="size-5" />
              </Link>
            </li>
          </ul>
        </section>
      </aside>

      <Button
        className="fixed top-5 left-5 z-40"
        size="icon"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <IoMenuOutline className="size-5" />
      </Button>
      <div
        role="button"
        onClick={() => setShowSidebar(false)}
        className={cn(
          "fixed z-40 bg-black/70 left-0 top-0 w-full h-full",
          !showSidebar && "hidden"
        )}
      />
    </>
  );
}
