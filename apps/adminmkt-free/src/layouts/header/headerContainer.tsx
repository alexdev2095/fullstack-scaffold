// import { NavTabs } from "./components/navTabs/NavTabs";
import { NavTabs } from "./components/navTabs/NavTabs";
import { UserNav } from "./user-nav";
import { ButtonToggleTheme } from "@/components/ui/button-toggle-theme";

export function Header() {
  return (
    <header className="h-20 flex items-center justify-end md:justify-between px-5">
      <section className="hidden md:block">
        <NavTabs />
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
