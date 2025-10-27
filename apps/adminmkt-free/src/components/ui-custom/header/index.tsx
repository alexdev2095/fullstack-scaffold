import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  IoChatbubbleEllipsesOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
import { UserNav } from "./user-nav";
import { ButtonToggleTheme } from "@/components/ui/button-toggle-theme";
import { NavProducts } from "../navs/nav-products";

export function Header() {
  return (
    <header className="h-20 flex items-center justify-end md:justify-between px-5">
      <section className="hidden md:block">
        <NavProducts />
      </section>
      <section>
        <ul className="flex items-center gap-2">
          <li>
            <ButtonToggleTheme />
          </li>
          <li>
            <UserNav />
          </li>
        </ul>
      </section>
    </header>
  );
}
